FROM node:24-alpine3.21

WORKDIR /app

RUN apk update && apk add --no-cache \
        bash \
        python3 \
        py3-pip \
        py3-setuptools \
        py3-wheel \
        make \
        g++

RUN npm install @faker-js/faker

ENTRYPOINT ["tail", "-f", "/dev/null"]


