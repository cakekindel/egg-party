FROM    node:10

COPY    package*.json ./

RUN     npm ci
RUN     npm run build

EXPOSE  8080
CMD     [ "node", "dist/main.js" ]
