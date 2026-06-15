FROM golang:1.26 AS builder

ARG HUGO_VERSION=0.148.1

RUN apt-get update && \
    apt-get install -y wget git ca-certificates && \
    wget -O /tmp/hugo.deb \
      https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb && \
    apt-get install -y /tmp/hugo.deb

WORKDIR /src

COPY . .

RUN hugo --gc --minify

FROM nginx:alpine

COPY --from=builder /src/public /usr/share/nginx/html
