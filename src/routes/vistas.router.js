import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";

export const router=Router();

const pm = new productManagerDB;
const cm = new CartManagerDB;

const auth=(req, res, next)=>{
  if(!req.session.usuario) return res.redirect('/login') 
  next();
}

const auth2=(req, res, next)=>{
  if(req.session.usuario) return res.redirect('/')    
  next();
}

router.get('/',auth,(req,res)=>{

  res.setHeader('Content-Type','text/html');
  res.status(200).render('home',{
      nombreCompleto:req.session.usuario.nombre+' '+req.session.usuario.apellido
  })
})

router.get("/products", async (req, res) => {
  let products = await pm.getProducts(req);
  let carts = await cm.getCarts();
  res.render("products", { products, carts, styles: "products.css" });
});

router.get("/carts/:cid", async (req, res) => {
  let cart = await cm.getCartView(req, res);
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await pm.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

router.get('/',auth,(req,res)=>{

  res.setHeader('Content-Type','text/html');
  res.status(200).render('home',{
      nombreCompleto:req.session.usuario.nombre+' '+req.session.usuario.apellido
  })
})

router.get('/registro',auth2,(req,res)=>{
  
  res.setHeader('Content-Type','text/html');
  res.status(200).render('registro')
})

router.get('/login',auth2,(req,res)=>{
  
  res.setHeader('Content-Type','text/html');
  res.status(200).render('login')
})

export default router;