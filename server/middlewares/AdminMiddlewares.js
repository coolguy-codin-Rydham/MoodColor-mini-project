import jwt from "jsonwebtoken"
import {AdminModel} from "../model/index.js"
import logger from "../config/logger.js";
export const verifyAdmin = async(req, res, next) => {
    // logger.log("{Middleware hit} VerifyAdmin")
  try {
    const token = req.cookies.token;
    if(!token){
        return res.json(403).json({
            message: "Invalid Token or Token Not Found"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AdminModel.findById(decoded.id);
        if(!user){
            // logger.log("{Middleware hit} VerifyAdmin: failed")
            return res.status(404).json({
                "message":"User Not Found"
            })
        }
        // logger.log("{Middleware hit} VerifyAdmin: succeed")

        req.user = {
            id: user._id.toString(),
        }
        next();
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: error.message,
        })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: error.message,
    })
  }
};


