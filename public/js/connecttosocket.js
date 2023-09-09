const socket = io();
const userid=document.querySelector('.userid')
socket.on("connect", () => {
  socket.emit("user-connected",userid.value);
  })