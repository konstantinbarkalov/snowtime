#!/bin/bash
cd ./standaloneSioServer
forever stop standaloneSioServer.js
forever start standaloneSioServer.js
cd ..