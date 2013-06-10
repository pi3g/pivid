#!/bin/bash

# install more recent version of node than in repository
wget http://nodejs.org/dist/v0.10.7/node-v0.10.7-linux-arm-pi.tar.gz
tar xf node-v0.10.7-linux-arm-pi.tar.gz
sudo mkdir /opt/node
sudo cp -r node-v0.10.7-linux-arm-pi/* /opt/node
sudo sed -i '/^export PATH$/ i\NODE_JS_HOME="/opt/node"
PATH="$PATH:$NODE_JS_HOME/bin"
' /etc/profile

# install deps
cd pivid/node
/opt/node/bin/npm install express
/opt/node/bin/npm install jquery
sudo apt-get install youtube-dl
sudo youtube-dl --update #might be needed twice
sudo youtube-dl --update #just to be sure
