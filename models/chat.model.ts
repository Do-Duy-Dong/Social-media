
import mongoose from "mongoose";
const chatSchema= new mongoose.Schema({
    sender:String,   
    myName:String,
    room_chat_id: String,
    content: String,
    images: {
        type:[String]
    },
    read:{
        type:Boolean,
        default:false
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date,},
    {
        timestamps:true
    }
);

const Chat=mongoose.model("Chat",chatSchema,"Chat");
export default Chat;