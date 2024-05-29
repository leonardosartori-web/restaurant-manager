// @ts-nocheck
import express = require('express');
import {order} from "../models/Order";
import {statistic} from "../models/Statistic";
import {auth} from "./login";
import {Functions} from "../functions";
import {
    rolesPermission
} from "../permissions";
import {convert_product_to_order_product, convert_products, kinds} from "../utils";
import {table} from "../models/Table";

const router = express.Router();

router.route('/orders').get(auth, (req,res,next) => {

    const isCookOrBartender = req.auth.role === "Bartender" || req.auth.role === "Cook";
    let filter = {};
    let projection = {};

    Functions.find(order, filter, projection, [['productionTime', 1], ['table', -1]]).then( (orders ) => {
        if (isCookOrBartender) {
            for (let order of orders) {
                order.products = order.products.filter(x => x.kind == kinds[req.auth.role]);
            }
        }

        return res.status(200).json( orders );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })

}).post(auth, rolesPermission(["Waiter", "Cashier"]),(req,res,next) => {

    let o = req.body;
    if (o != {}) {
        o = convert_product_to_order_product(req.body);
    }

    o.waiter = req.auth.id;
    const {_id, ...rest} = o;

    //Functions.update(statistic, {user_id: o.waiter}, { $inc: { number_of_dishes: 1 }}, {upsert: true, 'new': true, setDefaultsOnInsert: true})

    Functions.add(order, rest).then( (data) => {
        Functions.findOne(table, {num: data.table}).then(t => {
            Functions.update(statistic, {user_email: req.auth.email}, { $inc: { number_of_services: t.seats }}, {upsert: true, 'new': true, setDefaultsOnInsert: true}).then(() => {
                req.io.emit("updateOrders");
                return res.status(200).json({ error: false, errormessage: "", id: data._id });
            });
        })
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "Order already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason.errmsg });
    })

});

router.route('/orders/:id').get(auth, (req,res,next) => {

    const isCookOrBartender = req.auth.role === "Bartender" || req.auth.role === "Cook";

    Functions.findOne(order, {_id: req.params.id }).then( (o)=> {

        if (isCookOrBartender) {
            o.products = o.products.filter(x => x.kind == kinds[req.auth.role]);
        }
        return res.status(200).json( o );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    });

}).delete(auth, rolesPermission(["Waiter", "Cashier"]), (req, res, next) => {
    Functions.findOne(order, {_id: req.params.id}).then(o => {
        if (o.products !== undefined && o.products.length > 0) {
            Functions.findOne(table, {num: o.table}).then(t => {
                Functions.update(statistic, {user_email: req.auth.email}, {$inc: {number_of_services: -(t.seats)}}, {
                    upsert: true,
                    'new': true,
                    setDefaultsOnInsert: true
                }).then(() => {
                    Functions.deleteOne(order, {_id: req.params.id}).then(q => {
                        if (q.deletedCount > 0) {
                            req.io.emit("updateOrders");
                            return res.status(200).json({error: false, errormessage: ""});
                        } else
                            return res.status(404).json({error: true, errormessage: "Invalid order ID"});
                    })
                })
            })
        }
        else {
            Functions.deleteOne(order, {_id: req.params.id}).then(q => {
                if (q.deletedCount > 0) {
                    req.io.emit("updateOrders");
                    return res.status(200).json({error: false, errormessage: ""});
                } else
                    return res.status(404).json({error: true, errormessage: "Invalid order ID"});
            })
        }
    }).catch( (reason)=> {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    })
}).put(auth, rolesPermission(["Waiter", "Cashier"]), (req, res, next) => {
    const {_id, ...rest} = req.body;
    if( !rest ) {
        return next({ statusCode:204, error: true, errormessage: "No content"} );
    }
    Functions.update(order, {_id: req.params.id}, {$push: {products: convert_products(rest.products)}}).then(order => {
        if (order) {
            console.log(order);
            req.io.emit("updateOrders");
            return res.status(200).json(order);
        }
        else return res.status(404).json( {error:true, errormessage:"Invalid order or product ID"} );
    })
});

router.route('/orders/:id/products/:product').put(auth, (req, res, next) => {
    if( !req.body ) {
        return next({ statusCode:204, error: true, errormessage: "No content"} );
    }

    let updates = {};
    for(const key of Object.keys(req.body)) {
        updates[`products.$.${key}`] = req.body[key];
    }

    let filter = {_id: req.params.id, "products.product_id" : req.params.product};

    if (req.auth.role === "Bartender" || req.auth.role === "Cook") filter["products.kind"] = kinds[req.auth.role];

    Functions.update(order, filter, {
        $set: updates
    }, {new: true}).then(order => {
        if (order) {
            //console.log(order);
            req.io.emit("updateOrders");
            if (req.body.status !== undefined && req.body.status === 'ready') {
                console.log(order.waiter);
                req.io.emit(order?.waiter, `A dish is ready at table ${order.table}`);
                return res.status(200).json(order);
            }
            else if (req.body.status !== undefined && req.body.status === 'processing') {
                Functions.update(statistic, {user_email: req.auth.email}, { $inc: { number_of_services: 1 }}, {upsert: true, 'new': true, setDefaultsOnInsert: true}).then(() => {
                    return res.status(200).json(order);
                });
            }
            else return res.status(200).json(order);
        }
        else return res.status(404).json( {error:true, errormessage:"Invalid order or product ID"} );
    })
}).delete(auth, rolesPermission(["Cashier", "Waiter"]), (req, res, next) => {

    let filter = {_id: req.params.id};

    if (req.auth.role === "Bartender" || req.auth.role === "Cook") filter["products.kind"] = kinds[req.auth.role];

    Functions.update(order, filter, { $pull: {products: {product_id: req.params.product}} }, {}).then(order => {
        if (order) {
            req.io.emit("updateOrders");
            return res.status(200).json(order);
        }
        else return res.status(404).json( {error:true, errormessage:"Invalid order or product ID"} );
    })
})

export {router};