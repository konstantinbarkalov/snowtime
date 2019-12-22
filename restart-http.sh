#!/bin/bash
cd ./standaloneHttpServer
forever stop standaloneHttpServer.js
forever start standaloneHttpServer.js
cd ..