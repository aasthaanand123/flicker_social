const express = require("express");
const router = express.Router();
const passport = require("../../auth/passport");
const signUpcontroller = require("../../controllers/user/signup");
const socketUserMap = new Map();

router.get(
  "/signup",
  signUpcontroller.alreadySignedIn,
  signUpcontroller.getSignUp
);
router.post("/signup", signUpcontroller.postSignUp);
router.get(
  "/login",
  signUpcontroller.alreadySignedIn,
  signUpcontroller.getLogin
);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/auth/login",
    failureFlash: "Invalid username or password",
  }),

  function (req, res) {
    res.redirect("/user/dash/profile");
  }
);
router.post("/logout", signUpcontroller.logout);
router.get("/logout", signUpcontroller.logout);
router.get("/signout", (req, res, next) => {
  res.render("signout", {
    username: req.user.username,
  });
});
router.post("/signout", signUpcontroller.postsignout);
router.use(signUpcontroller.error);
module.exports = router;