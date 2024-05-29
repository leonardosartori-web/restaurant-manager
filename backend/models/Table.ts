// @ts-nocheck
import mongoose = require('mongoose');
import {Model} from "./ModelInterface";

export interface Table extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    num: number,
    isOccupied: boolean,
    seats: number,
    setOccupation: (isOccupied:boolean)=>void
}

const tableSchema = new mongoose.Schema<Table>( {
    isOccupied: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        default: false
    },
    seats: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    num: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true
    }
})

tableSchema.methods.setOccupation = function(isOccupied:boolean) {
    this.isOccupied = isOccupied;
}

let table = new Model<Table>(tableSchema, 'Table');

export {table};