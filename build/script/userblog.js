import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { db } from './config.js';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('uid');

const renderUserBlogs = async () => {
    const userQuery = query(collection(db, 'users'), where('uid', '==', userId));
    const userSnapshot = await getDocs(userQuery);
    const user = userSnapshot.docs.map(doc => doc.data())[0];

    if (user) {
        const userBlogsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
        const userBlogsSnapshot = await getDocs(userBlogsQuery);
        const userBlogs = userBlogsSnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));

        const userBlogsContainer = document.querySelector('#UserBlogsContainer');
        userBlogs.forEach(item => {
            const postTime = new Date(item.postDate.seconds * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            let postImg = '';
    
            if (user) {
                postImg = user.profileUrl || '';
            }

            const blogHTML = `
            <div class="bg-white p-8 rounded-lg mb-5 shadow-2xl max-w-xl ml-40 w-full">
                <div class="flex gap-5">
                    <div class="mb-4 text-center">
                        <img src="${postImg}" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
                    </div>
                    <div class="w-1/2">
                        <h2 class="text-xl font-bold text-[#212529]">${item.title}</h2>
                        <h5 class="text-sm mt-1 text-[#6C757D]">${user.firstName} ${user.lastName} ${postTime}</h5>
                    </div>
                </div>
                <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">${item.description}</p>
            </div>`;
            userBlogsContainer.innerHTML += blogHTML;
        });
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await renderUserBlogs();
});
