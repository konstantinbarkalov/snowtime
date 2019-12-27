#!/bin/bash
cd ./standaloneSioServer
forever stop standaloneSioServer1.js
forever start standaloneSioServer1.js
cd ..