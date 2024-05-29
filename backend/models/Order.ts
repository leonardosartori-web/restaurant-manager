// @ts-nocheck
import mongoose = require('mongoose');
import {Model} from "./ModelInterface";
import {Product, product} from "./Product";

interface ExtendedProduct extends Product {
    product_id: string,
    status: string,
    operator: string
}

export interface Order extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    table: number,
    waiter: string,
    productionTime: mongoose.Schema.Types.Date,
    products: ExtendedProduct[]
}

const extendedProductSchema = new mongoose.Schema<ExtendedProduct>({
    ...product.getSchema().obj,
    status: {
        type: mongoose.SchemaTypes.String,
        default: "awaiting"
    },
    operator: {
        type: mongoose.SchemaTypes.String
    },
    product_id: {
        type: mongoose.SchemaTypes.ObjectId
    }
})

const orderSchema = new mongoose.Schema<Order>({
    table: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        index: true
    },
    productionTime: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        index: true
    },
    waiter: {
        type: mongoose.SchemaTypes.String
    },
    products: [extendedProductSchema]
})

let order = new Model<Order>(orderSchema, 'Order');

export {order};