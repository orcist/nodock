#!/bin/bash

# $1 -> path to deployed project (must contain docker.app)
# $2 -> environment variable for docker

cd $1
git pull

sudo docker kill $1-container
sudo docker rm $1-container

sudo docker rmi $1-app

sudo docker build -t $1-app -f docker.app .
sudo docker run -e env=$2 --name $1-container -p 80:80 -v $(pwd):/app -v /app/node_modules -v wwwroot:/wwwroot $1-app
