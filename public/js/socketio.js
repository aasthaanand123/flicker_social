const chatshow = document.querySelector(".msgs");
const chatform = document.querySelector(".chatbox");
const chatinput = document.querySelector(".chatinput");
const receiverid = document.querySelector(".receiverid");
let sendmsg = false;
socket.on("user-socket-recorded", () => {
  sendmsg = true;
});
chatform.addEventListener("submit", function (ev) {
  ev.preventDefault();
  if (chatinput.value) {
    if (sendmsg) {
      socket.emit("chat-message", {
        sender: userid.value,
        receiver: receiverid.value,
        msg: chatinput.value,
      });
      chatinput.value = "";
    }
  }
});

socket.on("added-message", (msg) => {
  let msgshow = document.createElement("div");
  msgshow.innerHTML = `<div class="message">
    <div class="msg" style="font-weight:600;">${msg.message}</div>
     
</div>`;
  // <div class="timestamp">${msg.timestamp}</div>
  chatshow.appendChild(msgshow);
});
window.addEventListener("beforeunload", () => {
  socket.emit("disconnect");
});
