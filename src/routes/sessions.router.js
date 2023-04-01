import { Router } from "express";
import { usuarioModelo } from "../dao/models/usuario.modelo.js";
import { userLogin, userLogout, userRegister, userErrorLogin, userErrorRegister } from "../handlers/sessions.handler.js";
import passport from "passport";

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/errorRegister', successRedirect:'/login'}), userRegister);

router.get('/errorLogin', userErrorLogin);

router.get('/errorRegister', userErrorRegister);

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), userLogin);

router.get('/logout', userLogout);

export const router=Router();