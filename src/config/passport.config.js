import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import jwt from "passport-jwt";
import { cartsDao, usersDao } from "../dao/factory.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { config } from "./config.js";

const extractToken = (req) => {
  return req.cookies.idToken || null;
};

export const initializePassport = () => {
  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([extractToken]),
        secretOrKey: config.secretKey,
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
          let currentUser = await usersDao.getUser("email", email);

          if (!currentUser) {
            let newUser = {
              name,
              email,
              github: true,
              githubProfile: profile._json,
            };
            currentUser = await usersDao.createUser(newUser);
          } else {
            let newData = {
              github: true,
              githubProfile: profile._json,
            };
            await usersDao.updateUser("email", email, newData)
          }

          let { firstName, lastName, age, role, cart } = currentUser;
          let user = {
            firstName,
            lastName,
            email,
            age,
            role,
            cart,
          };

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

          let currentUser = await usersDao.getUser("email", username);
          if (currentUser) return done(null, false);

          let isAdmin = username === config.adminMail && password === config.adminPassword;
          let role = isAdmin ? "admin" : "user";
          let cart = await cartsDao.createCart();
          let user = await usersDao.creatUser({
            firstName,
            lastName,
            email: username,
            password: createHash(password),
            age,
            role,
            cart: cart._id,
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

          let currentUser = await usersDao.getUser("email", username);
          if (!currentUser || !isValidPassword(password, currentUser)) return done(null, false);

          let { firstName, lastName, email, age, role, cart } = currentUser;
          let user = {
            firstName,
            lastName,
            email,
            age,
            role,
            cart,
          };

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
    let user = await usersDao.getUser("_id", id);
    done(null, user);
  });
};