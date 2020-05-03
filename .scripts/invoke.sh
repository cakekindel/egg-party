#!/usr/bin/bash

# Invoke locally running function, with JSON payload of:
#   - inline JSON: Pass JSON as input to script
#   - JSON file: Pass @relpath as input to script
curl -H "Content-Type: application/json" \
    -d "$1" \
    -m 1 \
    http://localhost:9001/2015-03-31/functions/egg_party/invocations
