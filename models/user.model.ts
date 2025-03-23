import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    fullName:String,
    email:String,
    password:String,
    phone:String,
    avatar:String,
    tokenUser:{
        type:String,
    },
    friendList:{
        type:[String],
        default:[]
    },
    requestedF:[
        {
            user_id:String,
        }
    ],
    sendReqF:[{
        user_id:String
}]
    },{
        timestamps:true
    });
const User= mongoose.model("User",userSchema,"User");
export default User;