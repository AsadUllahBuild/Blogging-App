import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "./config.js";

const modalMessage = document.querySelector('#modal-message');
const form = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const modal = document.querySelector('#modal');



form.addEventListener('submit', (event) => {
    event.preventDefault();
    modal.showModal();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            modalMessage.innerHTML = 'Password not correct';
            my_modal_1.showModal();
        });
});
