const mongoose = require('mongoose');

const dbConecction = async()=>{
    try {
     await mongoose.connect(process.env.DB_CNN, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
      });
      console.log('DB mongo online');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos. hable con el admin');
    }
}

module.exports = {
    dbConecction 
}