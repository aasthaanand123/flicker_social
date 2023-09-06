const express = require("express");
const app = express();
const path = require("path");
const PORT = 4321;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const userRouter = require("./routes/user/login");
const profileRouter = require("./routes/user/profile");
const postRouter = require("./routes/user/post");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
app.use(flash());
require("dotenv").config();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));
const hbs = require("hbs");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user/auth", userRouter);
app.use("/user/dash/postdata", postRouter);
app.use("/user/dash", profileRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
