// @ts-nocheck
import {Model} from "./models/ModelInterface";
import mongoose from "mongoose";

const Functions = {

    findOne: function (table: Model<any>, filter:any = {}, projection:any = {}) {
        return table.getModel().findOne(filter, projection);
    },

    find: function (table: Model<any>, filter:any = {}, projection:any = {}, sort:any = {}) {
        return table.getModel().find(filter, projection).sort(sort);
    },

    add: function (table: Model<any>, data: any) {
        let newModel = table.new(data);
        return newModel.save();
    },

    update: function (table: Model<any>, filter:any, data:any, options:any = {}) {
        return table.getModel().findOneAndUpdate(filter, data, options);
    },

    deleteOne: function (table: Model<any>, filter:any={}) {
        if (filter !== {}) return table.getModel().deleteOne(filter);
    }
}

export {Functions};