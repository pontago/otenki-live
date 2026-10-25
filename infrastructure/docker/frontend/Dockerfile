FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1-aarch64 AS adapter
FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal AS base

ENV VOLTA_HOME=/opt/volta
ENV PATH=$VOLTA_HOME/bin:$PATH
ENV VOLTA_VERSION=2.0.2

# Node.js 26 以降の公式バイナリは libatomic.so.1 を必要とするが、2023-minimal には含まれない。
# builder (node --version) と runner (node server.js) の両方で必要なため base で入れる。
RUN --mount=type=cache,target=/var/cache/dnf \
    --mount=type=cache,target=/var/lib/dnf \
    dnf install -y libatomic

FROM base AS builder
WORKDIR /app


RUN --mount=type=cache,target=/var/cache/dnf \
    --mount=type=cache,target=/var/lib/dnf \
    dnf install -y tar gzip

RUN curl https://get.volta.sh | bash -s -- --version $VOLTA_VERSION --skip-setup

RUN --mount=type=bind,source=package.json,target=package.json \
  node --version

FROM base AS runner
WORKDIR /app

COPY . .

COPY --from=adapter /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=builder /opt/volta /opt/volta
COPY ./.next/standalone ./
COPY ./run.sh ./run.sh

RUN chmod +x ./run.sh
RUN ln -s /tmp/cache ./.next/cache

ENV PORT=3000
ENV AWS_LWA_INVOKE_MODE=response_stream
CMD exec ./run.sh