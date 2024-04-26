import { type } from "express/lib/response";
import mongoose, { Schema } from "mongoose";

const subscriptionSchema= new mongoose.Schema({
    subscriber:{
        type:Schema.type.objectId,
        ref:"User"
    },
    channel:{
        type:Schema.type.objectId,
        ref:"User"
    }
},{
    timestamps:true
})

 export default Subscription = mongoose.model("sub",subscriptionSchema)
