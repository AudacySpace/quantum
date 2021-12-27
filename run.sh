#!/bin/bash

ECR_HOST="177124026637.dkr.ecr.us-east-2.amazonaws.com"
TAG=${TAG:-1.0.1}

# pull app
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ${ECR_HOST}
docker pull ${ECR_HOST}/quantum:${TAG}

# pull secret variables
sec_values=$(aws --region us-east-2 secretsmanager get-secret-value --secret-id app/quantum --query SecretString --output text)
echo "$sec_values" | jq -r 'keys[] as $k | "\($k)=\(.[$k])"' > secrets.env

# run
docker stop quantum || true
docker rm quantum || true
docker run -d -t --name quantum \
    --cap-add SYS_PTRACE --env ENVIRONMENT=production --env-file secrets.env \
    -v /proc:/host/proc:ro -v /sys:/host/sys:ro \
    -v /etc/letsencrypt/live/quantum.e-space.com/fullchain.pem:/etc/ssl/server.crt \
    -v /etc/letsencrypt/live/quantum.e-space.com/privkey.pem:/etc/ssl/server.key \
    -p 80:80 -p 443:443 \
    ${ECR_HOST}/quantum:${TAG}