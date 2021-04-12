import { auth } from "./firebase.js";

let loginBtn = document.getElementById('showLogin');
let email = document.getElementById('email');
let password = document.getElementById('password');
let registerBtn = document.getElementById('registerBtn');
let statusBox = document.getElementById('status').firstElementChild;

loginBtn.addEventListener('click', changeForm);

function changeForm() {
    statusBox.innerHTML = "Please sign into your account";
    registerBtn.style.display = "none";
    loginBtn.innerHTML = "Sign in";

    let userEmail = email.value;
    let userPassword = password.value;

    loginBtn.addEventListener('click', loginUser);

    function loginUser() {
        auth.signInWithEmailAndPassword(userEmail, userPassword)
            .then((userCredential) => {
                // Signed in
                let user = userCredential.user;
                statusBox.innerHTML = `Welcome, ${user.email}`;
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
            });
    }
}