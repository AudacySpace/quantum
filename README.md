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
docker run -d -t --name quantum --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -p 80:80 -p 443:443 quantum-app
```

### Unlock environment configuration

To keep some sensitive information like database URL, SSL certificates, and other configuration private, we use [git-crypt](https://www.agwa.name/projects/git-crypt/).Follow how to install git-crypt and unlock the files using information [here](https://apps.audacy.space:8443/display/SOFT/Encrypt+Github+files).

After you unlock the git-crypt locked file inside the docker container, you can also unlock the git-crypt locked file in your working directory if you want to view the files.

##### To unlock the git-crypt locked file in working directory.Here git-crypt-keys is the folder name where the key exists.

```
cd ~/quantum
git-crypt unlock ~/git-crypt-keys/crypt-quantum-key
```

The quantum GUI will be running on http://localhost using staging database by default.

## About Us
Audacy was launched in 2015 by Stanford graduates, SpaceX veterans, and NASA award winners. Audacy delivers anytime and effortless space connectivity, advancing humanity to a new age of commerce, exploration and discovery. Connect online at https://audacy.space.

## License
Quantum is released under the MIT License. For license (terms of use), please refer to the file LICENSE.
