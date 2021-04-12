// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXo3ZI0V_2EsWdVs9oKbqmKG5qKtLb17M",
    authDomain: "blog-a13c9.firebaseapp.com",
    projectId: "blog-a13c9",
    databaseURL: "https://blog-a13c9-default-rtdb.firebaseio.com/",
    storageBucket: "blog-a13c9.appspot.com",
    messagingSenderId: "805228937519",
    appId: "1:805228937519:web:7caab3b7d28aa82830a1da"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();
let baseURI = "https://blog-a13c9-default-rtdb.firebaseio.com/";

export {auth, baseURI}