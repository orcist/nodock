#!/bin/bash

# $1    -> name of the image
# $2    -> path to project
# $3..  -> docker arguments

cd $2

git fetch --all
git reset HEAD --hard
git checkout master
git reset origin/master --hard

sudo docker kill $1-container
sudo docker rm $1-container

sudo docker rmi $1-app

sudo docker build -t $1-app -f docker.app .
sudo docker run "${@:3}" $1-app
