FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev nodemon
COPY . .

# Start the server
CMD [ "npm", "run", "dev" ]