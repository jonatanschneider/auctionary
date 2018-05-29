@echo off

cd server

if exist package.json (
    echo [LOG]: Installing dependencies...
    call npm install
    echo [LOG]: Starting MongoDB...
    start /b cmd /c call mongod -dbpath c:\mongodb\
    echo [LOG]: Starting Server...
    start /b cmd /c call npm run-script start
) else (
   echo [WARN]: Directory `server` does not contain a package.json file
)

cd ..

cd client

if exist package.json (
    echo [LOG]: Installing dependencies...
    call npm install
    echo [LOG]: Starting development build for client...
    start /b cmd /c call npm run-script build
) else (
    echo [ERR]: Directory `server` does not contain a package.json file
)

cd ..
