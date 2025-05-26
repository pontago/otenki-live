import ffmpeg
from loguru import logger
from yt_dlp import YoutubeDL

from app.core.di.container import Container


def main():
    video_url = "https://www.youtube.com/channel/UCBFDJXGCOdMjVtg2AnReoXA/live"
    ydl_opts = {
        "quiet": True,
        "skip_download": True,
        "force_generic_extractor": False,
        "format": "best[ext=mp4]/best",
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)
        if info is None:
            logger.error("Failed to extract info")
            return
        logger.debug(info["url"])

        out, err = (
            ffmpeg.input(info["url"])
            .filter("select", f"gte(n,{1})")
            .output("pipe:", vframes=1, format="image2", vcodec="mjpeg")
            .run(capture_stdout=True)
        )
        logger.debug(err)
        with open("test.jpg", "wb") as f:
            f.write(out)


if __name__ == "__main__":
    container = Container()
    container.wire(modules=[__name__])
    main()
    # print(timeit("main()", number=1, globals=globals()))
