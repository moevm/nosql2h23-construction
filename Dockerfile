FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories 
RUN apk add mongodb-tools
COPY . .


CMD ["npm", "start"]
