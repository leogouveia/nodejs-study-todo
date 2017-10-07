
REM Windows nao funciona com volumes para mongodb
REM  -v /Users/leogouveia/Documents/Dev/udemy/nodejs/mongo/data:/data/db
docker run -d --rm --name mongo -p 27017:27017 mvertes/alpine-mongo
sleep 5
docker exec -ti mongo mongo --eval "db.getSiblingDB('admin').createUser({user:'mongoadmin',pwd: 'Admin123',roles:[{role:'userAdminAnyDatabase',db:'admin'}]})"