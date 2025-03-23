import { Response, Request } from "express"
import Chat from "../models/chat.model";
import room from "../models/room.model";
import User from "../models/user.model";
import uploadImg from "../middleware/uploadImg";
import { home } from "../config/home";
const userOnline: Object = {};
export const chatSocket = () => {
    const chatNamspace = global.__chat.of("/chat");
    chatNamspace.on("connection", socket => {
        socket.on("join", room => {
            socket.join(room.room);
        });
        socket.on("send-to-server", async (data) => {
            try {
                var images: string[] = await Promise.all(
                    data.img.map(async ele => await uploadImg(ele))
                );
                const chat = new Chat({
                    sender: data.sender,
                    content: data.msg,
                    myName:data.myName,
                    images: images,
                    room_chat_id: data.room_id
                });
                await chat.save();

                const newUser= await User.findOne({_id:data.sender}).select('id fullName');
                chatNamspace.to(data.room_id).emit("server-send-back", {
                    msg: data.msg,
                    img: images,
                    sender: data.sender,
                    myName:data.myName
                })
            } catch (error) {
                console.log(error);
            }

        });
    })
}
export const friendSocket = async () => {
    const friendNamespace = global.__chat.of("/friend");
    interface checkReq {
        my_id: string,
        anothe_id: string,
        type?: string,

    }
    friendNamespace.on("connection", socket => {
        // Send addFriend request
        socket.on("friend-send", async data => {
            let object = {
                user_id: data.another_id
            }

            await User.updateOne({ _id: data.my_id }, {
                $push: { sendReqF: object }
            }
            );
            await User.updateOne({ _id: data.another_id }, {
                $push: { requestedF: { user_id: data.my_id } }
            });

            const record = await User.findOne({ _id: data.my_id }).select("id fullName ");
            friendNamespace.emit("server-send-friend", {
                sender: record,
                receiver: data.another_id
            })
        });

        // accept or refuse request
        socket.on("resultReq-to-server", async data => {
            if (data.type = "accept") {
                await User.updateOne({ _id: data.my_id }, {
                    $push: { friendList: data.another_id },
                    $pull: { requestedF: { user_id: data.another_id } }
                });
                await User.updateOne({ _id: data.another_id }, {
                    $push: { friendList: data.my_id },
                    $pull: { sendReqF: { user_id: data.my_id } }
                });

                const users = await User.find({
                    $or: [
                        { _id: data.another_id },
                        { _id: data.my_id }
                    ]
                }
                ).select("_id fullName");
                interface newUser {
                    user_id: string;
                    fullName: string;
                }

                const newUsers: newUser[] = users.map((item) => ({
                    user_id: item._id.toString(),
                    fullName: item.fullName,
                }));


                const record = new room({
                    type: 'Chat Friend',
                    user: newUsers,
                    status: 'Not'
                });
                await record.save();
            } else {

                await User.updateOne({ _id: data.my_id }, {

                    $pull: { requestedF: { user_id: data.another_id } }
                });
                await User.updateOne({ _id: data.another_id }, {

                    $pull: { sendReqF: { user_id: data.my_id } }
                });
            }
            friendNamespace.emit("resultReq-to-client", {
                /*
                    notification
                */
                my_id: data.my_id,
                another_id: data.another_id,
                type: data.type
            }
            )
        });
        // Delete Friend
        socket.on('delete-friend', async data => {
            await User.updateOne({ _id: data.my_id }, {
                $pull: { friendList: data.another_id }
            });
            await User.updateOne({ _id: data.another_id }, {
                $pull: { friendList: data.my_id }
            });
            // await room.updateOne({user:{$all:[data.another_id,data.my_id]}});
            friendNamespace.emit('delete-friend-to-Client',
                data
            )
        })
        // Invite friend to group
        socket.on('invite-friend-to-group', async data => {

            const user = await User.findOne({ _id: data.user_id }).select("id fullName");
            const rooms = await room.findOneAndUpdate(
                { _id: data.room_id }, 
                {$push: {
                    user:
                    {
                        user_id: user._id,
                        fullName: user.fullName
                    }
                }}, 
                {
                new: true
                });
            friendNamespace.emit('from-server-invite-friend', {
                user: user,
                room: rooms,
                home: home()
            })
            
        })
    })
}
// Socket thực chất là chỉ khi tại trang của mình có emit từ server or client thì mới gọi đến on, ko thì sữ ko tự tiện nhận emit từ nơi kahcs
export const onlineSocket = async () => {
    const onlineNamspace = global.__chat.of("/online");
    onlineNamspace.on("connection", socket => {
        socket.on("register", async (id) => {
            socket.join(id.my_id);
            userOnline[id.my_id] = socket.id;
            await updataFriendOnline(id.my_id, 'online');
            await updateForAllFriend(id.my_id, 'online');
        });
        socket.on("disconnect", async () => {
            setTimeout(async () => {
                for (let i in userOnline) {
                    if (userOnline[i] == socket.id) {
                        delete userOnline[i];
                        await updateForAllFriend(i, 'offline');
                    }
                }
            }, 10000);

        })
    });
    async function updataFriendOnline(id: string, type: string, off?: string) {
        const user = await User.findOne({ _id: id });
        const arr = user.friendList;
        const listOnline = arr.filter(item => userOnline[item]);
        const listUser = await User.find({ _id: { $in: listOnline } }).select("id fullName");
        if (type == 'online') {
            onlineNamspace.to(id).emit("userOnline", {
                arr: listUser,
                type
            })
        }
        else {
            onlineNamspace.to(id).emit("userOnline", {
                arr: [{ _id: off }],
                type
            })
        }
    }
    async function updateForAllFriend(id: string, type: string) {
        const user = await User.findOne({ _id: id });
        const arr = user.friendList;
        arr.forEach(async item => {
            if (userOnline[item]) {
                if (type == 'online') {
                    await updataFriendOnline(item, type)
                }
                else {
                    await updataFriendOnline(item, type, id);
                }
            }
        })
    }
}
export const callSocket = async () => {
    const callNamspace = global.__chat.of("/call");
    callNamspace.on('connection', (socket) => {
        socket.on('newUser', (id) => {

            socket.emit("userJoined", id);
        });
    });

}
