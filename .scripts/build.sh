#!/usr/bin/bash
docker run --rm \
    -e "TERM=xterm-256color" \
    -e "CARGO_FLAGS=--color=always" \
    -v "${PWD}":/code \
    -v "${HOME}"/.cargo/registry:/root/.cargo/registry \
    -v "${HOME}"/.cargo/git:/root/.cargo/git \
    softprops/lambda-rust
