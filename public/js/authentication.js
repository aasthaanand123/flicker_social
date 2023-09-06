let eyebtn = document.querySelector(".eye-btn");
let password = document.querySelector(".auth-password");
eyebtn.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});
