# Quantum Dockerfile

FROM --platform=linux/amd64 centos:7.0.1406
MAINTAINER quindar@audacy.space
LABEL vendor="Audacy"


# run system update & install utils
RUN yum swap -y fakesystemd systemd && \
	yum -y update --setopt=tsflags=nodocs && \
	yum -y install git wget nano curl make dos2unix

##############################################################################
	
#**** install netdata ****
# https://github.com/firehol/netdata/wiki/Installation
# https://github.com/firehol/netdata/wiki/Running-behind-nginx
# netdata is proxied behind nginx, and accessible at \\hostname\netdata
# start command /usr/sbin/netdata -D -s /host -p 19999
#
RUN yum -y install zlib-devel libuuid-devel libmnl-devel gcc autoconf autoconf-archive autogen automake pkgconfig python tc python-yaml && \
	git clone https://github.com/firehol/netdata.git && \
	cd netdata && \
	git checkout f8e0f3ced35509f608f360823c57c19b19eb6164 && \
	./netdata-installer.sh --dont-wait --dont-start-it


##############################################################################

#**** install nginx ****
# server config  /etc/nginx/nginx.conf
# start command  /usr/sbin/nginx
#
# NOTE: the server is deployed with self-signed certificates which will throw
#       security warnings in your browser. In a production environment, SSH into
#       the server and (1) update server name, (2) install your own certs.
# 		Self-signed certs for your specific org can be generated using:
#
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/server.key -out /etc/ssl/server.crt
# nginx -s reload
#

RUN yum install -y epel-release && \
	yum install -y nginx && \
	mkdir -p /etc/ssl

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/server.crt /etc/ssl/server.crt
COPY nginx/server.key /etc/ssl/server.key

#**** install node ****
# https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora
# 
# start command: pm2-docker start $APP --watch &
# where $APP is the main file name (e.g. server.js) or can be specified at runtime
# if additional options to the --watch flag are desired, add a config.json file to the build (tbd)

RUN yum install -y gcc-c++    && \
	curl --silent --location https://rpm.nodesource.com/setup_8.x | bash - && \
	yum -y install nodejs  && \
	npm install -g bower && \
	npm install -g gulp  && \
	npm install -g mean-cli && \
	npm install -g pm2

#**** install logrotate for pm2 ****
RUN pm2 install pm2-logrotate && \
	pm2 set pm2-logrotate:compress true && \
	pm2 set pm2-logrotate:retain 7

#**** install git-crypt ****
# openssl development headers and git are prerequisites
RUN yum install -y openssl-devel

RUN git clone https://www.agwa.name/git/git-crypt.git && \
	cd git-crypt && \
	make && \
	make install

#**** deploy quantum app ****
# create a directory node and copy the source code under /node
# node server should run on port 3000 > proxied via nginx to 443
# start command: pm2 start

# Create app directory	 
RUN  mkdir -p /node 
WORKDIR /node

# Copy code contents and install app dependencies
COPY . /node
RUN npm install --no-save

# create a directory to store the uploaded files
RUN  mkdir -p /tmp/uploads

#**** add build argument to environment variable ****
# only environment variables can be used in CMD commands
ARG ENVIRONMENT
ENV ENVIRONMENT ${ENVIRONMENT}

##############################################################################	
	
#**** start servers with container deploy
# 
# (1) nginx
# (2) node
#
# the last command can't exit, or the container will shutdown

EXPOSE 80 443
CMD /usr/sbin/nginx && (pm2 start ecosystem.config.js --env ${ENVIRONMENT} --no-daemon &) && \
	/usr/sbin/netdata -D -s /host -p 19999
	
