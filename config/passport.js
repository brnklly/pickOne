const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, (jwt_payload, done) => {
      User.findOne({ _id: jwt_payload.id })
        .then(user => {
          // user found
          if (user) {
            return done(null, user);
          }

          // no user found
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
