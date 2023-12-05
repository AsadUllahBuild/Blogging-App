import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { collection, addDoc, Timestamp, getDocs, where, query, orderBy, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { auth, db } from './config.js';

// Fetch user-specific blogs from the database
const fetchUserBlogs = async (userId) => {
    try {
        const userBlogs = [];
        const querySnapshot = await getDocs(collection(db, 'blogs').where('userId', '==', userId));

        querySnapshot.forEach((doc) => {
            const blog = {
                title: doc.data().title,
                description: doc.data().description,
                formattedDate: doc.data().formattedDate,
                img: doc.data().img
            };
            userBlogs.push(blog);
        });

        return userBlogs;
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        throw error;
    }
};



// Function to display user-specific blogs
const displayUserBlogs = async (userId) => {
    try {
        // Fetch blogs associated with the given userId from your database
        const userBlogs = await fetchUserBlogs(userId);

        // Access your DOM elements
        const blogsContainer = document.querySelector('.user-blogs-container');

        // Clear the previous content in case of multiple clicks
        blogsContainer.innerHTML = '';

        // Loop through the userBlogs array and display each blog
        userBlogs.forEach((blog) => {
            const { title, description } = blog; // Assuming these properties exist in your blog object

            const blogElement = document.createElement('div');
            blogElement.classList.add('blog-item'); // Add your CSS class here

            blogElement.innerHTML = `
                <div class="flex gap-5">
                    <div class="mb-4 text-center">
                        <!-- Assuming you have an image for the blog -->
                        <img src="blog-image-url" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
                    </div>
                    <div class="w-1/2">
                        <h2 class="text-xl font-bold text-[#212529]">${title}</h2>
                        <!-- Display other details of the blog as needed -->
                    </div>
                </div>
                <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">${description}</p>
            `;

            // Append each blog to the blogsContainer
            blogsContainer.appendChild(blogElement);
        });
    } catch (error) {
        console.error('Error fetching user blogs:', error);
    }
};

// Mock implementation to update the user's name when a user link is clicked
const updateUserName = (userName) => {
    const userFullNameElement = document.getElementById('userName');
    userFullNameElement.textContent = `All from ${userName}`;
};

