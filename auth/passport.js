const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const user = require("../models/user");
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let User = await user.findOne({ username: username });
      if (!User) return done(null, false);
      const match = await bcrypt.compare(password, User.password);
      if (match) {
        return done(null, User);
      }
      return done(null, false);
    } catch (err) {
      if (err) return done(err);
    }
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    let User = await user.findOne({ _id: id });
    done(null, User);
  } catch (err) {
    done(err);
  }
});
module.exports = passport;
