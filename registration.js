import { auth } from "./firebase.js";

let email = document.getElementById('email');
let password = document.getElementById('password');
let registerBtn = document.getElementById('registerBtn');
let statusBox = document.getElementById('status').firstElementChild;

registerBtn.addEventListener('click', registerUser);

function registerUser(e) {
    let userEmail = email.value;
    let userPassword = password.value;

    auth.createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            statusBox.innerHTML = `Welcome, ${user.email}`;
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}