#!/bin/sh

echo "Clean up qt-yuanta-dma BE...START"
./node_modules/.bin/lb-clean dist *.tsbuildinfo .eslintcache

rm -rf  artifact.zip

echo "Clean up qt-yuanta-dma BE...DONE"
