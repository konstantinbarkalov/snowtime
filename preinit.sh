#!/bin/bash
sudo apt update
sudo apt install git -y
cd ~

sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs -y
node -v

cd /srv
git clone https://github.com/konstantinbarkalov/snowtime.git
npm install forever -g
cd ./snowtime
cd ./standaloneHttpServer
npm install
cd ..
cd ./standaloneSioServer
npm install
cd ..
echo preinit is done, now ready to start
#./restart-