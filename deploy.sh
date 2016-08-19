#!/bin/bash

# Takes 1 parameter, the path to the deployed app

cd $1
git pull

sudo docker kill $1-container
sudo docker rm $1-container

sudo docker rmi $1-app

sudo docker build -t $1-app -f docker.app .
sudo docker run -e env=stage --name $1-container -p 80:80 -v $(pwd):/app -v /app/node_modules -v wwwroot:/wwwroot $1-app
