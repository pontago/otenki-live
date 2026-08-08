FROM public.ecr.aws/lambda/python:3.13-arm64 AS builder

WORKDIR /opt

RUN dnf install -y \
    git \
    diffutils \
    gcc \
    gcc-c++ \
    make \
    wget \
    tar \
    yasm \
    pkgconf \
    zlib-devel \
    openssl-devel \
    glibc-devel \
    libjpeg-turbo-devel \
    libX11-devel \
    mesa-libGL-devel \
    cmake

ARG FFMPEG_VERSION=n7.1.5
RUN wget -O ffmpeg.tar.gz https://github.com/FFmpeg/FFmpeg/archive/refs/tags/${FFMPEG_VERSION}.tar.gz \
    && mkdir ffmpeg \
    && tar -xzf ffmpeg.tar.gz -C ffmpeg --strip-components=1 \
    && rm ffmpeg.tar.gz
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