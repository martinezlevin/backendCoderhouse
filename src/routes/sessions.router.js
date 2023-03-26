import { Router } from "express";
import { usuarioModelo } from "../dao/models/usuario.modelo.js";
import crypto from 'crypto';

export const router=Router();

router.post('/registro',async(req,res)=>{

    let {nombre, apellido, email, password, edad}=req.body;

    if(!email || !password) return res.sendStatus(400)

    let usuarioActual=await usuarioModelo.findOne({email:email})
    
    if(usuarioActual) return res.sendStatus(400);
    
    usuarioModelo.create({
        nombre, apellido, email, 
        password:crypto.createHash('sha256','palabraSecreta').update(password).digest('base64'),
        edad
    })

    res.redirect('/login');

})

router.post('/login',async(req,res)=>{
  
    let {email, password}=req.body;

    if(!email || !password) return res.sendStatus(400)

    let usuario=await usuarioModelo.findOne({email:email, password:crypto.createHash('sha256','palabraSecreta').update(password).digest('base64')})
    
    if(!usuario) return res.sendStatus(401)
    
    req.session.usuario={
        nombre:usuario.nombre, 
        apellido:usuario.apellido, 
        email, 
        edad:usuario.edad
    }

    res.redirect('/');
  
    
})

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            res.sendStatus(500);
        }else{
            res.redirect('/login');
        }
    });
})