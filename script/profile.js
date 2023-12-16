import { signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { auth, db } from './config.js';

const logout = document.querySelector('#logout');
const userImg = document.querySelector('#userimg');
const username = document.querySelector('#name');
const profileImage = document.querySelector('#profileImg');


logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location = './index.html';
    }).catch((error) => {
        console.log(error);
    });
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const q = query(collection(db, "users"), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            username.innerHTML = `${doc.data().firstName} ${doc.data().lastName}<i class="fa-solid fa-marker text-sm ml-2"></i>`;
            userImg.src = doc.data().profileUrl;
            profileImage.src = `${doc.data().profileUrl}`;
        });
    } else {
        window.location = 'index.html';
    }
});

const form = document.querySelector("#passwordUpdateForm");
const closeMismatchModal = document.querySelector("#closePasswordMismatchModal");
const modal = document.querySelector('#modal');
const mismatchModal = document.querySelector("#passwordMismatchModal");
const oldPasswordModal = document.querySelector("#oldPasswordModal");
const modalMessage = document.querySelector('#modalMessage');
const closeOldPasswordModal = document.querySelector("#closeOldPasswordModal");

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    const currentPassword = document.querySelector('#password').value;
    const newPasswordValue = document.querySelector('#new-password').value;
    const repeatPasswordValue = document.querySelector('#repeat-password').value;

    modal.showModal();

    if (newPasswordValue !== repeatPasswordValue) {
        console.log("New and repeated passwords do not match");
        mismatchModal.showModal();
        modal.close();
        return;
    }

    try {
        const credentials = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credentials);
        await updatePassword(user, newPasswordValue);

        console.log("Password updated successfully");
        document.querySelector('#password').value = '';
        document.querySelector('#new-password').value = '';
        document.querySelector('#repeat-password').value = '';

        modalMessage.innerHTML = 'Password Updated Successfully';
        const successModal = document.querySelector('#my_modal_1');
        successModal.showModal();
        modal.close();

    } catch (error) {
        console.error(error.message);
        oldPasswordModal.showModal();
        console.log('Incorrect old password');
        modal.close();


    }
});

closeOldPasswordModal.addEventListener('click', () => {
    oldPasswordModal.close();
});


closeMismatchModal.addEventListener('click', () => {
    mismatchModal.close();
});

