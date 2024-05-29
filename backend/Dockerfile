FROM node:19-slim
LABEL maintainer="Leonardo Sartori <886069@stud.unive.it>"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run compile

EXPOSE 8080

CMD ["npm", "start"]
