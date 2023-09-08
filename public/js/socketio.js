import socket from "./connecttosocket"
const chatshow=document.querySelector(".msgs");
const chatform=document.querySelector(".chatbox");
const chatinput=document.querySelector(".chatinput")
const receiverid=document.querySelector(".receiverid")
const userid=document.querySelector(".userid");

chatform.addEventListener("click",function(ev){
    ev.preventDefault();
    if(chatinput.value){
        socket.emit("chat-message",{
            sender:userid.value,
            receiver:receiverid.value,
            msg:chatinput.value,
        });
        chatinput.value="";
    }
})