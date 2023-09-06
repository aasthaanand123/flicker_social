const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({});
const signUpcontroller = require("../../controllers/user/signup");
const postcontroller = require("../../controllers/user/postcontroller");
const profilecontroller = require("../../controllers/user/profilecontroller");

router.get("/profile", signUpcontroller.getProfile);
router.get("/addpost", signUpcontroller.getaddpost);

router.post(
  "/addpost",
  upload.single("img-post"),
  profilecontroller.postaddpost
);
router.get("/posts", profilecontroller.getposts);
router.post("/post", postcontroller.postpost);
router.get("/discover", profilecontroller.getdiscover);
router.post("/visitProfile", profilecontroller.postVisitProfile);
router.get("/visitMyProfile", profilecontroller.getvisitMyProfile);
router.post(
  "/updateProfile",
  upload.single("imginp"),
  profilecontroller.postUpdateProfile
);
router.get("/helpandsupport", profilecontroller.gethelp);

router.post(
  "/helpandsupport",
  upload.single("img-post"),
  profilecontroller.posthelp
);
router.get("/getTicket", profilecontroller.getTicket);
router.post("/follow", profilecontroller.postfollow);
router.post("/unfollow", profilecontroller.postunfollow);
module.exports = router;
