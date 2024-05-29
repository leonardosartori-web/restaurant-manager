// @ts-nocheck
import mongoose = require('mongoose');
import crypto = require('crypto');
import {Model} from "./ModelInterface";

interface User extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    username: string,
    email: string,
    role: string,
    salt: string,
    digest: string,
    setPassword: (pwd:string)=>void,
    validatePassword: (pwd:string)=>boolean,
    setRole: (role:string)=>void
}

const userSchema = new mongoose.Schema<User>( {
    username: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    role:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },
    salt:  {
        type: mongoose.SchemaTypes.String,
        required: false 
    },
    digest:  {
        type: mongoose.SchemaTypes.String,
        required: false 
    }
})

userSchema.methods.setPassword = function( pwd:string ) {
    this.salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha512', this.salt );
    hmac.update( pwd );
    this.digest = hmac.digest('hex');
}

userSchema.methods.validatePassword = function( pwd:string ):boolean {
    const hmac = crypto.createHmac('sha512', this.salt );
    hmac.update(pwd);
    const digest = hmac.digest('hex');
    return (this.digest === digest);
}

userSchema.methods.setRole = function(role:string) {
    this.role = role;
}

let user = new Model<User>(userSchema, 'User');

export {user};