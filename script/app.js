import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { auth, db, storage } from './config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';

const form = document.querySelector('#signup-form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const repeatPassword = document.querySelector('#repeat-password');
const uploadPhoto = document.querySelector('#upload-photo');
const modal = document.querySelector('#modal');
const mismatchModal = document.querySelector("#passwordMismatchModal");
const closeMismatchModal = document.querySelector("#closePasswordMismatchModal");
const alreadyRegisteredModal = document.querySelector("#alreadyRegisteredModal");


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    modal.showModal();

    if (password.value !== repeatPassword.value) {
        console.log('Passwords do not match');
        mismatchModal.showModal();
        modal.close();
        return;
    }

     // Check if the user already exists with the provided email
     try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        // If signInWithEmailAndPassword is successful, the user already exists
        console.log('User already registered');
        // Show modal or perform any action to indicate the user is already registered
        alreadyRegisteredModal.showModal(); // For example, display a modal
        modal.close();
        return;
    } catch (signInError) {
        // If signInWithEmailAndPassword fails, it means the user doesn't exist or there's an issue with sign-in
        // Proceed with user creation
    }

    const files = uploadPhoto.files[0];
    const storageRef = ref(storage, firstName.value);

    try {
        const snapshot = await uploadBytes(storageRef, files);
        const url = await getDownloadURL(snapshot.ref);
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        await addDoc(collection(db, "users"), {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            uid: user.uid,
            profileUrl: url
        });
        window.location.href = 'login.html';
    } catch (error) {
        const errorMessage = error.message;
        console.error(errorMessage);
        modalMessage.innerHTML = errorMessage;
    }
});
