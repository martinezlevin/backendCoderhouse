import { Router } from "express";
import { usuarioModelo } from "../dao/models/usuario.modelo.js";
import { userLogin, userLogout, userRegister, userErrorLogin, userErrorRegister } from "../handlers/sessions.handler.js";
import passport from "passport";

Router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/errorRegister', successRedirect:'/login'}), userRegister);

Router.get('/errorLogin', userErrorLogin);

Router.get('/errorRegister', userErrorRegister);

Router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), userLogin);

Router.get('/logout', userLogout);

export {Router};