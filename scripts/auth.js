import { auth } from "./firebase.js";
import {loadUserPosts} from "./postActions.js";
import {showPostForm, showRegistrationForm, changeForm, openSide} from "./formActions.js";

// Sign-up and Sign-in fields
let formBox = document.getElementById('registration');
let email = document.getElementById('email');
let password = document.getElementById('password');

// Buttons
let loginBtn = document.getElementById('showLogin');
let registerBtn = document.getElementById('registerBtn');
let registrationPromptButton = document.getElementById('registrationPrompt');

// Holds the greeting for the user
let userGreeting = document.getElementById('userGreeting');

registerBtn.addEventListener('click', registerUser);
loginBtn.addEventListener('click', changeForm);
registrationPromptButton.addEventListener('click', showRegistrationForm);

// Registers new users and stores info in the database, loads the user's posts
function registerUser() {
    let userEmail = email.value;
    let userPassword = password.value;

    // Adds the users to the Users panel of the Firebase Console
    auth.createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            formBox.style.display = 'none';
            let userData = {
                uid: user.uid,
                email: user.email
            }
            writeUserData(userData);
            userGreeting.innerHTML = `Welcome, ${userEmail}. Please Let It All Out`;
            openSide.style.display = "block";
            showPostForm();
        })
        .then(() => {loadUserPosts();})
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(`${errorCode}:${errorMessage}`);
        });
}

 // Function that allows existing users to sign-in
 function loginUser(userEmail, userPassword) {
    auth.signInWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            // Hide registration/Sign-in fields and button and prompt
            formBox.style.display = 'none';
            userGreeting.innerHTML = `Welcome, ${userEmail}. Please Let It All Out`;
            openSide.style.display = "block";
            showPostForm();
            loadUserPosts();
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(`${errorCode}:${errorMessage}`);
        });
}

function writeUserData(user) {
    // Add new users to the database
    firebase.database().ref('users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}

export {loginUser, loginBtn}