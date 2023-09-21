// const passport = require("passport");
// const bcrypt = require("bcryptjs");

// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const User = require("./models/User");

// // Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/user/auth/google/callback",
//       passReqToCallback: true,
//     },
//     async (req, accessToken, refreshToken, profile, cb) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           user = new User({
//             firstName: profile.name.givenName,
//             lastName: profile.name.familyName,
//             email: profile.emails[0].value,
//             googleId: profile.id,
//           });
//           await user.save();
//         }

//         return cb(null, user);
//       } catch (err) {
//         console.error("Error in GoogleStrategy:", err);
//         return cb(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, cb) => {
//   console.log("Serializing user:", user);
//   cb(null, user._id);
// });

// passport.deserializeUser(async (id, cb) => {
//   try {
//     const user = await User.findById(id);
//     cb(null, user);
//   } catch (err) {
//     console.log("Error deserializing", err);
//     cb(err, null);
//   }
// });

// Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "emails", "name"],
//     },
//     async (token, refreshToken, profile, done) => {
//       const newUser = {
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         email: profile.emails[0].value,
//         facebookId: profile.id,
//       };

//       try {
//         let user = await User.findOne({ facebookId: profile.id });
//         if (user) {
//           return done(null, user);
//         } else {
//           user = await User.create(newUser);
//           return done(null, user);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   )
// );
