#!/bin/bash

sudo su <<HERE
docker exec -i quantum sh -c 'cat > /etc/ssl/server.crt' < /etc/letsencrypt/live/quantum.audacy.space/fullchain.pem
docker exec -i quantum sh -c 'cat > /etc/ssl/server.key' < /etc/letsencrypt/live/quantum.audacy.space/privkey.pem
HERE

docker exec quantum nginx -s reload