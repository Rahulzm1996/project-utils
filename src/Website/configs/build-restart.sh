#!/usr/bin/env bash

git pull
# build the docker image
docker build -t leena.site_2 -f Dockerfile .

docker rm -f leena.site_2 && ~/containers/leena.site_2.sh