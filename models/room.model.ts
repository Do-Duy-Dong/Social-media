import mongoose from "mongoose";

const roomSchema= new mongoose.Schema({
    roomName:String,
    avatar:String,
    type:String,
    user:[
        {
            user_id:String,
            fullName:String
        }
    ]
    ,
    status:{
        type:String,
        enum:['Already','Not']
    }

},{
    timestamps:true
});
const room= mongoose.model("room",roomSchema,"room");
export default room;