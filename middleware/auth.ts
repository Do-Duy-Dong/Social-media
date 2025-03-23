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
        const rooms:Object[]= await room.find({
            status:'Already',
            "user.user_id":user._id
        }).lean();
        const arr= rooms.map(item=>item['user'].find(record=> record.user_id!=user._id).user_id);
        const users= await User.find({_id:{$in:arr}}).select("fullName avatar").lean();
        users.forEach((item,index) => {
            item['room_id']=rooms[index]['_id'].toString();
        });
        const chatBot= await room.findOne({type:'Chat Bot','user.user_id':user._id});

        res.locals.chatBot=chatBot;
        res.locals.user= user;
        res.locals.room=users;
        next();
    }
    catch(err){
        res.redirect(`${home()}/user/login`); 
    }
}