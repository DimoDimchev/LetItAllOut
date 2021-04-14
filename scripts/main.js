import { auth, baseURI } from "./firebase.js";

let body = document.getElementsByTagName('body')[0];

let formBox = document.getElementById('registration');
let email = document.getElementById('email');
let password = document.getElementById('password');

let statusBox = document.getElementById('status').firstElementChild;
// let postForm = document.getElementById('postForm');
let allPosts = document.getElementById('allPosts');
let postTemplate = Handlebars.compile(document.getElementById('postTemplate').innerHTML);

let loginBtn = document.getElementById('showLogin');
let registerBtn = document.getElementById('registerBtn');
let postButton = document.getElementById('postButton');

registerBtn.addEventListener('click', registerUser);
loginBtn.addEventListener('click', changeForm);
postButton.addEventListener('click', createPost);
body.addEventListener('click', deletePost);

function registerUser() {
    let userEmail = email.value;
    let userPassword = password.value;

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
            // showPostForm();
            loadPosts(user, baseURI);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
        });
}

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
                let user = userCredential.user;
                // showPostForm();
                formBox.style.display = "none";
                statusBox.style.display = 'none';
                loadPosts(user, baseURI);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
            });
    }
}

function writeUserData(user) {
    firebase.database().ref('users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}

// function showPostForm() {
//
// }

function loadPosts(user, base) {
    fetch(`${base}users/${user.uid}/posts.json`)
        .then(res => res.json())
        .then(data => {
            if (data !== null) {
                allPosts.innerHTML = Object.keys(data).map(key => postTemplate(data[key]) + `<button value="${key}">Delete</button>`).join('');
            } else {
                allPosts.innerHTML = "";
            }
        })
}

function createPost() {
    let currentUser = auth.currentUser;
    if (currentUser) {
        let title = document.getElementById('postTitle').value;
        let content = document.getElementById('postContent').value;

        if (title !== "" && content !== "") {
            fetch(`${baseURI}users/${currentUser.uid}/posts.json`, {
                method: "POST",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    author: currentUser.email,
                    title: title,
                    content: content
                })
            }).then(r => loadPosts(currentUser, baseURI))
        } else {
            console.log('Fields need to be filled.');
        }
     } else {
        console.log('Need to be signed in.');
    }
}

function deletePost(event) {
    if(event.target.nodeName === "BUTTON" && event.target.value !== "") {
        let currentUser = auth.currentUser;
        if (currentUser) {
            fetch(`${baseURI}users/${currentUser.uid}/posts/${event.target.value}.json`, {
                method: "DELETE",
                headers: {'Content-type': 'application/json'}
            });
            loadPosts(currentUser, baseURI);
        }
    }
}