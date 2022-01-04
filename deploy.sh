#!/bin/bash

#define environment as per the branch
if [ "$1" == "master" ]
then
  ENV="production"
elif [ "$1" == "develop" ]
then
  ENV="staging"
else
  ENV="development"
fi

TAG=${TAG:-1.0.1}
ECR_HOST="177124026637.dkr.ecr.us-east-2.amazonaws.com"
# get ECR login
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ${ECR_HOST}


#build new docker container
echo 'Building quantum app'
docker build -t quantum-app --build-arg ENVIRONMENT=$ENV .
docker tag quantum-app ${ECR_HOST}/quantum:${TAG}
docker push ${ECR_HOST}/quantum:${TAG}

if [ "${ENV}" == "development" ]
then
  echo "====================================================================="
  echo "Deploying local quantum container"
  echo "====================================================================="
  #Stop the old container and run the new one(after retagging)
  docker stop quantum || true
  docker rm quantum || true
  docker run -d -t --name quantum \
    --cap-add SYS_PTRACE \
    --env-file secrets.env \
    -v /proc:/host/proc:ro -v /sys:/host/sys:ro \
    -v $PWD/nginx/server.crt:/etc/ssl/server.crt \
    -v $PWD/nginx/server.key:/etc/ssl/server.key \
    -p 80:80 -p 443:443 ${ECR_HOST}/quantum:${TAG}
fi
