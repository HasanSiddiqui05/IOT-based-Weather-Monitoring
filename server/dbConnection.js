import mongoose from 'mongoose'
import dotenv from 'dotenv'


dotenv.config()
async function ConnectDb(){
   try{
       await  mongoose.connect(process.env.MONGO_URI)
       console.log('Db connection established');
   }
    catch(err){
        console.log('Db connection fail',err);
    }
}

export default ConnectDb;