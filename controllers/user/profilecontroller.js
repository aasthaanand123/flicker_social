const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ddnofir7e",
  api_key: "323412712195694",
  api_secret: "ytSxbyM1v3JFk4K8Y8l4H_L_mBA",
});
const post = require("../../models/post");
const user = require("../../models/user");
const issues = require("../../models/issues");
const messages = require("../../models/messages");
const { io } = require("../../server");
const { ObjectId } = require("mongodb");
module.exports.postaddpost = async (req, res, next) => {
  let { caption, comments } = req.body;
  let userid = req.user._id;
  const parser = new DatauriParser();
  try {
    cloudinary.uploader.upload(
      parser.format(".png", req.file.buffer).content,
      async (error, result) => {
        let imgurl = result.url;
        let date = new Date();
        let created = await post.create({
          userid: userid,
          imgurl: imgurl,
          caption: caption,
          description: comments,
          dateUser: date,
        });
        req.user.posts.push(created._id);
        await req.user.save();
        res.redirect("/user/dash/posts");
      }
    );
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
// data rendering
module.exports.getposts = async (req, res, next) => {
  try {
    let updated = await user
      .findOne({ _id: req.user._id })
      .populate({ path: "posts", options: { sort: { date: "desc" } } })

      .exec();
    res.render("posts", {
      posts: updated.posts,
      username: req.user.username,
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.getdiscover = async (req, res, next) => {
  try {
    // apply pagination
    const followingIds = req.user.following.map((id) => id.toString());
    followingIds.push(req.user._id.toString());
    let posts = await post
      .find({ userid: { $nin: followingIds } })
      .populate({ path: "userid" })
      .limit(4)
      .exec();
    res.render("discover", {
      username: req.user.username,
      posts: posts,
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postVisitProfile = async (req, res, next) => {
  let { userid } = req.body;
  try {
    let usershow = await user
      .findOne({ _id: userid })
      .populate({
        path: "posts",
        populate: [
          { path: "comments", populate: "userid" },
          "likedBy",
          "dislikedBy",
        ],
      })
      .exec();
    let isInArrayfollower = usershow.followers.some(function (follower) {
      return follower.equals(req.user._id);
    });
    let isInArrayRequested = usershow.requesting.some(function (follower) {
      return follower.equals(req.user._id);
    });
    if (isInArrayfollower) {
      res.render("othersprofile", {
        username: req.user.username,
        user: usershow,
        posts: usershow.posts,
        follow: true,
        showfollowing: true,
      });
    } else if (isInArrayRequested) {
      res.render("othersprofile", {
        username: req.user.username,
        user: usershow,
        posts: usershow.posts,
        follow: true,
        showrequesting: true,
      });
    } else {
      res.render("othersprofile", {
        username: req.user.username,
        user: usershow,
        posts: usershow.posts,
        follow: true,
        showfollow: true,
      });
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.getvisitMyProfile = async (req, res, next) => {
  try {
    let usershow = await user
      .findOne({ _id: req.user._id })
      .populate("posts")
      .exec();
    res.render("othersprofile", {
      username: req.user.username,
      user: usershow,
      posts: usershow.posts,
      show: true,
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postUpdateProfile = async (req, res, next) => {
  let { userinp } = req.body;
  try {
    if (req.file) {
      const parser = new DatauriParser();

      cloudinary.uploader.upload(
        parser.format(".png", req.file.buffer).content,
        async (error, result) => {
          if (error) {
            throw new Error(error.message);
          }
          req.user.imgurl = result.url;
          req.user.username = userinp;
          await req.user.save();
          res.redirect("/user/dash/visitMyProfile");
        }
      );
    } else {
      req.user.username = userinp;
      await req.user.save();
      res.redirect("/user/dash/visitMyProfile");
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.gethelp = (req, res, next) => {
  if (req.user) {
    res.render("helpandsupport", {
      username: req.user.username,
    });
  } else {
    res.redirect("/user/auth/login");
  }
};

module.exports.posthelp = async (req, res, next) => {
  let { title, description } = req.body;
  try {
    let date = new Date();
    if (req.file) {
      const parser = new DatauriParser();
      cloudinary.uploader.upload(
        parser.format(".png", req.file.buffer).content,
        async (error, result) => {
          if (error) {
            throw new Error(error.message);
          }
          let issue = await issues.create({
            userid: req.user._id,
            title: title,
            description: description,
            imgurl: result.url,
            dateUser: date,
          });

          res.redirect("/user/dash/getTicket");
        }
      );
    } else {
      let issue = await issues.create({
        userid: req.user._id,
        title: title,
        description: description,
        dateUser: date,
      });
      res.redirect("/user/dash/getTicket");
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};

module.exports.getTicket = async (req, res, next) => {
  try {
    let tickets = await issues.find({ userid: req.user._id });
    res.render("ticket", {
      username: req.user.username,
      tickets: tickets,
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postfollow = async (req, res, next) => {
  try {
    let { userid } = req.body;
    console.log(userid);
    req.user.requested.push(userid);
    let upduser = await user.findOne({ _id: userid });
    upduser.requesting.push(req.user._id);
    await upduser.save();
    await req.user.save();
    res.json(true);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postunfollow = async (req, res, next) => {
  try {
    let { userid } = req.body;

    req.user.following = req.user.following.filter((id) => !id.equals(userid));
    await req.user.save();
    let upduser = await user.findOne({ _id: userid });

    upduser.followers = upduser.followers.filter(
      (id) => !id.equals(req.user._id)
    );
    await upduser.save();

    res.json(true);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postcancelrequest = async (req, res, next) => {
  try {
    let userid = req.body.userid;
    req.user.requested = req.user.requested.filter((id) => !id.equals(userid));
    await req.user.save();
    let userupd = await user.findOne({ _id: userid });
    userupd.requesting = userupd.requesting.filter(
      (id) => !id.equals(req.user._id)
    );
    userupd.save();
    res.json(true);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.getpendingrequests = async (req, res, next) => {
  try {
    let usershow = await user
      .findOne({ _id: req.user._id })
      .populate("requesting");
    res.render("pendingrequests", {
      username: req.user.username,
      requests: usershow.requesting,
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postacceptreq = async (req, res, next) => {
  try {
    let userid = req.body.userid;
    req.user.requesting = req.user.requesting.filter(
      (id) => !id.equals(userid)
    );
    req.user.followers.push(userid);
    await req.user.save();
    let userupd = await user.findOne({ _id: userid });
    userupd.requested = userupd.requested.filter(
      (id) => !id.equals(req.user._id)
    );
    userupd.following.push(req.user._id);
    userupd.save();
    res.redirect("/user/dash/pendingrequests");
    // send notification or message: not accepted by --
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postdeclinereq = async (req, res, next) => {
  try {
    let userid = req.body.userid;
    req.user.requesting = req.user.requesting.filter(
      (id) => !id.equals(userid)
    );
    await req.user.save();
    let userupd = await user.findOne({ _id: userid });
    userupd.requested = userupd.requested.filter(
      (id) => !id.equals(req.user._id)
    );
    userupd.save();
    // give some notification that requesting user has been declined to follow
    // in chat/notifications
    res.redirect("/user/dash/pendingrequests");
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.getchats = async (req, res, next) => {
  try {
    if (req.user) {
      let usersfollowing = await user
        .findOne({ _id: req.user._id })
        .populate("following");
      res.render("chats", {
        username: req.user.username,
        users: usersfollowing.following,
      });
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postchat = async (req, res, next) => {
  try {
    let userid = req.body.userid;
    let usershow = await user.findOne({ _id: userid });
    let ar1 = [req.user._id, userid];
    let messagessent = await messages
      .find({
        sender: { $in: ar1 },
        receiver: { $in: ar1 },
      })
      .sort({ created_at: "asc" });
    res.render("chatindividual", {
      username: req.user.username,
      user: req.user,
      sender: req.user,
      receiver: usershow,
      messages: messagessent,
    });
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
const connectedUsers = {};
io.on("connection", (socket) => {
  const socketid = socket.id;
  socket.on("user-connected", (value) => {
    connectedUsers[value] = socketid;
    socket.emit("user-socket-recorded");
  });

  socket.on("chat-message", async (inputvalue) => {
    try {
      let { sender, receiver, msg } = inputvalue;
      const newMessage = await messages.create({
        sender: sender,
        receiver: receiver,
        message: msg,
      });
      await newMessage.save();
      const receiverSocketId = connectedUsers[receiver];
      const senderSocketId = connectedUsers[sender];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("added-message", newMessage);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("added-message", newMessage);
      }
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socketid
    );
    if (userId) {
      delete connectedUsers[userId];
    }
  });
});
