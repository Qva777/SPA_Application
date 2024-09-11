FROM node:22

WORKDIR /app
COPY . /app

RUN rm -fr node_modules
COPY package.json /app/package.json
RUN npm install

EXPOSE 5173
RUN chmod +x ./start_dev.sh

CMD ./start_dev.sh
