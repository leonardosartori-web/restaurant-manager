// @ts-nocheck
import mongoose = require('mongoose');
import {Model} from "./ModelInterface";

export interface Product extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    name: string,
    price: number,
    kind: string,
    setPrice: (price:number)=>void
}

const productSchema = new mongoose.Schema<Product>({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    kind: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
});

productSchema.methods.setPrice = function (price:number) {
    this.price = price;
}

let product = new Model<Product>(productSchema, 'Product');

export {product};