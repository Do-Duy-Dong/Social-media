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
exports.callSocket = exports.onlineSocket = exports.friendSocket = exports.chatSocket = void 0;
const chat_model_1 = __importDefault(require("../models/chat.model"));
const room_model_1 = __importDefault(require("../models/room.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const uploadImg_1 = __importDefault(require("../middleware/uploadImg"));
const home_1 = require("../config/home");
const userOnline = {};
const chatSocket = () => {
    const chatNamspace = global.__chat.of("/chat");
    chatNamspace.on("connection", socket => {
        socket.on("join", room => {
            socket.join(room.room);
        });
        socket.on("send-to-server", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                var images = yield Promise.all(data.img.map((ele) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, uploadImg_1.default)(ele); })));
                const chat = new chat_model_1.default({
                    sender: data.sender,
                    content: data.msg,
                    myName: data.myName,
                    images: images,
                    room_chat_id: data.room_id
                });
                yield chat.save();
                const newUser = yield user_model_1.default.findOne({ _id: data.sender }).select('id fullName');
                chatNamspace.to(data.room_id).emit("server-send-back", {
                    msg: data.msg,
                    img: images,
                    sender: data.sender,
                    myName: data.myName
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    });
};
exports.chatSocket = chatSocket;
const friendSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    const friendNamespace = global.__chat.of("/friend");
    friendNamespace.on("connection", socket => {
        socket.on("friend-send", (data) => __awaiter(void 0, void 0, void 0, function* () {
            let object = {
                user_id: data.another_id
            };
            yield user_model_1.default.updateOne({ _id: data.my_id }, {
                $push: { sendReqF: object }
            });
            yield user_model_1.default.updateOne({ _id: data.another_id }, {
                $push: { requestedF: { user_id: data.my_id } }
            });
            const record = yield user_model_1.default.findOne({ _id: data.my_id }).select("id fullName ");
            friendNamespace.emit("server-send-friend", {
                sender: record,
                receiver: data.another_id
            });
        }));
        socket.on("resultReq-to-server", (data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data.type = "accept") {
                yield user_model_1.default.updateOne({ _id: data.my_id }, {
                    $push: { friendList: data.another_id },
                    $pull: { requestedF: { user_id: data.another_id } }
                });
                yield user_model_1.default.updateOne({ _id: data.another_id }, {
                    $push: { friendList: data.my_id },
                    $pull: { sendReqF: { user_id: data.my_id } }
                });
                const users = yield user_model_1.default.find({
                    $or: [
                        { _id: data.another_id },
                        { _id: data.my_id }
                    ]
                }).select("_id fullName");
                const newUsers = users.map((item) => ({
                    user_id: item._id.toString(),
                    fullName: item.fullName,
                }));
                const record = new room_model_1.default({
                    type: 'Chat Friend',
                    user: newUsers,
                    status: 'Not'
                });
                yield record.save();
            }
            else {
                yield user_model_1.default.updateOne({ _id: data.my_id }, {
                    $pull: { requestedF: { user_id: data.another_id } }
                });
                yield user_model_1.default.updateOne({ _id: data.another_id }, {
                    $pull: { sendReqF: { user_id: data.my_id } }
                });
            }
            friendNamespace.emit("resultReq-to-client", {
                my_id: data.my_id,
                another_id: data.another_id,
                type: data.type
            });
        }));
        socket.on('delete-friend', (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_model_1.default.updateOne({ _id: data.my_id }, {
                $pull: { friendList: data.another_id }
            });
            yield user_model_1.default.updateOne({ _id: data.another_id }, {
                $pull: { friendList: data.my_id }
            });
            friendNamespace.emit('delete-friend-to-Client', data);
        }));
        socket.on('invite-friend-to-group', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ _id: data.user_id }).select("id fullName");
            const rooms = yield room_model_1.default.findOneAndUpdate({ _id: data.room_id }, { $push: {
                    user: {
                        user_id: user._id,
                        fullName: user.fullName
                    }
                } }, {
                new: true
            });
            friendNamespace.emit('from-server-invite-friend', {
                user: user,
                room: rooms,
                home: (0, home_1.home)()
            });
        }));
    });
});
exports.friendSocket = friendSocket;
const onlineSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    const onlineNamspace = global.__chat.of("/online");
    onlineNamspace.on("connection", socket => {
        socket.on("register", (id) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(id.my_id);
            userOnline[id.my_id] = socket.id;
            yield updataFriendOnline(id.my_id, 'online');
            yield updateForAllFriend(id.my_id, 'online');
        }));
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                for (let i in userOnline) {
                    if (userOnline[i] == socket.id) {
                        delete userOnline[i];
                        yield updateForAllFriend(i, 'offline');
                    }
                }
            }), 10000);
        }));
    });
    function updataFriendOnline(id, type, off) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ _id: id });
            const arr = user.friendList;
            const listOnline = arr.filter(item => userOnline[item]);
            const listUser = yield user_model_1.default.find({ _id: { $in: listOnline } }).select("id fullName");
            if (type == 'online') {
                onlineNamspace.to(id).emit("userOnline", {
                    arr: listUser,
                    type
                });
            }
            else {
                onlineNamspace.to(id).emit("userOnline", {
                    arr: [{ _id: off }],
                    type
                });
            }
        });
    }
    function updateForAllFriend(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ _id: id });
            const arr = user.friendList;
            arr.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                if (userOnline[item]) {
                    if (type == 'online') {
                        yield updataFriendOnline(item, type);
                    }
                    else {
                        yield updataFriendOnline(item, type, id);
                    }
                }
            }));
        });
    }
});
exports.onlineSocket = onlineSocket;
const callSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    const callNamspace = global.__chat.of("/call");
    callNamspace.on('connection', (socket) => {
        socket.on('newUser', (id) => {
            socket.emit("userJoined", id);
        });
    });
});
exports.callSocket = callSocket;
