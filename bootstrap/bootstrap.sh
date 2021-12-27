#!/bin/bash
sudo yum update -y
sudo yum -y install jq

sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
