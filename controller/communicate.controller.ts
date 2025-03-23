import { Request, Response } from "express";
import axios from 'axios';
import Chat from "../models/chat.model";
import room from "../models/room.model";
import User from "../models/user.model";
import { home } from "../config/home";
import callHuggingFaceAPI from "../function/callChatBot";
export const index = async (req: Request, res: Response): Promise<void> => {
    
    const id: string = req.params.id;
    const chats = await Chat.find({ room_chat_id: id });
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName');

    const rooms = await room.findOne({ _id: id });
    const another = rooms.user.find(item => item.user_id != user._id.toString());
    const user2=await User.findOne({_id:another.user_id}).select('id fullName avatar');
    res.render("pages/chat/index.ejs", {
        chat: chats,
        room_id: id,
        user2: user2
    });
}
export const getRoom = async (req: Request, res: Response): Promise<void> => {
    const { my_id, another_id } = req.body;
    await room.updateOne(
        { 'user.user_id': { $all: [my_id, another_id] } },
        { status: 'Already' });
    const Room = await room.findOne({ type:'Chat Friend', 'user.user_id': { $all: [my_id, another_id] } });

    res.status(200).json({
        room_id: Room._id
    });

}
export const chatBot = async (req: Request, res: Response): Promise<void> => {
    const room_id = req.params.id;
    var history = ``;
    const chatbotNamespace = global.__chat.of("/chat");
    const chats = await Chat.find({ room_chat_id: room_id });
    chatbotNamespace.once('connection', socket => {
        socket.join(room_id);
        socket.on('question-user', async data => {
            
            chatbotNamespace.to(room_id).emit('bot-sendback', data);
            history += ` User: ${data.msg}\nAssistant:`;
            // const message= await callHuggingFaceAPI(history);
            // history+=` ${message}\n`;
            // chatbotNamespace.to(room_id).emit('bot-sendback', {
            //     msg:message,
            //     sender:'Bot'
            // });
            
    });
});
    res.render("pages/chat/chatbot.ejs", {
        chat: chats
    })
}
export const groupChat = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName');
    const roomGroup = await room.find({
        type: 'Group Chat',
        'user.user_id': user._id.toString()
    });
    res.render("pages/group/index.ejs", {
        roomGr: roomGroup
    })
}
export const groupChatPost = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName');
    const newRoom = new room(
        {
            roomName: req.body.roomName,
            avatar: req.body.avatar,
            type: 'Group Chat',
            user: [{
                user_id: user._id,
                fullName: user.fullName
            }]
        });
    await newRoom.save();
    res.redirect(`${home()}/chat/groupChat`);
}
export const chatRoom = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName friendList');

    const roomGroup = await room.find({
        type: 'Group Chat',
        'user.user_id': user._id.toString()
    });
    const newRoom = await room.findOne({ _id: req.params.id });

    var arr: string[] = newRoom.user.map(item => item.user_id);
    const listInvite: string[] = user.friendList.filter(item => !arr.includes(item));
    const users = await User.find({ _id: { $in: listInvite } }).select("id fullName avatar");

    const chat = await Chat.find({ room_chat_id: newRoom._id.toString() });
    res.render("pages/group/chat.ejs", {
        roomGr: roomGroup,
        newRoom: newRoom,
        chat: chat,
        friendList: users
    });

}
export const outGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        await room.updateOne({ _id: req.body.room_id }, {
            $pull: { user: { user_id: req.body.user_id } }
        });
        res.status(200).json({
            url: `${home()}/chat/groupChat`
        })
    } catch (error) {
        console.log(error);
    }


}
