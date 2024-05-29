// @ts-nocheck
import mongoose = require('mongoose');
import {Model} from "./ModelInterface";


export interface Statistic extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    user_email: string,
    number_of_services: number
}

const statisticSchema = new mongoose.Schema<Statistic>({
    user_email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    number_of_services: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }
})

let statistic = new Model<Statistic>(statisticSchema, 'Statistic');

export {statistic};