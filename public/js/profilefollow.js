const followbtn = document.querySelector(".followbtn");
const followingbtn = document.querySelector(".followingbtn");
const requestedbtn = document.querySelector(".requestedbtn");
function createUrl(appendData) {
  return `http://localhost:4321/${appendData}`;
}
followbtn.addEventListener("click", function (ev) {
  let userid = followbtn.getAttribute("data-userid");
  axios
    .post(createUrl("user/dash/follow"), {
      userid: userid,
    })
    .then((response) => {
      if (response.data == true) {
        followbtn.classList.add("hide");
        requestedbtn.classList.remove("hide");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

followingbtn.addEventListener("click", (ev) => {
  let userid = followingbtn.getAttribute("data-userid");
  axios
    .post(createUrl("user/dash/unfollow"), {
      userid: userid,
    })
    .then((response) => {
      if (response.data == true) {
        followbtn.classList.remove("hide");
        followingbtn.classList.add("hide");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
