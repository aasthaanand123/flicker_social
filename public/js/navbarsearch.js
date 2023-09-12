const formsearch=document.querySelector(".searchform");
let inputsearch=document.querySelector(".searchinput")
const navbar=document.querySelector(".navbar")
inputsearch.addEventListener("focus",(ev)=>{
    if(document.querySelector(".overlay") && document.querySelector(".modalcontainer")){
        document.querySelector(".overlay").remove();
        document.querySelector(".modalcontainer").remove();
    }
})
formsearch.addEventListener("submit",(ev)=>{
    ev.preventDefault();
    axios.post("http://localhost:4321/user/dash/postdata/finddata",{
    inputvalue:inputsearch.value,
    }).then((response)=>{
        addoverlay(navbar.nextElementSibling,response.data)
        inputsearch.value="";
    }).catch((err)=>{
        console.log(err);
    });
  
})
function overlayremove(overlayel,modalel){
    overlayel.addEventListener("click",(ev)=>{
       overlayel.remove();
       modalel.remove();
    })
}

function addoverlay(el,data){
    let overlay=document.createElement("div");
    overlay.classList.add("overlay")
    overlay.style.width="100%";
    overlay.style.position="absolute";
    overlay.style.height="100%"
    overlay.style.top="10vh";
    overlay.style.backgroundColor="rgba(0,0,0,0.5)";
    overlay.style.zIndex="10";
    el.appendChild(overlay)
    let modal=createmodal(data)
    overlayremove(overlay,modal);
}
function createmodal(data){
    let modalcontainer=document.createElement("div");
    
    modalcontainer.classList.add("modalcontainer");
    let elementform=createform(data);
    modalcontainer.appendChild(elementform)
    navbar.nextElementSibling.appendChild(modalcontainer);
    return modalcontainer;
}
function createform(data){
    let newel=document.createElement("div");
    newel.classList.add("divform");
    if(data.length>0){
        data.forEach((el)=>{
            let formel=document.createElement("form");
            formel.action="/user/dash/postdata/getsearchpost";
            formel.method="post";
            formel.innerHTML=`
            <input type="hidden" value="${el._id}" name="postid"/>
            <button class="modalelement" type="submit">
                ${el.caption}
            </button>
            `
            newel.appendChild(formel);
        })
    }
    else{
        newel.innerText=`No Posts available! Sorry`
        newel.classList.add("modalelement");
    }
    return newel;
}
