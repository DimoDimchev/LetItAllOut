import { auth, email, password, registerBtn } from "./firebase.js";

registerBtn.addEventListener('click', registerUser);

function registerUser(e) {
    let userEmail = email.value;
    let userPassword = password.value;

    auth.createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}