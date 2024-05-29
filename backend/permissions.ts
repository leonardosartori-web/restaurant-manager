// @ts-nocheck
import {kinds} from "./utils";
import {Functions} from "./functions";
import {product} from "./models/Product";

function rolesPermission(roles: string[]) {
    return function (req, res, next) {
        if (roles.some(el => el === req.auth.role)) next();
        else next({ statusCode:403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
    }
}

function userApiPermission(req, res, next) {
    if (req.params.email === req.auth.email || req.auth.role === "Cashier") next();
    else next({ statusCode:403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
}

function cookBartenderOnFoodAndDrinkPermission(req, res, next) {
    let permission = false;
    if (req.body.kind === kinds[req.auth.role]) permission = true;
    if (req.auth.role === "Cashier") permission = true;
    if (permission) next();
    else next({ statusCode:403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
}

function cookBartenderOnFoodAndDrinkOnProductPermission(paramName) {

    return function (req, res, next) {
        let filter = {};
        filter[paramName] = req.params[paramName];
        Functions.findOne(product, filter).then(prod => {
            let permission = false;
            if (prod.kind === kinds[req.auth.role]) permission = true;
            if (req.auth.role === "Cashier") permission = true;
            if (permission) next();
            else next({statusCode: 403, error: true, errormessage: "Access Denied – You don’t have permission to access"});
        }).catch( (reason) => {
            return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
        });
    }

}

export {rolesPermission, userApiPermission, cookBartenderOnFoodAndDrinkPermission, cookBartenderOnFoodAndDrinkOnProductPermission};