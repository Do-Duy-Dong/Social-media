const formFriend= document.querySelector("[form-add-friend]");
formFriend.addEventListener("submit",(e)=>{
    e.preventDefault();
    const input=formChat.querySelector(".add-friend");
    const value= input.value;
    console.log(value);
})