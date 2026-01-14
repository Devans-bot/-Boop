import jwt from 'jsonwebtoken'
import User from '../models/usermodel.js'


export const Isauth=async(req,res,next)=>{
  try {
    const token = req.cookies?.token

    if(!token)return res.status(400).json({message:"Please login"})

    const decodeddata=jwt.verify(token,process.env.JWT_SEC)

   if(!decodeddata)return res.status(400).json({message:"Please login"})
      
   
    const user = await User.findById(decodeddata.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
        req.user = user;

    next()
  } catch (error) {
    console.log(error)
  }
}