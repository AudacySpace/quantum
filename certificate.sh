#!/bin/bash

# copy SSL certificates to inside the container
sudo su <<HERE
docker exec -i quantum sh -c 'cat > /etc/ssl/server.crt' < /etc/letsencrypt/live/quantum.audacy.space/fullchain.pem
docker exec -i quantum sh -c 'cat > /etc/ssl/server.key' < /etc/letsencrypt/live/quantum.audacy.space/privkey.pem
HERE

# Reload Nginx to use SSL certificates
docker exec quantum nginx -s reload

####################################################
# Copy git-crypt key to quantum container in order
# to unlock sensitive information
cd ~/git-crypt-keys
docker cp crypt-quantum-key quantum:/crypt-quantum-key
docker exec quantum git-crypt unlock /crypt-quantum-key
