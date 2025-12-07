#use node base image
FROM node:20-alpine

#create app directory
WORKDIR /app

#copy package*.json files to app directory
COPY package*.json ./

#run npm install to install dependencies
RUN npm install --omit=dev

#copy app content to app directory
COPY . .

#expose port 3000
EXPOSE 3000

#star the app
CMD ["node","index.js"]
