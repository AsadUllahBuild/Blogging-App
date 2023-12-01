
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "./config.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = './login.html';
    }
});

const logout = document.querySelector('#logout');
const mainContent = document.querySelector('#main-content')

logout.addEventListener('click',()=>{
    signOut(auth).then(() => {
        window.location='./login.html'
      }).catch((error) => {
        console.log(error);
      });
})

console.log(mainContent);
// mainContent.innerHTML=`

// `
