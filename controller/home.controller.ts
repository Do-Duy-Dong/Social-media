import { Request,Response } from "express";
import Room from "../models/room.model";
import User from "../models/user.model";
export const index=async (req:Request,res:Response):Promise<void>=>{
    try{
        
        const room:Object[] = await Room.find({});
        res.render("pages/home/index",{
            
        })
        
    }
    catch(err){
        res.json(err)
    }

}
export const profile=async (req:Request,res:Response):Promise<void>=>{
    const user= await User.findOne({tokenUser:req.cookies.tokenUser});
    res.render("pages/home/profile",{
        user:user
    });
}
export const profilePost=async (req:Request,res:Response):Promise<void>=>{
    try {
        interface check{
            fullName:string,
            email:string,
            phone:string,
            avatar?:string
        }
        const object:check=req.body;
        const id= req.params.id;
        await User.updateOne({_id:id},object);
        res.redirect('back');
    } catch (error) {
        console.log(error)
    }
    
}
