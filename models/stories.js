
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const storySchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  imgurl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
//   description: {
//     type: String,
//     required: true,
//   },
//   likes: { type: Number, default: 0 },
//   dislikes: { type: Number, default: 0 },
//   likedBy: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "user",
//     },
//   ],
//   dislikedBy: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "user",
//     },
//   ],
//   comments: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "comment",
//     },
//   ],

},{
    timestamps:true,
});
module.exports = mongoose.model("post", storySchema);
