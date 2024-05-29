// @ts-nocheck


import express = require('express');
import cors = require('cors');
import bodyParser = require("body-parser");
import * as LoginRouter from "./routes/login";
import * as UsersRouter from "./routes/users";
import * as TablesRouter from "./routes/tables";
import * as ProductsRouter from "./routes/products";
import * as OrdersRouter from "./routes/orders";
import * as StatisticsRouter from "./routes/statistics";
import http = require('http');
import { Server } from 'socket.io';

declare global {
    namespace Express {
        interface User {
            username: string,
            name: string,
            surname: string,
            role: string
        }

        interface Request {
            auth: {
                username: string
            }
        }
    }
}

let app = express();
let auth = LoginRouter.auth;


const server = http.createServer(app);
const io = new Server(server, {cors: true, origins: ["*"]});

app.use( cors() );
app.use( express.json() );
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware to make io available in the request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get("/", (req,res) => {
    const response:any = { api_version: "1.0", endpoints: [ "/", "/login", "/users", "/tables", "/orders", "/products", "/statistics/users", "/statistics/orders", "/statistics/tables" ]};
    return res.status(200).json( response  ); // json method sends a JSON response (setting the correct Content-Type) to the client

});


app.use("/", LoginRouter.router);
app.use("/", UsersRouter.router);
app.use("/", TablesRouter.router);
app.use("/", ProductsRouter.router);
app.use("/", OrdersRouter.router);
app.use("/", StatisticsRouter.router);


app.use( function(err,req,res,next) {

    console.log("Request error: " + JSON.stringify(err) );
    res.status( err.statusCode || 500 ).json( err );

});

app.use( (req,res,next) => {
    res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
});

module.exports = {app, server};