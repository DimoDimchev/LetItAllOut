import { auth, baseURI } from "./firebase.js";

let body = document.getElementsByTagName('body')[0];

// Sign-up and Sign-in fields
let formBox = document.getElementById('registration');
let email = document.getElementById('email');
let password = document.getElementById('password');

// Divs that hold content
let statusBox = document.getElementById('status').firstElementChild;
let allPosts = document.getElementById('allPosts');

// The template, which is later applied to every post
let postTemplate = Handlebars.compile(document.getElementById('postTemplate').innerHTML);

// Form for creating posts
let postForm = document.getElementById('postForm');

// Buttons
let loginBtn = document.getElementById('showLogin');
let registerBtn = document.getElementById('registerBtn');
let postButton = document.getElementById('postButton');

registerBtn.addEventListener('click', registerUser);
loginBtn.addEventListener('click', changeForm);
postButton.addEventListener('click', createPost);

// Attatching deletePost() function to "Delete" buttons using event bubbling
body.addEventListener('click', deletePost);

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
            statusBox.style.display = 'none';
            let userData = {
                uid: user.uid,
                email: user.email
            }
            writeUserData(userData);
            showPostForm();
        })
        .then(() => {loadUserPosts();})
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(`${errorCode}:${errorMessage}`);
        });
}

// Function that changes the roles of the input fields and button on the landing page, so that existing users can sign in
function changeForm() {
    statusBox.innerHTML = "Please sign into your account";
    registerBtn.style.display = "none";
    loginBtn.innerHTML = "Sign in";

    let userEmail = email.value;
    let userPassword = password.value;

    loginBtn.addEventListener('click', loginUser);

    // Function that allows existing users to sign-in
    function loginUser() {
        auth.signInWithEmailAndPassword(userEmail, userPassword)
            .then((userCredential) => {
                // Hide registration/Sign-in fields and button and prompt
                formBox.style.display = 'none';
                statusBox.style.display = 'none';
                showPostForm();
                loadUserPosts();
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log(`${errorCode}:${errorMessage}`);
            });
    }
}

function writeUserData(user) {
    // Add new users to the database
    firebase.database().ref('users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}

// Function that loads all of the user's posts
function loadUserPosts() {
    fetch(`${baseURI}users/${auth.currentUser.uid}/posts.json`)
        .then(res => res.json())
        .then(data => {
            // Check if there are any posts in the database for this user
            if (data !== null) {
                // Apply template to each post, add a DELETE button with the unique post key as value
                allPosts.innerHTML = Object.keys(data).map(key => postTemplate(data[key]) + `<button value="${key}">Delete</button>`).join('');
            } else {
                allPosts.innerHTML = "";
            }
        })
}

// Function that allows creation of new posts
function createPost() {
    let currentUser = auth.currentUser;
    if (currentUser) {
        let title = document.getElementById('postTitle').value;
        let content = document.getElementById('postContent').value;

        if (title !== "" && content !== "") {
            // Get the current date
            let today = new Date();
            let date = `Posted on: ${today.getDate()}.${(today.getMonth()+1)}.${today.getFullYear()}`;
            // POST request to the database
            fetch(`${baseURI}users/${currentUser.uid}/posts.json`, {
                method: "POST",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    author: currentUser.email,
                    title: title,
                    content: content,
                    date: date
                })
            }).then(() => {
                    // Clears input fields and makes AJAX call
                    clearFields();
                    loadUserPosts();
                })
        } else {
            console.log('Fields need to be filled.');
        }
     } else {
        console.log('Need to be signed in.');
    }
}

// Function to allow deleting of posts
function deletePost(event) {
    // Checks if an user is signed-in
    let currentUser = auth.currentUser;
    if(event.target.nodeName === "BUTTON" && event.target.value !== "") {
        if (currentUser !== null) {
            // DELETE request to the database with the unique key of the post
            fetch(`${baseURI}users/${currentUser.uid}/posts/${event.target.value}.json`, {
                method: "DELETE",
                headers: {'Content-type': 'application/json'}
            }).then(() => loadUserPosts(currentUser, baseURI));
        }
    }
}

function clearFields() {
    document.getElementById('postTitle').value = "";
    document.getElementById('postContent').value = "";
}

function showPostForm() {
    postForm.style.display = 'block';
}