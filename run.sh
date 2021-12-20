#!/bin/bash

# pull app
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 177124026637.dkr.ecr.us-east-2.amazonaws.com
docker pull 177124026637.dkr.ecr.us-east-2.amazonaws.com/quantum:latest

# pull secret variables
sec_values=$(aws --region us-east-2 secretsmanager get-secret-value --secret-id app/quantum --query SecretString --output text)
echo "$sec_values" | jq -r 'keys[] as $k | "\($k)=\(.[$k])"' > secrets.env

# run
docker run -d -t --name quantum \
    --cap-add SYS_PTRACE --env ENVIRONMENT=production --env-file secrets.env \
    -v /proc:/host/proc:ro -v /sys:/host/sys:ro \
    -p 80:80 -p 443:443 \
    177124026637.dkr.ecr.us-east-2.amazonaws.com/quantum:latest