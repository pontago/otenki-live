FROM public.ecr.aws/amazonlinux/amazonlinux:2023 AS base

ENV CI_VERSION=0.0.2

FROM base AS builder
WORKDIR /opt

RUN --mount=type=cache,target=/var/cache/dnf \
    --mount=type=cache,target=/var/lib/dnf \
    dnf install -y tar \
    mesa-libGL \
    git \
    gcc \
    gcc-c++ \
    make \
    wget \
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
    --disable-x86asm \
    && make -j$(nproc) && make install

FROM base AS runner

RUN curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

RUN dnf -y install dnf-plugins-core \
  && dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo \
  && sed -i 's/$releasever/9/g' /etc/yum.repos.d/docker-ce.repo \
  && dnf -y install docker-ce-cli

RUN dnf install -y \
    mesa-libGL \ 
    nodejs \
    awscli \
    unzip \
    tar \
    gzip \
    nss \
    dbus-libs \
    atk \
    at-spi2-atk \
    cups-libs \
    libxkbcommon \
    at-spi2-core \
    libXcomposite \
    libXdamage \
    libXrandr \
    cairo \
    pango \
    systemd-libs \
    alsa-lib

RUN npm install -g playwright && playwright install chromium
RUN dnf clean all && rm -rf /var/cache/dnf

COPY --from=builder /opt/ffmpeg-build/bin/ffmpeg /usr/bin/
COPY --from=builder /opt/ffmpeg-build/lib/* /lib64/