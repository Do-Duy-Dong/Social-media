import Social from "../models/social.model";
import User from "../models/user.model";
import { Request, Response } from "express";
import search from "../function/search";
export const friend = async (req: Request, res: Response): Promise<void> => {
    const record = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("friendList");
    const ids:Array<string> = record.friendList;
    const users= await User.find({_id:{$in:ids}}).select("id fullName avatar");
    
    res.render("pages/chat/friend.ejs", {
        users: users
    })

}
export const friendPend = async (req: Request, res: Response): Promise<void> => {
    const user=await User.findOne({ tokenUser: req.cookies.tokenUser }).select("requestedF");
    const ids= user.requestedF.map(obj=> obj.user_id);
    const users= await User.find({_id: {$in:ids } }).select("id fullName avatar");

    res.render("pages/chat/friendPend.ejs", {
        record: users
    })
}
export const addFriend = async (req: Request, res: Response): Promise<void> => {

    var find=[];
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("friendList sendReqF requestedF");
    if(req.query.keyword){
        let res:string= req.query.keyword.toLocaleString();
        const reg= new RegExp(res,"i");
        var users= await User.find({fullName:reg}).select("_id fullName").lean();   //mongose trả về kiểu document, ko phải object nên ko thể thêm giá trị linh tinh đc
        const arr1= user.friendList;
        const arr2= user.requestedF.map(item=> item.user_id);
        const arr3= user.sendReqF.map(item=>item.user_id);
        const arr4= [...new Set([...arr1,...arr2,...arr3])];
        const arr5= users.filter(item=> !arr4.includes(item._id.toString()));
        find=arr5;
        console.log(arr5)
    }
    res.render("pages/chat/addFriend.ejs", {
        record:find
    })
}

export const onlineFriend = async (req: Request, res: Response): Promise<void> => {
    res.render("pages/chat/onlineFr.ejs",{})
}
export const call = async (req: Request, res: Response): Promise<void> => {
    // res.render("pages/chat/call.ejs",{})
}

