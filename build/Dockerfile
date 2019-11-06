# use Node V10 LTS
FROM    node:10

# make required directories
RUN     mkdir /home/node/egg-party/node_modules --parents
RUN     chown node:node /home/node/egg-party  --recursive

# cd to app directory 
WORKDIR /home/node/egg-party
USER    node

# install deps
COPY    package*.json ./
RUN     npm ci --ignore-scripts

# copy source code, build
COPY    --chown=node:node . .
RUN     npm run build:prod

RUN     npm prune --production

EXPOSE  8080
CMD     [ "node", "dist/src/main.js" ]
