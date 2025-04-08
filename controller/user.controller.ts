import { Request,Response } from "express"
import User from "../models/user.model";
import session from "express-session";
import room from "../models/room.model";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { chatSocket } from "../function/char";
import { home } from "../config/home";
export const login= async (req:Request,res:Response):Promise<void>=>{
    res.render("pages/auth/login.ejs",{});
}
export const loginPost= async (req:Request,res:Response):Promise<void>=>{
    try{
    const email:string = req.body.email;
    const password:string= md5(req.body.password);
    const user = await User.findOne({
        email:email,
        password: password
    })
    if(!user){
        res.status(400).json({err:"email or password not existed"});
        return;
    }
    const token = jwt.sign({id:user._id},process.env.ACCESS_KEY);
    res.cookie("tokenUser",token);
    await User.updateOne({
        email:email,
        password: password},{
        tokenUser:token
        });
        
    res.status(200).json({redirect:`${home()}/home/profile`});
    
    }
    catch(err){
        res.status(400).json(err);
    }
}
export const register =async (req:Request,res:Response):Promise<void>=>{
    res.render("pages/auth/register.ejs",{});
}
export const registerPost =async (req:Request,res:Response):Promise<void>=>{
    try{
        const {email,fullName,password,confirmPass}= req.body;
        const user = await User.findOne({email:email});
        if(user || password != confirmPass){
            res.status(400).json("Lỗi");
            return;
        }
        
        const record= new User({
            fullName:fullName,
            email:email,
            password:md5(password),
        })
        await record.save();
        const chatBot= new room({
            type:"Chat Bot",
            user:{
                user_id:record._id,
                fullName:record.fullName
            }
        });
        await chatBot.save();
        res.status(200).json(
            {redirect:`${home()}/user/login`}
        );
        // res.redirect()

    }
    catch(err){
        res.status(400).json({err:"Lỗi"})
    }   
}
export const logout =async (req:Request,res:Response):Promise<void>=>{
    res.clearCookie('tokenUser');
    res.redirect(`${home()}/user/login`);
}