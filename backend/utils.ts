// @ts-nocheck
import crypto = require('crypto');
import mongoose = require('mongoose');
const kinds = {
    "Bartender": "Drink",
    "Cook": "Food"
}

const convert_user_to_user_salt_digest = (user) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha512', salt );
    hmac.update( user.password );
    const digest = hmac.digest('hex');
    const {
        password,
        ...rest
    } = user;
    return {...rest, salt, digest};
}

const convert_product_to_order_product = (order) => {
    const {products, ...rest} = order;
    return {products: convert_products(products), ...rest};
}

const convert_products = (products) => {
    for (let product of products) {
        product.product_id = new mongoose.Types.ObjectId();
    }
    return products;
}

export {kinds, convert_user_to_user_salt_digest, convert_product_to_order_product, convert_products};