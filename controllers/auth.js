const {response} =require('express');
const bcrypt =require('bcryptjs');
const Usuario= require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario =async (req, res=response)=>{
   
   const {email, password} = req.body;

   try {
    
    const existeEmail = await Usuario.findOne({email});

    
    if(existeEmail){
        return res.status(400).json({
            ok: false,
            msg: 'El correo ya esta registrado'
        });
    }
    const usuario = new Usuario(req.body);
    //encriptar contrseña
    const salt = bcrypt.genSaltSync();
    usuario.password= bcrypt.hashSync(password,salt);
    await usuario.save();
    const token= await generarJWT(usuario.id);
    
     res.json({
         ok:true,
         usuario,
         token
     });       
   } catch (error) {
       console.log(error);
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       });
   }
}

const login = async (req, res= response)=>{
    
    const {email, password}= req.body;
    //Verificamos que el email se encuentre en la bd
    try {
        const usuarioDB= await Usuario.findOne({email});
        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }
     //Validamos la contraseña   
        const validPassword = bcrypt.compareSync(password,usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'La contraseña e sinvalida'
            });
        }
     //generamos el token
     const token = await generarJWT(usuarioDB.id); 
     
     //enviamos la respuesta

     res.status(500).json({
        ok: true,
        usuario: usuarioDB,
        token
    });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
    
    
    
}
   
   
   const renewToken= async(req, res=response)=>{
        
   

        const uid= req.uid;
        console.log(uid);    
        const token= await generarJWT(uid);

        const usuario = await Usuario.findById(uid);
    
    
    res.json({
           ok:true,
           usuario,
           token
       })
   }
   
 


module.exports= {
     crearUsuario,
     login,
     renewToken
}