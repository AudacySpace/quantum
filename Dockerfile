# Quantum Dockerfile

FROM centos:latest
MAINTAINER quindar@audacy.space
LABEL vendor="Audacy"


# run system update & install utils
RUN yum -y update --setopt=tsflags=nodocs   && \
	yum -y install git wget nano curl make dos2unix

##############################################################################
	
#**** install netdata ****
# https://github.com/firehol/netdata/wiki/Installation
# https://github.com/firehol/netdata/wiki/Running-behind-nginx
# netdata is proxied behind nginx, and accessible at \\hostname\netdata
# start command /usr/sbin/netdata -D -s /host -p 19999
#
RUN yum -y install zlib-devel libuuid-devel libmnl-devel gcc autoconf autoconf-archive autogen automake pkgconfig python tc python-yaml  && \
	git clone https://github.com/firehol/netdata.git --depth=1    && \
	cd netdata && \
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
	curl --silent --location https://rpm.nodesource.com/setup_4.x | bash - && \
	yum -y install nodejs  && \
	npm install -g bower && \
	npm install -g gulp  && \
	npm install -g mean-cli && \
	npm install -g pm2

#**** deploy quantum app ****
# deploy from the source code under /node
# node server should run on port 3000 > proxied via nginx to 443
# start command: npm start
#

# Create app directory	 
RUN  mkdir -p /node 
WORKDIR /node

# Copy code contents and install app dependencies
COPY . /node
RUN npm install

##############################################################################	
	
#**** start servers with container deploy
# 
# (1) nginx
# (2) node
#
# the last command can't exit, or the container will shutdown

EXPOSE 80 443
CMD /usr/sbin/nginx && (pm2-docker start server.js --watch --format "YYYY-MM-DD HH:mm:ss Z" &) && \
	/usr/sbin/netdata -D -s /host -p 19999
	
