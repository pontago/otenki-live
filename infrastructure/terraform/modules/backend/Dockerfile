FROM ghcr.io/astral-sh/uv:0.7.12 AS uv

FROM public.ecr.aws/lambda/python:3.13-arm64 AS builder

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

RUN dnf install -y \
    git \
    gcc \
    gcc-c++ \
    make \
    wget \
    tar \
    git \
    yasm \
    pkgconf \
    zlib-devel \
    openssl-devel \
    glibc-devel \
    libjpeg-turbo-devel \
    libX11-devel \
    mesa-libGL-devel \
    cmake

RUN git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg
WORKDIR /opt/ffmpeg

RUN ./configure \
    --prefix=/opt/ffmpeg-build \
    --disable-static \
    --enable-shared \
    --disable-programs \
    --enable-ffmpeg \
    --disable-everything \
    --enable-protocols \
    --enable-demuxer=mov,matroska,hls \
    --enable-decoder=h264,aac \
    --enable-parser=h264,aac \
    --enable-muxer=image2 \
    --enable-encoder=mjpeg \
    --enable-filter=scale,select \
    --enable-avformat \
    --enable-avcodec \
    --enable-avutil \
    --enable-swscale \
    --enable-openssl \
    && make -j$(nproc) && make install

# RUN dnf install -y tar xz
# RUN curl -sSL https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz | tar -xJ -C ${LAMBDA_TASK_ROOT}

FROM public.ecr.aws/lambda/python:3.13-arm64

RUN dnf install -y mesa-libGL

COPY --from=builder /opt/patch.txt /sys/devices/system/cpu/possible
COPY --from=builder /opt/patch.txt /sys/devices/system/cpu/present

COPY --from=builder ${LAMBDA_TASK_ROOT%/}/packages/ ${LAMBDA_TASK_ROOT}
COPY --from=builder /opt/ffmpeg-build/lib/* /lib64/
COPY --from=builder /opt/ffmpeg-build/bin/ffmpeg /usr/bin/
# COPY --from=builder ${LAMBDA_TASK_ROOT%/}/ffmpeg-*-arm64-static/ffmpeg /usr/bin/