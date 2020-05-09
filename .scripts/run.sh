#!/usr/bin/bash

# These 2 tasks will mimic the Lambda runtime and
#   run the application within the lambci Docker environment.

## Unzip the bootstrap zip so that the runtime can access the binaries
unzip -o target/lambda/release/bootstrap.zip -d /tmp/lambda

## Run the docker image & listen for POST events to the invocation endpoint
docker run --rm \
    -v /tmp/lambda:/var/task:ro,delegated \
    -e DOCKER_LAMBDA_STAY_OPEN=1 \
    -p 9001:9001 \
    lambci/lambda:provided
