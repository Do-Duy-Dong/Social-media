"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outGroup = exports.chatRoom = exports.groupChatPost = exports.groupChat = exports.chatBot = exports.getRoom = exports.index = void 0;
const chat_model_1 = __importDefault(require("../models/chat.model"));
const room_model_1 = __importDefault(require("../models/room.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const home_1 = require("../config/home");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const chats = yield chat_model_1.default.find({ room_chat_id: id });
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName');
    const rooms = yield room_model_1.default.findOne({ _id: id });
    const another = rooms.user.find(item => item.user_id != user._id.toString());
    const user2 = yield user_model_1.default.findOne({ _id: another.user_id }).select('id fullName avatar');
    res.render("pages/chat/index.ejs", {
        chat: chats,
        room_id: id,
        user2: user2
    });
});
exports.index = index;
const getRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { my_id, another_id } = req.body;
    yield room_model_1.default.updateOne({ 'user.user_id': { $all: [my_id, another_id] } }, { status: 'Already' });
    const Room = yield room_model_1.default.findOne({ type: 'Chat Friend', 'user.user_id': { $all: [my_id, another_id] } });
    res.status(200).json({
        room_id: Room._id
    });
});
exports.getRoom = getRoom;
const chatBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const room_id = req.params.id;
    var history = ``;
    const chatbotNamespace = global.__chat.of("/chat");
    const chats = yield chat_model_1.default.find({ room_chat_id: room_id });
    chatbotNamespace.once('connection', socket => {
        socket.join(room_id);
        socket.on('question-user', (data) => __awaiter(void 0, void 0, void 0, function* () {
            chatbotNamespace.to(room_id).emit('bot-sendback', data);
            history += ` User: ${data.msg}\nAssistant:`;
        }));
    });
    res.render("pages/chat/chatbot.ejs", {
        chat: chats
    });
});
exports.chatBot = chatBot;
const groupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName');
    const roomGroup = yield room_model_1.default.find({
        type: 'Group Chat',
        'user.user_id': user._id.toString()
    });
    res.render("pages/group/index.ejs", {
        roomGr: roomGroup
    });
});
exports.groupChat = groupChat;
const groupChatPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName');
    const newRoom = new room_model_1.default({
        roomName: req.body.roomName,
        avatar: req.body.avatar,
        type: 'Group Chat',
        user: [{
                user_id: user._id,
                fullName: user.fullName
            }]
    });
    yield newRoom.save();
    res.redirect(`${(0, home_1.home)()}/chat/groupChat`);
});
exports.groupChatPost = groupChatPost;
const chatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select('id fullName friendList');
    const roomGroup = yield room_model_1.default.find({
        type: 'Group Chat',
        'user.user_id': user._id.toString()
    });
    const newRoom = yield room_model_1.default.findOne({ _id: req.params.id });
    var arr = newRoom.user.map(item => item.user_id);
    const listInvite = user.friendList.filter(item => !arr.includes(item));
    const users = yield user_model_1.default.find({ _id: { $in: listInvite } }).select("id fullName avatar");
    const chat = yield chat_model_1.default.find({ room_chat_id: newRoom._id.toString() });
    res.render("pages/group/chat.ejs", {
        roomGr: roomGroup,
        newRoom: newRoom,
        chat: chat,
        friendList: users
    });
});
exports.chatRoom = chatRoom;
const outGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield room_model_1.default.updateOne({ _id: req.body.room_id }, {
            $pull: { user: { user_id: req.body.user_id } }
        });
        res.status(200).json({
            url: `${(0, home_1.home)()}/chat/groupChat`
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.outGroup = outGroup;
