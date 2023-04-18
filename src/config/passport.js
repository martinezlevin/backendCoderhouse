import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import jwt from "passport-jwt";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../helpers/utils.js";

const extractToken = (req) => {
  return req.cookies.idToken || null;
};

export const initializePassport = () => {
  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([extractToken]),
        secretOrKey: "mySecretKey",
      },
      (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv1.e8fd645b5e5288cd",
        clientSecret: "ee5e81718973d4e19e644ae93a8383ea191a8803",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let { name, email } = profile._json;
          let user = await usersModel.findOne({ email: email });

          if (!user) {
            let newUser = {
              name,
              email,
              github: true,
              githubProfile: profile._json,
            };
            user = await usersModel.create(newUser);
          } else {
            let updateUser = {
              github: true,
              githubProfile: profile._json,
            };
            await usersModel.updateOne({ email: email }, updateUser);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "logup",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { firstName, lastName, age } = req.body;

          if (!username || !password) return done(null, false);

          let currentUser = await usersModel.findOne({ email: username });

          if (currentUser) return done(null, false);

          let role = username === "adminCoder@coder.com" && password === "adminCod3r123" ? "admin" : "user";

          let user = await usersModel.create({
            firstName,
            lastName,
            email: username,
            password: createHash(password),
            age,
            role,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) return done(null, false);

          let user = await usersModel.findOne({
            email: username,
          });

          if (!user || !isValidPassword(password, user)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersModel.findOne({ _id: id });
    done(null, user);
  });
};