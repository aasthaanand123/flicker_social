const delbtn = document.querySelectorAll(".btn-del");
const updbtn = document.querySelectorAll(".btn-upd");
const postrender = document.querySelector(".post-render");
const mypost = document.querySelectorAll(".mypost");
const body = document.querySelector("body");
mypost.forEach((post) => {
  post.addEventListener("click", function (ev) {
    const target = ev.target;
    const deletebtn = target.closest(".btn-del");
    const updatebtn = target.closest(".btn-upd");
    if (!deletebtn && !updatebtn) {
      const modalTarget = post.getAttribute("data-bs-target");
      const modal = document.getElementById(modalTarget.slice(1));
      $(`#${modal.id}`).modal("show");
    }
  });
});
function createUrl(appendData) {
  return `http://localhost:4321/${appendData}`;
}
delbtn.forEach((btn) => {
  btn.addEventListener("click", function (ev) {
    const postid = ev.currentTarget.getAttribute("data-postid");

    axios
      .post(createUrl("user/dash/postdata/delete"), {
        postid: postid,
      })
      .then((response) => {
        if (response.data.length > 0) {
          let element = document.getElementById(`a${postid}`);
          element.remove();
        } else {
          postrender.innerHTML = `<div style="color:#f0edcc;font-size:1.2rem">No posts available</div>
          <a href="/user/dash/addpost" style="color:#f0edcc;font-size:1.4rem">Add a post here</a>`;
          postrender.classList.add(
            "posts-section",
            "d-flex",
            "align-items-center",
            "flex-column",
            "justify-content-center"
          );
          postrender.style.height = "40vh";
        }
      })
      .catch((err) => {
        console.log(err);
        // instead of logging do something to show error on ui
      });
  });
});
updbtn.forEach((btn) => {
  btn.addEventListener("click", function (ev) {
    const postid = ev.currentTarget.getAttribute("data-postid");
    const parent = btn.closest(`#a${postid}`);
    const caption = parent.getElementsByClassName("caption")[0].innerText;
    const description =
      parent.getElementsByClassName("descriptiondetails")[0].innerText;
    let form = document.createElement("form");
    form.classList.add(
      "btn",
      "d-flex",
      "flex-column",
      "align-items-center",
      "mypost"
      // "mb-4"  not applying?
    );
    form.setAttribute("autocomplete", "off");
    form.action = "/user/dash/postdata/update";
    form.method = "post";
    form.id = `a${postid}`;
    form.enctype = `multipart/form-data`;
    form.innerHTML = `
    
  <div class="caption-wrapper w-100 d-flex justify-content-center p-2 "><input type="text" name="caption"
    value=${caption}></div>
  <div class="d-flex mt-4 justify-content-between w-100 h-100">
    <div class="d-flex justify-content-center innerpost">
      <input type="file" name="img-upd" accept="image/*"/>
    </div>
    <div class="innerpost d-flex flex-column justify-content-between">
      <div class="d-flex flex-column">
        <div class="comments">Description:</div>
        <input type="text" name="description" value=${description}>
      </div>
      <div class="d-flex flex-column align-items-center">
      <input type="hidden" value="${postid}" name="postid">
      <button class="btn btn-upd w-75 mb-2 mt-2">Update</button>
      </div>
    </div>
  </div>
</div>
    `;
    parent.replaceWith(form);
  });
});
