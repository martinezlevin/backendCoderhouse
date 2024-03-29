import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "./config.js";
import { cartsService, usersService } from "../dao/factory.js";
import { CurrentUserDto } from "../dto/users.dto.js";
import { createHash, isValidPassword } from "../utils/utils.js";

const extractToken = (req) => {
  return req.cookies.idToken || null;
};

export const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractToken]),
        secretOrKey: 'mi_clave_secreta',
      },
      (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
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
          let currentUser = await usersService.getByEmail(email);

          if (!currentUser) {
            let newUser = {
              name,
              email,
              github: true,
              githubProfile: profile._json,
            };
            currentUser = await usersService.create(newUser);
          } else {
            let newData = {
              github: true,
              githubProfile: profile._json,
            };
            await usersService.updateByEmail(email, newData);
          }

          let user = new CurrentUserDto(currentUser);

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
          let { firstName, lastName, birthday } = req.body;
          if (!username || !password) return done(null, false);

          let currentUser = await usersService.getByEmail(username);
          if (currentUser) return done(null, false);

          let isAdmin = username === config.adminMail && password === config.adminPassword;
          let role = isAdmin ? "Administrador" : "Usuario";
          let cart = await cartsService.create({ alias: "Mi compra" });
          let user = await usersService.create({
            firstName,
            lastName,
            email: username,
            password: createHash(password),
            birthday,
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

          let currentUser = await usersService.getByEmail(username);
          if (!currentUser || !isValidPassword(password, currentUser)) return done(null, false);

          let user = new CurrentUserDto(currentUser);

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
    let user = await usersService.getById(id);
    done(null, user);
  });
};