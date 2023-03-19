import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products'

const productsSchema = new Schema({
    title: {
        type: String,
        required: true            
    },
    description: {
        type: String,
        required: true            
    },
    price: {
        type: Number,
        required: true            
    },
    thumbnail: {
        type: String,
        required: true            
    },
    code: {
        type: String,
        required: true,
        unique: [true, "El código debe ser único en la DB"]            
    },
    stock: {
        type: Number,
        required: true            
    }
})

productsSchema.plugin(mongoosePaginate)

export const productsModel = model(productsCollection, productsSchema);