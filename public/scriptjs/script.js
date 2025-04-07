
function searchFunc() {
    const url= new URL(window.location.href);
    const input=document.querySelector(".add-friend");
    const value= input.value;
    url.searchParams.set("keyword",value);
    window.location.href= url.href;
}
function showCreateGr(){
    const modal= document.querySelector('.modal-main');
    modal.hidden=false;
    
}
function showMember(){
    const info_panel= document.querySelector("[inf-mem-group]");
    const chat= info_panel.closest(".box-content").querySelector('.chat-area');
    if(info_panel.hidden){
        chat.classList.add('col-8');
        info_panel.hidden=false
    }   else{
        chat.classList.remove('col-8')
        info_panel.hidden=true;
    }

}
function showInviteGr(){
    const modal= document.querySelector('.modal-main');
    modal.hidden=false;
}
function closeInviteGr(){
    const modal= document.querySelector('.modal-main');
    modal.hidden=true;
}
function openEditPro(){
    const modal= document.querySelector('.modal-main');
    modal.hidden=false;
}
function showDropdown(){
    const drop= document.querySelector('.dropdown-box');
    if(drop.hidden) drop.hidden=false;
    else    drop.hidden=true;
    
}
function removeUnread(room,url,id){
    const div = document.querySelector(`[roomIdHeader="${room}"]`);
    const status= div.querySelector('.circle-unread');
    if(status){  
    console.log(status)
    status.remove();
    
    axios.post(`${url}/updateUnread`,{
        sender:id,
        room:room
    })}
}
function outGroup(roomId,home){
    Swal.fire({
        title: "Bạn có chắc muốn thoát nhóm",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Không",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có"
    }).then(async result=>{
        if(result.isConfirmed){
            const my_id = document.querySelector("[user_id]").getAttribute('user_id');
            const record=axios.post(`${home}/chat/outGroup`,{
                user_id:my_id,
                room_id:roomId
            }).then(data=>{
                window.location.href=data.data.url;
            })
            
        }
    })
}
const formRegister= document.querySelector("[form-register-client]");
    if(formRegister){
        formRegister.addEventListener("submit",async (e)=>{
            e.preventDefault();
            const formData= new FormData(e.target);
            var fullName= formData.get('fullName');
            var email= formData.get('email');
            var password= formData.get('password');
            var confirmPass= formData.get('confirmPass');
            try{
                const result= await axios.post(formRegister.action,{
                    email,
                    password,
                    fullName,
                    confirmPass
                })
                window.location.href= result.data.redirect;
            }
            catch(err){
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    confirmButtonText: "Thử lại"
                });
            }
  
        })}
const formLogins= document.querySelector("[form-login-client]");
if(formLogins){
    formLogins.addEventListener("submit",async (e)=>{
        e.preventDefault();
        console.log('asdasd');
        const email=document.getElementById("email-client").value;
        const password=document.getElementById("password-client").value;
        try{
            const result= await axios.post(formLogins.action,{
                email,
                password
            })
            window.location.href= result.data.redirect;
        }
        catch(err){
            Swal.fire({
                icon: "error",
                title: "Tài khoản hoặc mật khẩu không đúng",
                confirmButtonText: "Thử lại"
            });
        }

    })}

const chatContainer = document.querySelector('.chat-content');
if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}