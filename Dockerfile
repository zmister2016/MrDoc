FROM python:3.7-alpine
LABEL maintainer="www.mrdoc.fun"
ENV PYTHONUNBUFFERED=0 \
    TZ=Asia/Shanghai \
    LISTEN_PORT=10086\
    USER=admin
COPY . /app/MrDoc/

WORKDIR /app/MrDoc

RUN  set -x \
    && apk add --no-cache --virtual .build-deps build-base g++ gcc libxslt-dev python2-dev linux-headers \
    && apk add --no-cache pwgen git tzdata zlib-dev freetype-dev jpeg-dev  mariadb-dev postgresql-dev \
    && pip --no-cache-dir install -r requirements.txt \
    && pip --no-cache-dir install mysqlclient \
    && chmod +x mrdoc.sh \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/* 

ENTRYPOINT ["./docker_mrdoc.sh"]