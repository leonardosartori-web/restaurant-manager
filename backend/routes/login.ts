// @ts-nocheck
import express = require('express');
import {user} from "../models/User";
import passport = require('passport');           // authentication middleware for Express
import passportHTTP = require('passport-http');  // implements Basic and Digest authentication for HTTP (used for /login endpoint)
import jsonwebtoken = require('jsonwebtoken');  // JWT generation
import {Functions} from "../functions";
const { expressjwt: jwt, } = require('express-jwt');            // JWT parsing middleware for express
const result = require('dotenv').config();


if (result.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if( !process.env.JWT_SECRET ) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found");
    process.exit(-1);
}

let auth = jwt( {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
} );

const router = express.Router();

passport.use( new passportHTTP.BasicStrategy(
    function(username, password, done) {
        Functions.findOne(user, {email: username}, {}).then((user) => {
            if (!user)
                return done(null, false, {statusCode: 500, error: true, errormessage: "Invalid user"});

            if (user.validatePassword(password))
                return done(null, user);

            return done(null, false, {statusCode: 500, error: true, errormessage: "Invalid password"});
        }).catch((err) => {
            return done({statusCode: 500, error: true, errormessage: err});
        });
    }
));

router.get("/login", passport.authenticate('basic', { session: false }), (req,res,next) => {

    let tokendata = {
        username: req.user.username,
        role: req.user.role,
        email: req.user.email,
        id: req.user.id
    };

    console.log("Login granted. Generating token" );
    let token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '8h' } );

    return res.status(200).json({ error: false, errormessage: "", token: token_signed });

});

export {router, auth};