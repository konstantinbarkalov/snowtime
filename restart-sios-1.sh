#!/bin/bash
cd ./standaloneSioServer
forever stop standaloneSiosServer1.js
forever start standaloneSiosServer1.js
cd ..