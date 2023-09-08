const socket = io();
const userid=document.querySelector('.userid')
socket.on("connect", () => {
    socket.emit("user-connected", { userid: userid.value });
  })
  export default socket;