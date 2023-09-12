const express = require("express");
const router = express.Router();
const postcontroller = require("../../controllers/user/postcontroller");
const post = require("../../models/post");
const { ObjectId } = require("mongodb");
const comments = require("../../models/comments");
const multer = require("multer");
const upload = multer({});
const user = require("../../models/user");
router.post("/finddata",postcontroller.postfinddata);
router.post("/like", postcontroller.postlike);
router.post("/dislike", postcontroller.postdislike);
router.post("/comment", postcontroller.postdatacomment);

router.post("/update", upload.single("img-upd"), postcontroller.postupdatepost);
router.post("/delete", postcontroller.postdeletepost);
module.exports = router;
