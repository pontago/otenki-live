from pathlib import Path

import ffmpeg
import yt_dlp
from loguru import logger

from app.core.settings import AppSettings
from app.domain.entities.live_channel.entity import LiveChannel
from app.domain.repositories.live_stream_repository import ILiveStreamRepository
from app.infrastructure.exceptions import CookiePathNotSetError, LiveStreamFFmpegError, LiveStreamGetInfoError


class LiveStreamRepository(ILiveStreamRepository):
    def get_latest_image(self, live_channel: LiveChannel) -> bytes:
        if not AppSettings.youtube_cookies_path:
            raise CookiePathNotSetError(f"YouTube cookies path not set: {AppSettings.youtube_cookies_path}")

        youtube_cookies_path = Path(AppSettings.storage_dir, AppSettings.youtube_cookies_path)

        stream_url = live_channel.stream_url()
        ydl_opts = {
            "quiet": True,
            "skip_download": True,
            "force_generic_extractor": False,
            "format": "best[ext=mp4]/best",
            "extractor_retries": 1,
            "cookiefile": str(youtube_cookies_path),
            # "proxy": "http://",
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(stream_url, download=False)
                if not info:
                    logger.error("Failed to extract info.")
                    raise LiveStreamGetInfoError
        except (yt_dlp.utils.ExtractorError, yt_dlp.utils.DownloadError) as e:
            logger.error(f"Failed to extract info. [{e}]")
            raise LiveStreamGetInfoError from e

        try:
            # os.environ["http_proxy"] = "http://"
            # print(info["url"])
            out, err = (
                ffmpeg.input(
                    info["url"],
                    # http_proxy="http://",
                )
                .filter("select", f"gte(n,{1})")
                # .output("pipe:", vframes=1, format="image2", vcodec="mjpeg", loglevel="quiet")
                .output("pipe:", vframes=1, format="image2", vcodec="mjpeg")
                # .global_args("-http_proxy", "http://")
                # .run(capture_stdout=True, capture_stderr=True, quiet=True)
                .run(capture_stdout=True, capture_stderr=True)
            )
        except ffmpeg.Error as e:
            logger.error(f"Failed to FFmpeg. [{e.stdout}][{e.stderr}]")
            raise LiveStreamFFmpegError from e

        # if err:
        #     logger.error(f"Failed to get latest image. [{err}]")
        #     raise LiveStreamFFmpegError

        return out
