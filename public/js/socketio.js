const chatshow=document.querySelector(".msgs");
const chatform=document.querySelector(".chatbox");
const chatinput=document.querySelector(".chatinput")
const receiverid=document.querySelector(".receiverid")
let sendmsg=false;
socket.on("user-socket-recorded",()=>{
    sendmsg=true;
})
chatform.addEventListener("submit",function(ev){
    ev.preventDefault();
    if(chatinput.value){
        if(sendmsg){
            socket.emit("chat-message",{
                sender:userid.value,
                receiver:receiverid.value,
                msg:chatinput.value,
            });
            chatinput.value="";
        }
        
    }
})

socket.on("added-message",(msg)=>{
    let msgshow=document.createElement("div");
    msgshow.innerHTML=`<div class="message">
    <div class="msg">${msg.message}</div>
    <div class="timestamp">${msg.timestamp}</div>
</div>`;
    chatshow.appendChild(msgshow);
    
})
// how to disconnect
// socket.emit("disconnect",{
//     userid:userid,
// })