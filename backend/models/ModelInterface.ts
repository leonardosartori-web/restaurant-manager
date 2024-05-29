// @ts-nocheck
import * as mongoose from "mongoose";

interface ModelInterface<T extends mongoose.Document> {
    getSchema: () => mongoose.Schema<T>,
    getModel: () => mongoose.Model<T>,
    new: (data:any) => T
}

class Model<T extends mongoose.Document> implements ModelInterface<T> {
    schema: mongoose.Schema<T>;
    model: mongoose.Model<T>;
    modelName: string;

    constructor(schema: mongoose.Schema<T>, modelName: string) {
        this.schema = schema;
        this.modelName = modelName;
    }

    getModel(): mongoose.Model<T> {
        if( !this.model ) {
            this.model = mongoose.model(this.modelName, this.getSchema() );
        }
        return this.model;
    }

    getSchema(): mongoose.Schema<T> {
        return this.schema;
    }

    new(data: any): T {
        let _model = this.getModel();
        return (new _model( data ));
    }

}

export {Model};
