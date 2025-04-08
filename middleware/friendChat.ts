
import { NextFunction,Request, Response } from "express";
import room from "../models/room.model";
import User from "../models/user.model";

export default async function (req:Request,res:Response,next:NextFunction): Promise<void> {
    try {
        const rooms:Object[]= await room.find({
            type:'Chat Friend',
            status:'Already',
            "user.user_id":global.myUser._id
        }).sort({'lastMess.updateAt':-1}).lean();
        for(var item of rooms) {
            let user_id= item['user'].find(record=> record.user_id!=global.myUser._id.toString());
            let user=await User.findOne({_id:user_id.user_id}).select('id fullName avatar');
            item['fullName']=user.fullName;
            item['avatar']=user.avatar;
        };
        res.locals.room=rooms;
        next();
        
    } catch (error) {
        res.redirect(`back`); 
    }
    
}