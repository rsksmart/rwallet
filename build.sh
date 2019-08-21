#!/bin/sh
NODE_PATH="../../node_modules/.bin"
cd lib/Application
"$NODE_PATH/tsc" -p .
"$NODE_PATH/browserify" Application.js -o ../lib_pre.js
cd ../postprocessor
"$NODE_PATH/tsc" -p .
node postprocess_Application.js
cd ../..
