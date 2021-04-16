import { auth, baseURI } from "./firebase.js";
import {content, closeNav} from "./formActions.js";

// The template, which is later applied to every post
let postTemplate = Handlebars.compile(document.getElementById('postTemplate').innerHTML);

let body = document.getElementsByTagName('body')[0];
let postButton = document.getElementById('postButton');

postButton.addEventListener('click', createPost);
// Attatching deletePost() function to "Delete" buttons using event bubbling
body.addEventListener('click', deletePost);

// Function that loads all of the user's posts
function loadUserPosts() {
    // Make AJAX call to the database, retrieving the current user's posts
    fetch(`${baseURI}users/${auth.currentUser.uid}/posts.json`)
        .then(res => res.json())
        .then(data => {
            // Check if there are any posts in the database for this user
            if (data !== null) {
                // Apply template to each post, add a DELETE button with the unique post key as value
                let allPosts = Object.keys(data).map(key => postTemplate(data[key]) + `<button value="${key}">Delete</button>`).join('');

                content.innerHTML = allPosts;
            } else {
                content.innerHTML = "You have no posts to show";
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
            if (title.length < 10) {
                alert('Title must be at least 10 characters long');
            } else if (content.length < 50) {
                alert('Content must be at least 50 characters long')
            } else {
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
                    closeNav();
                    loadUserPosts();
                })
            }
        } else {
            alert('Fields need to be filled.');
        }
     } else {
        alert('Need to be signed in.');
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



export {loadUserPosts, deletePost, createPost}