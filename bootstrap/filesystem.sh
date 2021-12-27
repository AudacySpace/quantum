#!/bin/bash
# https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html

# creating filesystem on volume
fs_type=$(sudo file -s /dev/xvdf)
if [[ "$fs_type" == *"SGI XFS"* ]]; then
    echo "Filesystem already created. Does NOT require any more actions to create filesystem. Doing so will overwrite existing data."
else
    echo "Filesystem not found on /dev/xvdf. Creating now..."
    sudo mkfs -t xfs /dev/xvdf
fi

# mounting volume
[ -d "/data" ] || sudo mkdir /data
if [[ $(lsblk | grep -q xvdf) ]]; then
    echo "Device /dev/xvdf already mounted."
else
    echo "Mounting device /dev/xvdf to mountpoint: /data"
    sudo mount /dev/xvdf /data
fi
[ -d "/data/mongo" ] || sudo mkdir /data/mongo && sudo chown -R mongod:mongod /data/mongo

# setting up auto mount
lsblk -o +UUID
# grab the UUID for /data from ^^ above command

sudo cp /etc/fstab /etc/fstab.orig
sudo echo "UUID=<insert UUID here>     /data       xfs    defaults,nofail   0   2" >> /etc/fstab
