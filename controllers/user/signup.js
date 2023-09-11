const user = require("../../models/user");
const post = require("../../models/post");

const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports.alreadySignedIn = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/user/dash/profile");
  }
};
module.exports.getSignUp = (req, res, next) => {
  res.render("signup");
};
module.exports.postSignUp = async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let dateuser = new Date().toLocaleDateString();
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      await user.create({
        username: username,
        password: hash,
        dateUser: dateuser,
      });
      req.flash("msg", "Sign up successful. Please login now!");
      res.redirect("/user/auth/login");
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.getLogin = (req, res, next) => {
  res.render("login", {
    error: req.flash("error"),
    msg: req.flash("msg"),
  });
};
module.exports.getProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const followingIds = req.user.following.map((id) => id.toString());
      let users = await user
        .find({ _id: { $ne: req.user._id, $nin: followingIds } })
        .sort({ dateofjoining: "desc" })
        .limit(4)
        .exec();
      let posts = await post
        .find({ userid: { $in: followingIds } })
        .sort({ dateDB: "desc" })
        .populate({ path: "userid" })
        .limit(4)
        .exec();
      posts.forEach((post, index) => {
        if (index == 0) {
          post["index"] = 1;
        } else {
          post["index"] = 0;
        }
      });
      res.render("profile", {
        username: req.user.username,
        password: req.user.password,
        persons: users,
        posts: posts,
        user: req.user,
      });
    } else {
      res.redirect("/user/auth/login");
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.error = (req, res) => {
  res.render("error", {
    error: req.flash("info"),
  });
};
module.exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/user/auth/login");
  });
};
module.exports.getaddpost = (req, res, next) => {
  res.render("addposts", { username: req.user.username });
};
module.exports.postsignout = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    if (username == req.user.username) {
      bcrypt.compare(password, req.user.password, async function (err, result) {
        if (result) {
          await post.deleteMany({ userid: req.user._id });
          await like.deleteMany({ userid: req.user._id });
          await dislike.deleteMany({ userid: req.user._id });
          // delete image from cloudinary also
          await user.deleteOne({ _id: req.user._id });
          res.redirect("/user/auth/logout");
        }
      });
    } else {
      res.render("signout", {
        msg: "Enter correct details",
      });
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
