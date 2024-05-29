// @ts-nocheck
import express = require('express');
import {table} from "../models/Table";
import {auth} from "./login";
import {Functions} from "../functions";
import {rolesPermission} from "../permissions";
import {order} from "../models/Order";

const router = express.Router();

router.route('/tables').get(auth, rolesPermission(["Waiter", "Cashier"]), (req,res,next) => {

    let filter:any = {};
    if (req.query.isOccupied) {
        filter["isOccupied"] = req.query.isOccupied;
    }

    if (req.query.seats) {
        filter["seats"] = req.query.seats;
    }

    Functions.find(table, filter).then( (tables) => {
        return res.status(200).json( tables );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    })

}).post(auth, rolesPermission(["Cashier"]), (req, res, next) => {

    if( !req.body.seats ) {
        return next({ statusCode:404, error: true, errormessage: "Seats field missing"} );
    }
    Functions.add(table, {...req.body, isOccupied: false}).then( (data) => {
        req.io.emit("updateTables", "Table added");
        return res.status(200).json({ error: false, errormessage: "", id: data._id, num: data.num });
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "Table already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason.errmsg });
    })
});

router.route('/tables/:num').put(auth, rolesPermission(["Cashier", "Waiter"]), (req, res, next) => {
    if( !req.body ) {
        return next({ statusCode:204, error: true, errormessage: "No content"} );
    }
    Functions.update(table, {num: req.params.num }, req.body, {new: true}).then( (data) => {
        req.io.emit("updateTables", "Table status changed");
        return res.status(200).json({ error: false, errormessage: "", id: data._id, num: data.num });
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason.errmsg });
    })

}).delete(auth, rolesPermission(["Cashier"]), (req, res, next) => {
    Functions.deleteOne(table, {num: req.params.num } ).then(
        ( q )=> {
            if( q.deletedCount > 0 ) {
                req.io.emit("updateTables", "Table deleted");
                return res.status(200).json({error: false, errormessage: ""});
            }
            else
                return res.status(404).json( {error:true, errormessage:"Invalid table ID"} );
        }).catch( (reason)=> {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })
});

router.route('/tables/:num/orders').get(auth, rolesPermission(["Cashier", "Waiter"]), (req, res, next) => {

    let filter = {table: req.params.num};
    let projection = {};

    Functions.find(order, filter, projection, [['productionTime', 1], ['table', -1]]).then( (orders ) => {
        return res.status(200).json( orders );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })

})

export {router};