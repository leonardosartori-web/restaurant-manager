// @ts-nocheck
import express = require('express');
import {user} from "../models/User";
import {auth} from "./login";
import {Functions} from "../functions";
import {convert_user_to_user_salt_digest} from "../utils";
import {rolesPermission, userApiPermission} from "../permissions";
import {statistic} from "../models/Statistic";

const router = express.Router();

router.route("/users").get(auth, (req, res, next) => {
    Functions.find(user, {}, {digest:0, salt:0}, {"email": -1}).then( (users) => {
        return res.status(200).json( users );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })
}).post((req, res, next) => {
    //console.log(req.body);
    if( !req.body.password ) {
        return next({ statusCode:404, error: true, errormessage: "Password field missing"} );
    }

    Functions.add(user, convert_user_to_user_salt_digest(req.body)).then( (data) => {
        Functions.add(statistic, {email: req.body.email}).then(() => {
            return res.status(200).json({ error: false, errormessage: "", id: data._id, email: data.email });
        });
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: reason.errmsg/*"User already exists"*/} );
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason.errmsg });
    })
});

router.route("/users/:email").get(auth, (req,res,next) => {

    Functions.findOne(user, {email: req.params.email }, {digest: 0, salt:0 }).then( (user)=> {
        return res.status(200).json( user );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    });

}).put(auth, userApiPermission, (req, res, next) => {
    if( !req.body ) {
        return next({ statusCode:204, error: true, errormessage: "No content"} );
    }
    Functions.update(user, {email: req.params.email }, convert_user_to_user_salt_digest(req.body), {new: true}).then( (data) => {
        return res.status(200).json({ error: false, errormessage: "", id: data._id, email: data.email });
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason.errmsg });
    })

}).delete(auth, rolesPermission(["Cashier"]), (req, res, next) => {
    Functions.deleteOne(user, {email: req.params.email } ).then(
        ( q )=> {
            if( q.deletedCount > 0 )
                return res.status(200).json( {error:false, errormessage:""} );
            else
                return res.status(404).json( {error:true, errormessage:"Invalid user email"} );
        }).catch( (reason)=> {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })
});

export {router};