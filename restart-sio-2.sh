#!/bin/bash
cd ./standaloneSioServer
forever stop standaloneSioServer2.js
forever start standaloneSioServer2.js
cd ..