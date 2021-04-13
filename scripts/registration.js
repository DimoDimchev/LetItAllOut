import { auth, baseURI } from "./firebase.js";

let formBox = document.getElementById('registration');
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
            formBox.style.display = 'none';
            statusBox.innerHTML = `Welcome, ${user.email}`;
            let userData = {
                uid: user.uid,
                email: user.email
            }

            writeUserData(userData);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}

function writeUserData(user) {
    firebase.database().ref('users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}