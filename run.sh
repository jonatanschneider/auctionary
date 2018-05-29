#!/bin/bash

cd server

if [ -f package.json ]; then
    echo [LOG]: Installing dependencies...
    npm install
    echo [LOG]: Starting MongoDB...
    mongod -dbpath c:\mongodb\ &
    echo [LOG]: Starting Server...
    npm run-script start &
else
   echo [WARN]: Directory `server` does not contain a package.json file
fi

cd ..

cd client

if [ -f package.json ]; then
    echo [LOG]: Installing dependencies...
    call npm install
    echo [LOG]: Starting development build for client...
    npm run-script build &
else
    echo [ERR]: Directory `server` does not contain a package.json file
fi

cd ..
