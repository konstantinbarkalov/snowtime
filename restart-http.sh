#!/bin/bash
cd ./standaloneHttpServer
forever stop standaloneHttpsServer.js
forever start standaloneHttpsServer.js
cd ..