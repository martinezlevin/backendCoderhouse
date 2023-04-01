import passport from 'passport';
import local from 'passport-local';
import { creaHash, esClaveValida } from '../helpers/utils.js';
import { usuarioModelo } from '../dao/models/usuario.modelo.js';

export const inicializaEstrategia = ()=>{

 passport.use('register', new local.Strategy({usernameField:'email', passReqToCallback:true}, async(req, username, password, done)=>{
                                                                    
        try {
            let {name, lastName, age}=req.body;

            if(!username || !password) return done(null, false);
        
            let actualUser=await userModels.findOne({email:username});
            
            if(actualUser) return done(null, false);
            
            let userCreated = await userModels.create({
                name, lastName, email, 
                password: creaHash(password),
                age,
                role
            })

            return done(null, userCreated);
                
        } catch (error) {
            done(error);            
        }

    
    }))


    passport.use('login', new local.Strategy({usernameField:'email'}, async(username, password, done)=>{
        
     try {
        
         if(!username || !password) return done(null, false)
 
         let userLogged= await userModels.findOne({email:username});
         if(!userLogged) return done(null, false);
 
         if(!esClaveValida(password, userLogged )) return done(null,false);
        console.log('paso por aca');
        //console.log(userLogged);
        return done(null, userLogged);
     } catch (error) {
        return done(error);
     }
    }));

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    });

    passport.deserializeUser(async(id, done)=>{
        let userLogged = await userModels.findOne({_id:id});
        done(null, userLogged);
    });
}