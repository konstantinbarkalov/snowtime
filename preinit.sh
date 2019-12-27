#!/bin/bash
sudo apt update
sudo apt install git -y
cd ~
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs -y
node -v
cd /srv
git clone https://barkalov@bitbucket.org/barkalov/snowtime.fun.git
npm install forever -g
cd ./snowtime.fun
cd ./standaloneHttpServer
npm install
cd ./standaloneSioServer
npm install
cd ..
echo preinit is done, now ready to start
#./restart-all.sh