import { NextFunction, Request,Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken"
import room from "../models/room.model";
import { home } from "../config/home";
import { index } from "../controller/home.controller";
export default async function (req:Request,res:Response,next:NextFunction): Promise<void> {
    interface newUser{
        fullName:string,
        room_id:string
    }
    try{
        const token= req.cookies.tokenUser;
        const check= jwt.verify(token,process.env.ACCESS_KEY);
        const user= await User.findOne({tokenUser:token}).select("-password");
        const chatBot= await room.findOne({type:'Chat Bot','user.user_id':user._id});

        res.locals.chatBot=chatBot;
        res.locals.user= user;
        global.myUser=user;
        next();
    }
    catch(err){
        res.redirect(`${home()}/user/login`); 
    }
}