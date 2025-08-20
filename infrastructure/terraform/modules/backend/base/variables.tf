variable "env" {
    type = string
}

variable "project" {
    type = string
}

variable "backend_dir" {
    type = string
}

variable "docker_dir" {
    type = string
}

variable "ecr_backend_name" {
    type = string
}

variable "ecr_ffmpeg_name" {
    type = string
}

variable "log_level" {
    type = string
    default = "INFO"
}

variable "ses_sender_email" {
    type = string
}

variable "clothing_model_weights_path" {
    type = string
}

variable "detection_model_weights_path" {
    type = string
}

variable "youtube_cookies_path" {
    type = string
}