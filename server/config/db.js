import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const mongouri = process.env.MONGO_URL;
const dbConnect = async()=>{
    try{
        // console.log(mongouri);
        mongoose.connect(mongouri);
    }catch(error){
        console.error("Database connection error: ", error);
        throw error;
    }
        
}


export {
    dbConnect
};