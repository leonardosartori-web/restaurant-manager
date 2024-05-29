# Restaurant App

Made with the MEAN stack (MongoDB + ExpressJS + Angular + NodeJS)
---

How to run it via Docker:
---

From the restaurant_app folder:

1. Create a new network

```
docker network create restaurant_manage
```


2. Build the backend image

```
docker build -t backend-image ./backend/
```

3. Run the backend container

```
docker run -d --name backend-container --network=restaurant_manage -p 8080:8080 backend-image
```

4. Build the frontend image

```
docker build -t frontend-image ./frontend/
```

5. Run the frontend container

```
docker run -d --name frontend-container --network=restaurant_manage -p 4200:4200 frontend-image
```

7. Insert in the browser navigation bar

```
http://localhost:4200/
```

How to run locally:
---

1. If not installed, install the packages of the backend and frontend. In the project folder run:

```
npm init
```

2. Build and run the project:

```
npm start
```

3. Insert in the browser navigation bar:

```
http://localhost:4200/
```

To test:
---

Usernames:
- cashier: cashier@gmail.com
- cook: cook@gmail.com
- bartender: bartender@gmail.com
- waiter: waiter@gmail.com

Users' passwords are the same for everyone: "abc"

