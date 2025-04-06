import { NextFunction,Request, Response } from "express";
import room from "../models/room.model";
import User from "../models/user.model";

export default async function (req:Request,res:Response,next:NextFunction): Promise<void> {
    
    const roomGroup = await room.find({
        type: 'Group Chat',
        'user.user_id': global.myUser._id.toString()
    });
    res.locals.roomGr=roomGroup;
    next();
}