FROM       node:0.10.37

RUN        apt-get update
RUN        npm install -g npm

WORKDIR    /src

COPY       package.json /src/package.json
RUN        npm install

COPY       . /src

EXPOSE     3000

CMD        ["npm", "start"]
