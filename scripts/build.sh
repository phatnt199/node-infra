#!/bin/sh

echo "START | Building application..."
lb-tsc -p tsconfig.json && tsc-alias -p tsconfig.json

cp -r "$(pwd)/src/components/authenticate/views" "$(pwd)/dist/components/authenticate/"
cp -r "$(pwd)/static" "$(pwd)/dist/"

echo "DONE | Build application"
