#!/bin/bash
cd ./standaloneSioServer
forever stop standaloneSiosServer2.js
forever start standaloneSiosServer2.js
cd ..