const div = document.querySelector(".updbtn");
if (div != null) {
  div.addEventListener("click", function (ev) {
    ev.preventDefault();
    let replaced = div.parentElement.parentElement.parentElement;
    //   find a more reliable way to accomplish finding replaced element
    let form = document.createElement("form");
    form.classList.add(
      "profilecomp",
      "d-flex",
      "justify-content-between",
      "mb-3",
      "p-3",
      "flex-column"
    );
    form.setAttribute("autocomplete", "off");
    form.action = "/user/dash/updateProfile";
    form.method = "post";
    form.enctype = `multipart/form-data`;
    //   select elements whose value needed
    const username = document.querySelector(".user-inp").innerText;
    form.innerHTML = `<div class=" profileimage d-flex flex-wrap mb-2" style="width:100%">
    
    <input name="imginp" type="file" class="img-inp" accept="image/*" >
    </div>
    <div class="profiledetails justify-content-between d-flex flex-column w-100">
        <div class=" d-flex flex-column">
        <div><span>Username: </span> <input type="text" name="userinp" class="user-inp form-control mb-2 mt-2" value="${username}" /></div>
        <div><span>Password: </span><span>Not visible</span></div>
        </div>
        <div class="align-self-end"><button type="submit" class="btn btn-primary updbtn" type="click">Update</button></div>
    </div>`;

    replaced.replaceWith(form);
  });
}
