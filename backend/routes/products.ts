// @ts-nocheck
import express = require('express');
import {product} from "../models/Product";
import {auth} from "./login";
import {Functions} from "../functions";
import {
    rolesPermission,
    cookBartenderOnFoodAndDrinkPermission,
    cookBartenderOnFoodAndDrinkOnProductPermission
} from "../permissions";

const router = express.Router();

router.route('/products').get(auth, (req,res,next) => {

    Functions.find(product).then( (products ) => {
        return res.status(200).json( products );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })

}).post(auth, rolesPermission(["Cashier", "Cook", "Bartender"]), cookBartenderOnFoodAndDrinkPermission,(req,res,next) => {

    if( !req.body.name ) {
        return next({ statusCode:404, error: true, errormessage: "Name field missing"} );
    }

    Functions.add(product, req.body).then( (data) => {
        return res.status(200).json({ error: false, errormessage: "", id: data._id, name:data.name });
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "Product already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason.errmsg });
    })

});


router.route('/products/:name').get(auth, (req,res,next) => {

    Functions.findOne(product, {name: req.params.name }).then( (prod)=> {
        return res.status(200).json( prod );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    });

}).put(auth, rolesPermission(["Cashier", "Cook", "Bartender"]), cookBartenderOnFoodAndDrinkOnProductPermission("name"), (req, res, next) => {

    if( !req.body ) {
        return next({ statusCode:204, error: true, errormessage: "No content"} );
    }
    Functions.update(product, {name: req.params.name }, req.body, {new: true}).then( (data) => {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason.errmsg });
    })

}).delete(auth, rolesPermission(["Cashier", "Cook", "Bartender"]), cookBartenderOnFoodAndDrinkOnProductPermission("name"), (req, res, next) => {

    Functions.deleteOne(product, {name: req.params.name } ).then(
        ( q )=> {
            if( q.deletedCount > 0 )
                return res.status(200).json( {error:false, errormessage:""} );
            else
                return res.status(404).json( {error:true, errormessage:"Invalid product name"} );
        }).catch( (reason)=> {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })
});



export {router};