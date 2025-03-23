
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';

let custom = document.querySelector('.custom-file-container');
if (custom) {
    window.upload = new FileUploadWithPreview('upload-img', {
        multiple: true,
        maxFileCount: 3
    });

}

const socket = io();
const chatSocket = io("/chat");
const friendSocket = io("/friend");
const onlineSocket = io("/online");
const formChat = document.querySelector("[form-chat]");
const my_id = document.querySelector("[user_id]").getAttribute('user_id');
var room_div = document.querySelector("[room-id]");

if (formChat) {
    var room_id = room_div.getAttribute("room-id");
    chatSocket.emit("join", {
        room: room_id
    })
    formChat.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("input-chat");
        const value = input.value;
        const imgs = window.upload.cachedFileArray;
        console.log(imgs);
        input.value = "";
        try {
            const myNameDiv= document.querySelector('[myName]');
            var myName='';
            if(myNameDiv){
                myName=myNameDiv.getAttribute('myName');
            }
            chatSocket.emit("send-to-server", {
                msg: value,
                img: imgs,
                sender: my_id,
                myName:myName,
                room_id: room_id
            });

        } catch (error) {
            console.log(error);
        }

    });
}

chatSocket.on("server-send-back", data => {
    var htmlImg = '';
    const div = document.createElement("div");
    const div2 = document.createElement('div');
    const messageChat = document.querySelector(".chat-content");
    div.classList.add("message");
    div2.classList.add('message');
    div.classList.add(`${data.sender == my_id ? 'right' : 'left'}`);
    div2.classList.add(`${data.sender == my_id ? 'right' : 'left'}`);
    if (data.msg) {
        if(data.sender==my_id){
            div.innerHTML = `
            <div class="bubble">
            ${data.msg}

        </div>
        `;
        }else{
            div.innerHTML =`
            <div class="item-content">
                    <div class="myName"> ${data.myName}</div>
                    <div class="bubble">
                         ${data.msg} 
                    </div>
            </div>`
        }
        
        messageChat.appendChild(div);
    }
    if (data.img.length > 0) {
        data.img.forEach(item => {
            htmlImg += `
            <div class="item-content">
                <div class="myName"><%= item.myName%></div>
                <div style='max-width: 200px;   
                            object-fit: contain;
                            padding: 5px;
                            '>
                <img src="<%= img%>" alt="" style='width:100%;height:100%'>
            </div>
            </div>
        `
        ;

        })
        div2.innerHTML = htmlImg;
        messageChat.appendChild(div2);
        window.upload.resetPreviewPanel();
    }
})


// add friend Socket(socket.on luôn hoạt động ở mọi route)-> tối ưu đưa socket vào controller addFr sau
window.addFr = function () {
    const another_div = document.querySelector("[user-friend]");
    const another_id = another_div.getAttribute("user-friend");
    // friendSocket.emit("join",another_id);
    friendSocket.emit("friend-send", {
        my_id: my_id,
        another_id: another_id
    });
const button= document.querySelector('[button-add-fr]');
button.classList.add('inactive');
}
friendSocket.on("server-send-friend", data => {
    if (data.sender._id == my_id) {
        // alert
        console.log("ben if")

    } else if (data.receiver == my_id) {
        console.log("ben else")
        /*
        socket notification
        */

        // Show div in waiting
        const chat = document.querySelector(".friend-pending");
        if (chat) {
            const div = document.createElement("div");
            div.classList.add("friend-item");
            div.innerHTML = `
            <div class="row">
                    <i class="fa fa-user col-1" aria-hidden="true"></i>
                    <div class="friend-name col-9">
                        <div class="" style="font-size: 1.1rem;color: white;;">${data.sender.fullName}</div>
                        <div class="" style="font-size: 0.9rem;">Offline</div>
                    </div>
                    <div class="col-2" style="
                    display: flex;
                    justify-content: space-evenly;
                    text-align: center;
                    align-items: center;
                    
                    ">
                        <a class="circle-back">
                            <i class="fa fa-check" aria-hidden="true"></i>

                        </a>
                        <a class="circle-back">
                            <i class="fa fa-ellipsis-v " aria-hidden="true"></i>
                        </a>

                    </div>
                </div>
        `
            chat.appendChild(div);
        }


    }
})
window.acceptFr = function () {
    const another_id = document.querySelector("[user-send-request]").getAttribute("user-send-request");
    friendSocket.emit("resultReq-to-server", {
        type: "accept",
        another_id: another_id,
        my_id: my_id
    });
}
window.refuseFr = function () {
    const another_id = document.querySelector("[user-send-request]").getAttribute("user-send-request");
    friendSocket.emit("resultReq-to-server", {
        type: "refuse",
        another_id: another_id,
        my_id: my_id
    });
}
window.deleteFriend = function () {
    const another_id = document.querySelector("[user-friend-all]").getAttribute("user-friend-all");
    Swal.fire({
        title: "Huỷ kết bạn",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Không",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có"
    }).then((result) => {
        if (result.isConfirmed) {
            friendSocket.emit("delete-friend", {
                another_id: another_id,
                my_id: my_id
            });
            Swal.fire({
                title: "Đã xoá",
                text: "Bạn đã huỷ kết bạn",
                icon: "success"
            });
        }
    });


}
window.chatFr = async function (id, home) {
    const result = await axios.post(`${home}/chat/getRoomChat`, {
        my_id: my_id,
        another_id: id
    })
        .then(data => {
            window.location.href = `${home}/chat/roomChat/${data.data.room_id}`;
        })
        .catch(err => {
            console.log(err);
        })
}
window.invitedFriend = function (id, room_id) {
    friendSocket.emit('invite-friend-to-group', {
        user_id: id,
        room_id: room_id
    }
    );
    var inviteButton= document.querySelector(".invite-button");
    inviteButton.classList.remove('active');
    inviteButton.classList.add('inactive');

}

friendSocket.on('from-server-invite-friend', data => {
    const sidebar = document.querySelector("[sidebar-group]");
    if (my_id == data.user._id && sidebar) {
        const chatList = document.querySelector(".chat-list");
        const div = document.createElement("div");
        div.innerHTML = `
            <a class="friend-item sidebar-item" href=" ${data.home}/chat/groupChat/${data.room._id}">
                    
                    <div class="item" >
                        <div >
                            <img src="${data.room.avatar}" alt="" class="img-group">

                        </div>
                        <span>${data.room.roomName}</span>
                    </div>
                </a>
        `
        chatList.appendChild(div);
    }
        
})

friendSocket.on('delete-friend-to-Client', data => {
    const another_div = document.querySelector(`[user-friend-all='${data.another_id}']`);
    if (another_div) {
        another_div.remove();
    }
})
friendSocket.on("resultReq-to-client", data => {
    const another_div = document.querySelector(`[user-send-request='${data.another_id}']`);
    if (another_div) {
        another_div.remove();
    }
})

//invite friend to group


// Show online Friend

onlineSocket.emit("register", {
    my_id: my_id
});

onlineSocket.on("userOnline", data => {
    console.log(data);
    data.arr.forEach(onlineFr => {
        const div = document.querySelector(`[user-friend-all='${onlineFr._id}']`);
        if (div) {
            const status = div.querySelector(".statusFr");
            const statusCir= div.querySelectorAll(".status-indicator2");
            if(statusCir.length>0){
                statusCir.forEach(item=>{
                    if(data.type=='online') item.classList.add('green-back');
                    else item.classList.remove('green-back');
                    
                });
            }
            status.innerHTML = `${data.type == 'online' ? 'Online' : 'Offline'}`;
        }

        // route Online Friend list
        const div2 = document.querySelector("[online-list]");
        if (div2) {
            const divExist = div2.querySelector(`[user_id="${onlineFr._id}"]`);
            if (!divExist) {
                const body = document.createElement("div");
                body.classList.add("friend-item");
                body.innerHTML = `
                    <div class="row" user_id="${onlineFr._id}">
                            <i class="fa fa-user col-1" aria-hidden="true"></i>
                            <div class="friend-name col-9">
                                <div class="" style="font-size: 1.1rem;color: white;;">${onlineFr.fullName}</div>
                                <div class="" style="font-size: 0.9rem;">Online</div>
                            </div>
                            <div class="col-2" style="
                            display: flex;
                            justify-content: space-evenly;
                            text-align: center;
                            align-items: center;
                            
                            ">
                                <a class="circle-back" role="button" onclick="chatFr('<%= item._id%>,'<%= home%>'')">
                                    <i class="fa fa-comment" aria-hidden="true" ></i>

                                </a>
                                <a class="circle-back">
                                    <i class="fa fa-ellipsis-v " aria-hidden="true"></i>
                                </a>

                            </div>
                        </div>
                `
                div2.appendChild(body);
            }
            if (data.type == 'offline') {
                divExist.remove();
            }


        }
    });
})
