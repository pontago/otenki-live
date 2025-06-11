import io
from collections.abc import Callable
from typing import cast

import sahi
import sahi.predict
import torch
import torchvision
import torchvision.transforms as transforms
from loguru import logger
from PIL import Image

from app.core.object_category_mapping import CATEGORY_MAPPING
from app.core.settings import AppSettings
from app.domain.entities.live_detect_data.detect_object import DetectObject


class ObjectDetectionService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.clothing_model = None
        self.model_loaded = False

    def load_model(self, detection_model_path: str, clothing_model_path: str):
        if self.model_loaded:
            logger.info("Model is already loaded. Skipping loading process.")
            return

        torch.hub.set_dir(AppSettings.storage_dir)

        model = torchvision.models.efficientnet_v2_s(num_classes=len(AppSettings.clothing_classes))
        model.load_state_dict(torch.load(clothing_model_path, map_location=self.device))
        model.to(self.device)
        model.eval()
        self.clothing_model = model

        self.detection_model = detection_model_path

        self.sahi_detection_model = sahi.AutoDetectionModel.from_pretrained(
            # model_type="torchvision",
            # model=self.fasterrcnn_model,
            model_type="yolov8onnx",
            model_path=self.detection_model,
            category_mapping=CATEGORY_MAPPING,
            # confidence_threshold=0.8,
            confidence_threshold=0.3,
            # image_size=640,
            device=self.device,
            # load_at_init=True,
        )

        self.model_loaded = True

        # model = torchvision.models.detection.faster_rcnn.fasterrcnn_resnet50_fpn(weights=None)
        # model = torchvision.models.detection.ssdlite320_mobilenet_v3_large(weights=None)
        # model.load_state_dict(torch.load(detection_model_path))
        # model.to(self.device)
        # model.eval()
        # self.fasterrcnn_model = model
        # self.fasterrcnn_model = torchvision.models.detection.fasterrcnn_resnet50_fpn(
        #     weights=torchvision.models.detection.FasterRCNN_ResNet50_FPN_Weights.DEFAULT
        # )

    def detect_objects(self, buffer: bytes) -> DetectObject:
        image = Image.open(io.BytesIO(buffer)).convert("RGB")
        # result = sahi.predict.get_prediction(image, detection_model)
        result = sahi.predict.get_sliced_prediction(
            image,
            self.sahi_detection_model,
            # slice_height=256,
            # slice_width=256,
            slice_height=640,
            slice_width=640,
            overlap_height_ratio=0.2,
            overlap_width_ratio=0.2,
        )
        if AppSettings.env == "test":
            result.export_visuals(export_dir="demo_data/")

        detect_object = DetectObject()
        persons: list[sahi.predict.ObjectPrediction] = []
        for detection in result.object_prediction_list:
            if detection.category.name == "person":
                persons.append(detection)
            elif detection.category.name == "umbrella":
                detect_object.umbrella += 1
        detect_object.person = len(persons)

        for person in persons:
            bbox = person.bbox.to_xyxy()
            x_min, y_min, x_max, y_max = bbox

            cropped_image = image.crop((x_min, y_min, x_max, y_max))
            category_name, score = self._clothing_detection(cropped_image)

            if score >= AppSettings.clothing_confidence_thresholds:
                setattr(detect_object, category_name, getattr(detect_object, category_name) + 1)

        return detect_object

    def _clothing_detection(self, image: Image.Image):
        if self.clothing_model is None:
            raise ValueError("Clothing model is not loaded. Call load_model() first.")

        inference_transform = cast(
            Callable[[Image.Image], torch.Tensor],
            transforms.Compose(
                [
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(
                        mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225],
                    ),
                ]
            ),
        )

        input_tensor: torch.Tensor = inference_transform(image).unsqueeze(0)
        input_batch = input_tensor.to(self.device)

        with torch.no_grad():
            output = self.clothing_model(input_batch)

        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        _, predicted_class_idx = torch.max(probabilities, dim=0)

        class_idx = int(predicted_class_idx.item())
        predicted_class_name = AppSettings.clothing_classes[class_idx]

        logger.debug(f"Predicted class: {predicted_class_name}")
        logger.debug(f"Score: {probabilities[class_idx]}")

        return (predicted_class_name, probabilities[class_idx])
