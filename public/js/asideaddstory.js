const addstory=document.querySelector(".mystory");
addstory.addEventListener("click",(ev)=>{
    ev.preventDefault();
    createmodalaside();
})

function createmodalaside(){
    let newmodalaside=document.createElement("div");
    let formaside=document.createElement("form");
    newmodalaside.classList.add('newmodalaside')
    setAttribute(formaside)
    newmodalaside.appendChild(formaside);
    navbar.nextElementSibling.appendChild(newmodalaside);
    navbar.nextElementSibling.appendChild(asideoverlay());
    clickoverlay()
}

function setAttribute(form){
    console.log(form)
   form.action="/user/dash/addstory";
   form.method="post";
   form.classList.add("formaside");
   form.innerHTML=`
   <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Caption</label>
          <input
            type="text"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="name"
          />
        </div><div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Add Multimedia</label>
          <input
            type="file"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="multimedia"
            accept="image/*,video/*"
          />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
   `

}

function asideoverlay(){
    let asideoverlay=document.createElement("div");
    asideoverlay.classList.add("overlay")
    asideoverlay.style.width="100%";
    asideoverlay.style.position="absolute";
    asideoverlay.style.height="100%"
    asideoverlay.style.top="10vh";
    asideoverlay.style.backgroundColor="rgba(0,0,0,0.5)";
    asideoverlay.style.zIndex="10";
        return asideoverlay;
}
function clickoverlay(){
    document.querySelector(".overlay").addEventListener("click",(ev)=>{
        document.querySelector(".overlay").remove();
        document.querySelector(".newmodalaside").remove();
    })
}