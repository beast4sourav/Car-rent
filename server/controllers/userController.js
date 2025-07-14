import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateToken = (userId)=>{
    const payload = userId
    return jwt.sign(payload, process.env.JWT_SECRET)
}


export const registerUser = async (req, res)=>{
    try {
        const{name,email,password} = req.body
        if(!name || !email || !password || password.length < 8){
            return res.json({succes:false, message:'fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({succes:false, message:'User already Exists'})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({name, email, password:hashedPassword})

        const token = generateToken(user._id.toString())
        res.json({succes:true,token})
    } catch (error) {
        console.log(error.message)
        return res.json({succes:false, message:error.message})
    }
}

export const loginUser = async(req,res)=>{
    try {
        const{email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({succes:false, message:"User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({succes:false, message:"Invalid Credentials"})
        }
        const token = generateToken(user._id.toString())
        res.json({succes:true,token})
    } catch (error) {
        console.log(error.message)
        return res.json({succes:false, message:error.message})
    }
}

export const getUserData = async(req,res)=>{
    try {
        const {user} = req;
        res.json({succes:true, user})
    } catch (error) {
        console.log(error.message)
        return res.json({succes:false, message:error.message})
    }
}