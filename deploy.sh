#!/bin/bash

# $1    -> name of the image
# $2    -> path to project
# $3    -> branch to deploy
# $4..  -> docker arguments

cd $2

git fetch --all
git branch deploy
git checkout deploy
git reset origin/$3 --hard

sudo docker kill $1-container
sudo docker rm $1-container

sudo docker rmi $1-app

sudo docker build -t $1-app -f docker.app .
sudo docker run "${@:4}" $1-app
