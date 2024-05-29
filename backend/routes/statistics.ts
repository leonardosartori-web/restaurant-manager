// @ts-nocheck
import express = require('express');
import {auth} from "./login";
import {Functions} from "../functions";
import {rolesPermission} from "../permissions";
import {statistic} from "../models/Statistic";
import {order} from "../models/Order";
import {table} from "../models/Table";

const router = express.Router();

router.route('/statistics/users').get(auth, rolesPermission(["Cashier"]), (req,res,next) => {

    let filter:any = {};

    Functions.find(statistic, filter).then( (tables) => {
        return res.status(200).json( tables );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    })

})

router.route('/statistics/orders').get(auth, rolesPermission(["Cashier"]), (req,res,next) => {

    let filter:any = {};

    Functions.find(order, filter).then( (orders) => {
        function day_bill(arr, isByDate) {
            return arr.reduce((accumulator, value) => {
                if (isByDate) return accumulator + value;
                else return accumulator + 1;
            }, 0);
        }

        function groupByProductionTime(objects, isByDate) {
            const result = {};
            objects.forEach(object => {
                let productionTimeDate;
                if (isByDate) productionTimeDate = object.productionTime.toISOString().split('T')[0];
                else {
                    const productionTimeHours = object.productionTime.getHours();
                    productionTimeDate = productionTimeHours;
                }
                if (!result[productionTimeDate]) {
                    result[productionTimeDate] = [];
                }
                function bill(arr) {
                    return arr.reduce((accumulator, value) => {
                        if (isByDate) return (value.status === "complete") ? (accumulator + value.price) : 0;
                        else return (accumulator + 1);
                    }, 0);
                }
                if (isByDate) result[productionTimeDate].push(bill(object.products));
                else result[productionTimeDate].push(1);
            });
            Object.keys(result).forEach(key => {
                result[key] = day_bill(result[key], isByDate);
            })
            return result;
        }

        const response = {
            orders_by_date: groupByProductionTime(orders, true),
            orders_by_time: groupByProductionTime(orders, false)
        }

        return res.status(200).json( response );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    })

})

router.route('/statistics/tables').get(auth, rolesPermission(["Cashier"]), (req,res,next) => {

    let filter:any = {};

    Functions.find(table, filter).then( (tables) => {
        let result = {
            tablesOccupied: tables.filter(t => t.isOccupied === true).length,
            tablesNotOccupied: tables.filter(t => t.isOccupied === false).length,
            currentCustomers: tables.filter(t => t.isOccupied === true).reduce((accumulator, value) => {
                return accumulator + value.seats;
            }, 0),
            capacityCustomers: tables.reduce((accumulator, value) => {
                return accumulator + value.seats;
            }, 0),
            numberOfTables: tables.length
        }
        return res.status(200).json( result );
    }).catch( (reason) => {
        return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
    })

})


export {router};