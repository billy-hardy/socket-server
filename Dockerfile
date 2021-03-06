# create a file named Dockerfile
FROM node:argon
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./dist /app
EXPOSE 3000
CMD ["npm", "start"]
