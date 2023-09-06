const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  postid: {
    type: Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  dateUser: {
    type: String,
    required: true,
  },
  dateDB: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("comment", commentSchema);
