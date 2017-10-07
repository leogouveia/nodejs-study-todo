#!/bin/bash
DIRPATH=$1
if [ -z $1 ]
    then DIRPATH='/Users/leogouveia/Documents/Dev/udemy/nodejs/mongo/data'
    else DIRPATH=$1
fi

docker run -d --rm --name mongo -p 27017:27017 -v $DIRPATH:/data/db mvertes/alpine-mongo
sleep 5
docker exec -ti mongo mongo --eval 'db.getSiblingDB("admin").createUser({user:"mongoadmin",pwd: "Admin123",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})'