import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, doc, getDocs, Timestamp, query, orderBy, deleteDoc, updateDoc, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const mainContent = document.querySelector('#main-content')
const form = document.querySelector('#dashboardForm');
const title = document.querySelector('#title')
const description = document.querySelector('#description');
const logout = document.querySelector('#logout');
const profileImage = document.querySelector('#profileImage');
const username = document.querySelector('#username');
const blogImg = document.querySelector("#blog-img");
const modal = document.querySelector('#modal');
const modalMessage = document.querySelector('#modal-message');

logout.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location = './index.html'
  }).catch((error) => {
    console.log(error);
  });
})

let img;
let idNames;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const q = query(collection(db, "users"), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      username.innerHTML = `${doc.data().firstName} ${doc.data().lastName}`
      profileImage.src = doc.data().profileUrl
      img = doc.data().profileUrl
      idNames = `${doc.data().firstName} ${doc.data().lastName}`

    });
    getdatafromfirestore(uid);
  } else {
    window.location = 'index.html';
  }
});


let arr = [];
function renderPost() {
  mainContent.innerHTML = ''
  arr.map((item) => {
    const time = item.postDate.seconds
    const myDate = new Date(time * 1000)
    const stringdate = myDate.toLocaleString()
    const parts = stringdate.split('/')
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    // Create a Date object
    const mydate = new Date(year, month - 1, day);
    // Format the date as "Dec 2nd, 2023"
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = myDate.toLocaleDateString('en-US', options);
    // console.log(formattedDate);
    // console.log(mydate)
    mainContent.innerHTML += `
    <div class="bg-white p-8 rounded-lg mb-5  shadow-2xl max-w-xl ml-40 w-full " >
       <div class="flex gap-5">
       <div class="mb-4 text-center">
           <img src="${img}" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
       </div >
<div class="w-1/2">
<h2 class="text-xl font-bold text-[#212529] whitespace-normal break-words">${item.title}
</h2>
<h5 class="text-sm mt-1 text-[#6C757D]">${idNames} ${formattedDate}</h5>
</div>
  </div > 

   <P class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">
   ${item.description}
   </P>

   

   <div class="flex mt-3 text-sm">
       <a href="#" class=" bg-transparent border-none text-[#7749F8]  mr-20" id="delete">Delete</a>
       <a href="#" class=" bg-transparent border-none text-[#7749F8]  mr-20" id="update">Edit</a>
   </div>
   
   </div>
  `
  })
  const del = document.querySelectorAll('#delete');
  const upd = document.querySelectorAll('#update');

  //delete function

  del.forEach((btn, index) => {
    btn.addEventListener('click', async (event) => {
      const docIdToDelete = arr[index].docId;
      await deleteDoc(doc(db, "posts", docIdToDelete))
        .then(() => {
          console.log('post deleted');
          arr = arr.filter((item) => item.docId !== docIdToDelete);
          renderPost();
        })
        .catch((error) => {
          console.error('Error deleting document: ', error);
        });
    });
  });

  //Edit function


  function updatePost(index, updateTitle, updateDescription) {
    arr[index].title = updateTitle;
    arr[index].description = updateDescription;
    renderPost();
  }

  upd.forEach((btn, index) => {
    btn.addEventListener('click', async () => {
      const updatedTitle = prompt('Enter Your Title', arr[index].title);
      const updatedDescription = prompt('Enter Your Description', arr[index].description);

      if (updatedTitle !== null && updatedTitle !== '') {
        const docIdToUpdate = arr[index].docId;
        try {
          await updateDoc(doc(db, "posts", docIdToUpdate), {
            title: updatedTitle,
            description: updatedDescription,
            time: Timestamp.fromDate(new Date())
          });
          updatePost(index, updatedTitle, updatedDescription);
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    });
  });






}

renderPost()

let docId;


async function getdatafromfirestore(uid) {
  const q = query(collection(db, "posts"), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);

  arr = [];

  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), docId: doc.id });
  });

  renderPost();
}




//todo add data

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const postTitle = title.value.trim();
  const postDescription = description.value.trim();
  modal.showModal();
  modalMessage.innerHTML = 'Blog Published';
  const successModal = document.querySelector('#my_modal_1');
  successModal.showModal();

  if (postTitle === '' || postDescription === '') {
    alert('Please fill in both title and description.');
  } else {
    try {
      const user = auth.currentUser;
      const postObj = {
        title: postTitle,
        description: postDescription,
        uid: user.uid,
        postDate: Timestamp.fromDate(new Date())
      };
      const docRef = await addDoc(collection(db, "posts"), postObj);
      console.log("Document written with ID: ", docRef.id);
      postObj.docId = docRef.id;
      arr = [postObj, ...arr];
      console.log(arr);
      title.value = '';
      description.value = '';

      renderPost();
      modal.close();
    } catch (error) {
      console.error("Error adding document: ", error);
      modal.close();
    }
  }
});



