#!/bin/sh

# clear the dist directory
# rm -rf dist

# use the build to create deploy docker image
docker build \
  --build-arg SSH_PRIVATE_KEY="$(cat $HOME/.ssh/id_rsa)" \
  --build-arg SSH_PUBLIC_KEY="$(cat $HOME/.ssh/id_rsa.pub)" \
  -t chatteron/leena-ui-components -f Dockerfile .
