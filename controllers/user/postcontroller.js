const { ObjectId } = require("mongodb");
const comments = require("../../models/comments");
const post = require("../../models/post");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ddnofir7e",
  api_key: "323412712195694",
  api_secret: "ytSxbyM1v3JFk4K8Y8l4H_L_mBA",
});
module.exports.postdatacomment = async (req, res, next) => {
  let { comment, postid } = req.body;
  try {
    let date = new Date();
    let added = await comments.create({
      postid: postid,
      comment: comment,
      userid: req.user._id,
      dateUser: date,
    });
    let postshow = await post.findOne({ _id: postid });
    postshow.comments.push(added._id);
    await postshow.save();
    await postshow.populate({
      path: "comments",
      populate: { path: "userid" },
      options: { sort: { date: "desc" } },
    });
    res.json(postshow);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
// data rendering
module.exports.postpost = async (req, res, next) => {
  let { postid } = req.body;
  try {
    let postshow = await post.findOne({ _id: postid }).populate([
      "userid",
      {
        path: "comments",
        populate: { path: "userid" },
        options: { sort: { date: "desc" } },
      },
    ]);
    if (JSON.stringify(req.user._id) == JSON.stringify(postshow.userid._id)) {
      return res.render("carouselpostopen", {
        username: req.user.username,
        post: postshow,
        comments: postshow.comments,
      });
    } else {
      return res.render("carouselpostopen", {
        username: req.user.username,
        post: postshow,
        comments: postshow.comments,
        show: true,
      });
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postdislike = async (req, res, next) => {
  let { postid } = req.body;
  const userId = new ObjectId(req.user._id);
  try {
    let postupdate = await post.findOne({ _id: postid });
    if (postupdate.likedBy.includes(userId)) {
      postupdate.likedBy = postupdate.likedBy.filter((id) => {
        return id == userId;
      });

      postupdate.likes = postupdate.likes > 1 ? postupdate.likes - 1 : 0;
      await postupdate.save();
    }
    if (!postupdate.dislikedBy.includes(userId)) {
      postupdate.dislikes += 1;
      postupdate.dislikedBy.push(userId);
      await postupdate.save();
    }

    res.json(postupdate);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postlike = async (req, res, next) => {
  let { postid } = req.body;
  const userId = new ObjectId(req.user._id);
  try {
    let postupdate = await post.findOne({ _id: postid });
    if (postupdate.dislikedBy.includes(userId)) {
      postupdate.dislikedBy = postupdate.dislikedBy.filter(
        (id) => id == userId
      );
      postupdate.dislikes =
        postupdate.dislikes > 1 ? postupdate.dislikes - 1 : 0;
      await postupdate.save();
    }
    if (!postupdate.likedBy.includes(userId)) {
      postupdate.likes += 1;
      postupdate.likedBy.push(userId);

      await postupdate.save();
    }

    res.json(postupdate);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.postdeletepost = async (req, res, next) => {
  let { postid } = req.body;

  try {
    await post.deleteOne({ _id: postid });
    await comments.deleteMany({ postid: postid });
    req.user.posts = req.user.posts.filter((id) => id != postid);
    await req.user.save();
    let postshow = await post.find({ userid: req.user._id });
    res.json(postshow);
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
module.exports.updatePost = async (
  postToUpdate,
  { caption, description, imgurl } = {}
) => {
  if (imgurl) {
    postToUpdate.imgurl = imgurl;
  }

  postToUpdate.caption = caption;
  postToUpdate.description = description;

  return postToUpdate.save();
};
module.exports.renderPostsView = async (req, res) => {
  const posts = await post.find({ userid: req.user._id });

  res.render("posts", {
    username: req.user.username,
    posts: posts,
  });
};
module.exports.postupdatepost = async (req, res, next) => {
  let { caption, description, postid } = req.body;
  const parser = new DatauriParser();
  try {
    const postToUpdate = await post.findOne({ _id: postid });
    if (req.file) {
      const parser = new DatauriParser();

      cloudinary.uploader.upload(
        parser.format(".png", req.file.buffer).content,
        async (error, result) => {
          if (error) {
            throw new Error(error.message);
          }
          const imgurl = result.url;

          await module.exports.updatePost(postToUpdate, {
            caption,
            description,
            imgurl,
          });

          module.exports.renderPostsView(req, res);
        }
      );
    } else {
      await module.exports.updatePost(postToUpdate, { caption, description });

      module.exports.renderPostsView(req, res);
    }
  } catch (err) {
    req.flash("info", `${err}`);
    next();
  }
};
