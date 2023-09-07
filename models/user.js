const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  imgurl: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  dateofjoining: { type: Date, default: Date.now },
  dateUser: { type: String, required: true },
  requested: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  requesting: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
module.exports = mongoose.model("user", userSchema);
