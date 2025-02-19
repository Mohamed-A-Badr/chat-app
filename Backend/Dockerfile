FROM python:3.13-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add bash

RUN pip install --upgrade pip
COPY /Backend/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY Backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
RUN dos2unix entrypoint.sh

COPY Backend/ /app

ENTRYPOINT [ "/app/entrypoint.sh" ]