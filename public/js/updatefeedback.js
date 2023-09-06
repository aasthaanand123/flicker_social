const likeform = document.querySelector(".likeform");
const dislikeform = document.querySelector(".dislikeform");
const commentform = document.querySelector(".commentform");
const comment = document.querySelector(".comment");
const postId = document.querySelector(".postid");
const likeshow = document.querySelector(".likeshow");
const dislikeshow = document.querySelector(".dislikeshow");
const displayComments = document.querySelector(".displayComments");
function createUrl(appendData) {
  return `http://localhost:4321/${appendData}`;
}
if (likeform != null && dislikeform != null && commentform != null) {
  likeform.addEventListener("submit", function (ev) {
    ev.preventDefault();
    axios
      .post(createUrl("user/dash/postdata/like"), {
        postid: postId.value,
      })
      .then(function (response) {
        likeshow.innerText = response.data.likes;
        dislikeshow.innerText = response.data.dislikes;
      })
      .catch(function (error) {
        console.log(error);
        //   render a page here instead of logging
      });
  });
  dislikeform.addEventListener("submit", function (ev) {
    ev.preventDefault();
    axios
      .post(createUrl("user/dash/postdata/dislike"), {
        postid: postId.value,
      })
      .then(function (response) {
        likeshow.innerText = response.data.likes;
        dislikeshow.innerText = response.data.dislikes;
      })
      .catch(function (error) {
        console.log(error);
        //   render a page here instead of logging
      });
  });
  commentform.addEventListener("submit", (ev) => {
    ev.preventDefault();
    axios
      .post(createUrl("user/dash/postdata/comment"), {
        postid: postId.value,
        comment: comment.value,
      })
      .then((response) => {
        displayComments.innerHTML = "";
        if (
          !displayComments.classList.contains(
            "p-2",
            " mt-3",
            "d-flex",
            "flex-column"
          )
        ) {
          displayComments.classList.add(
            "p-2",
            " mt-3",
            "d-flex",
            "flex-column"
          );
        }

        response.data.comments.forEach((item) => {
          let div = document.createElement("div");
          div.classList.add("commentInd", "p-1", "mb-2");
          div.innerHTML = `<div>${item.comment}</div>
        <div style="font-weight:500;">${item.userid.username}</div>`;
          displayComments.appendChild(div);
        });
        comment.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
