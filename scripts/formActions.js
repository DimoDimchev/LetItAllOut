import {loginUser, loginBtn} from "./auth.js"

// Divs that hold content
let content = document.getElementById('content');

// Form for creating posts
let postForm = document.getElementById('postForm');

let openSide = document.getElementsByClassName('openbtn')[0];
let closeSide = document.getElementsByClassName('closebtn')[0];

openSide.addEventListener('click', openNav);
closeSide.addEventListener('click', closeNav);

function showPostForm() {
    postForm.style.display = 'block';
}

function showRegistrationForm() {
    content.firstElementChild.style.display = "none";
    content.style.marginTop = "100px";
    content.lastElementChild.firstElementChild.style.display = "block";
}

// Function that changes the roles of the input fields and button on the landing page, so that existing users can sign in
function changeForm() {
    registerBtn.style.display = "none";
    loginBtn.innerHTML = "Sign in";

    let userEmail = email.value;
    let userPassword = password.value;

    loginBtn.addEventListener('click', loginUser(userEmail, userPassword));
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

export {showPostForm, showRegistrationForm, changeForm, openSide, content}