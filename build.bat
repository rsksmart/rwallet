cd lib\Application
call tsc -p .
call browserify Application.js -o ..\lib_pre.js
cd ..\postprocessor
call tsc -p .
node postprocess_Application.js
cd ..\..
