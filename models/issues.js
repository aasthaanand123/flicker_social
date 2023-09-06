const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const issueSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  imgurl: { type: String, required: true },
  title: { type: String },
  description: { type: String, required: true },
  dateDB: { type: Date, default: Date.now },
  dateUser: { type: String, required: true },
  resolved: { type: Boolean, default: false },
});
module.exports = mongoose.model("issue", issueSchema);
