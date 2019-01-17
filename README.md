# Welcome to Quantum

Quantum is an Electronic Procedures Software used to run multiple procedures for Audacy space missions to achieve mission goals/tasks.

## Installation

### Prepare the Host

Install the pre-requisites on the host server to run the dockerized container of Quantum application. If you want to remove old images first use `docker rm $(docker ps -a -q)`. 

* Install Git, e.g. `yum install -y git`
* Install Docker (see https://docs.docker.com/engine/installation/)

### Clone repository 

```
git clone https://github.com/AudacySpace/quantum.git
```

### Build the container

```
cd ~/quantum
docker build -t quantum-app .
npm install
docker run -d -t --name quantum --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -v $(pwd):/node/ -p 80:80 -p 443:443 quantum-app
```

The quantum GUI will be running on https://HOSTNAME

## About Us
Audacy was launched in 2015 by Stanford graduates, SpaceX veterans, and NASA award winners. Audacy delivers anytime and effortless space connectivity, advancing humanity to a new age of commerce, exploration and discovery. Connect online at https://audacy.space.

## License
Quantum is released under the MIT License. For license (terms of use), please refer to the file LICENSE.
