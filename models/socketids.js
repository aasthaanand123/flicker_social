const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const socketidsschema = new Schema({
    userid:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    socketid:{
        type:String,
        required:true,
    }
}
);
module.exports = mongoose.model("socketids", socketidsschema);
