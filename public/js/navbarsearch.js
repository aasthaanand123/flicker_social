const formsearch=document.querySelector(".searchform");
let inputsearch=document.querySelector(".searchinput")
const navbar=document.querySelector(".navbar")
formsearch.addEventListener("submit",(ev)=>{
    ev.preventDefault();
    axios.post("http://localhost:4321/user/dash/postdata/finddata",{
    inputvalue:inputsearch.value,
    }).then((response)=>{
        // addoverlay(navbar.nextElementSibling)
        // addmodal(navbar.nextElementSibling,response.data)
        console.log(response.data)
        inputsearch.value="";
    }).catch((err)=>{
        console.log(err);
    });
  
})
function overlayremove(el){
    el.addEventListener("click",(ev)=>{
        el.remove();
    })
}
function addoverlay(el){
    let overlay=document.createElement("div");
    overlay.style.width="100%";
    overlay.style.position="absolute";
    overlay.style.height="100%"
    overlay.style.top="10vh";
    overlay.style.backgroundColor="rgba(0,0,0,0.5)";
    overlay.style.zIndex="10";
    el.appendChild(overlay)
    overlayremove(overlay);
}
function createmodal(){

}
function addmodal(){

}