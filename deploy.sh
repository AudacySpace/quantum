#!/bin/bash
#build new docker container
git fetch --all
git checkout $1 
git pull

docker build -t quantum-app-test .
#build docker test container
docker build -t "quantum_test" -f "Dockerfile.test" .

#run and remove the docker test container
docker run --rm --name "quantum_test" quantum_test

RC=$?

#Remove test container image
#docker rmi quantum_test

#If tests successful, update the code in the docker container 
if [ $RC == 0 ]
then
  echo "====================================================================="
  echo "Updating code in the main docker container"
  echo "====================================================================="
  #Stop the old container and run the new one(after retagging)
  docker stop quantum || true
  docker rm quantum || true
  docker rmi quantum-app || true
  docker tag quantum-app-test quantum-app
  docker rmi quantum-app-test
  docker run -d -t --name quantum --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -p 80:80 -p 443:443 quantum-app
else
  echo "====================================================================="
  echo "Test docker container failure. See above for more details."
  echo "====================================================================="
  docker rmi quantum-app-test
  exit 1	
fi