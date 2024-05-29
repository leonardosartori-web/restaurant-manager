// @ts-nocheck
import mongoose = require('mongoose');
//const populates = require("./populates");
import {populates} from "./populates";

function connect(callbackFunction: Function) {
    mongoose.connect("mongodb+srv://886069:BugGwyk01JBFslNB@cluster0.myuru9j.mongodb.net/restaurantdb?retryWrites=true&w=majority").then(
        () => {
            /*mongoose.connection.db.dropDatabase();
            console.log("Database connection successfully");
            populates();*/
        }
    ).then(callbackFunction).catch(
        (err) => {
            console.log("Error occurred during initialization");
            console.log(err);
        }
    );
}

function disconnect() {
    return mongoose.connection.close();
}

export {connect, disconnect};