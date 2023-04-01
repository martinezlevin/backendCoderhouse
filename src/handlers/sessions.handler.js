import { creaHash, esClaveValida } from "../helpers/utils.js";
import { usuarioModelo } from "../dao/models/usuario.modelo.js";

const userRegister = async (req, res) => {

    try {

    res.redirect('/login');

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "No se puede conectar con la base de datos"
        });
    }
}

const userLogin = async (req, res) => {
    try { req.session.userLogged={
          name:req.user.name, 
          lastName:req.user.lastName, 
          email: req.user.email, 
          age:req.user.age,
          role: req.user.role
        }
    
        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Error en el programa"
        });
    }
}

const userLogout = async (req, res) => {

    req.session.destroy((err)=>{
        if(err){
            res.sendStatus(500);
        }else{
            res.redirect('/login');
        }
    });
}

const userErrorLogin = (req, res)=>{res.send('Error Login');};

const userErrorRegister = (req, res)=>{res.send('Error Register');};

export {userRegister, userLogin, userLogout, userErrorLogin, userErrorRegister}