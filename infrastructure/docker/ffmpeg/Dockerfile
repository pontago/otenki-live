FROM public.ecr.aws/lambda/python:3.13-arm64 AS builder

WORKDIR /opt

RUN dnf install -y \
    git \
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