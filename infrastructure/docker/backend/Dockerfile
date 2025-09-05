FROM public.ecr.aws/lambda/python:3.13-arm64 AS base
FROM ghcr.io/astral-sh/uv:0.7.12 AS uv
FROM public.ecr.aws/b3j7a7m1/otenki-live/ffmpeg:latest AS ffmpeg

FROM base AS builder

ENV UV_COMPILE_BYTECODE=1
ENV UV_NO_INSTALLER_METADATA=1
ENV UV_LINK_MODE=copy

RUN --mount=from=uv,source=/uv,target=/bin/uv \
    --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=vendored/,target=vendored/ \
    --mount=type=bind,source=README.md,target=README.md \
    --mount=type=bind,source=app/,target=app/ \
    uv export --frozen --no-dev --no-editable -o requirements.txt && \
    uv pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT%/}/packages"

WORKDIR /opt

RUN echo "0-1" > patch.txt

FROM base AS runner

RUN dnf install -y mesa-libGL

COPY --from=builder /opt/patch.txt /sys/devices/system/cpu/possible
COPY --from=builder /opt/patch.txt /sys/devices/system/cpu/present

COPY --from=builder ${LAMBDA_TASK_ROOT%/}/packages/ $LAMBDA_TASK_ROOT
COPY ./app/ ${LAMBDA_TASK_ROOT%/}/app/
COPY --from=ffmpeg /opt/ffmpeg-build/lib/* /lib64/
COPY --from=ffmpeg /opt/ffmpeg-build/bin/ffmpeg /usr/bin/