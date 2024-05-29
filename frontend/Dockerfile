FROM node:19-slim
LABEL maintainer="Leonardo Sartori <886069@stud.unive.it>"

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .

EXPOSE 4200

CMD ng serve --host 0.0.0.0
