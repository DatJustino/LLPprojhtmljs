"use strict";

console.log('adminblogposts.js loaded');
const endpoint = "http://localhost:8080/admin/blog";

const blogPostsTable = document.querySelector('#blogPostsTable');
const editBlogPostModal = document.querySelector('#editBlogPostModal');
const createBlogPostButton = document.querySelector('#createBlogPostButton');
const createBlogPostModal = document.querySelector('#createBlogPostModal');

createBlogPostButton.addEventListener('click', showCreateBlogPostModal);

document.querySelector('#createBlogPostModal').addEventListener('submit', adminblogposts);
document.querySelector('#editBlogPostModal form').addEventListener('submit', updateBlogPost);

const deleteConfirmationMessage = document.querySelector('#deleteConfirmationMessage');
const confirmDeleteButton = document.querySelector('#confirmDeleteButton');
const cancelDeleteButton = document.querySelector('#cancelDeleteButton');

blogPostsTable.addEventListener('click', async (event) => {
    blogPostsTable.addEventListener('click', async (event) => {
        if (event.target.classList.contains('editBlogPostButton')) {
            const blogPostId = event.target.dataset.blogpostid;
            console.log('blogPostId:', blogPostId); // debugging
            const blogPosts = await fetchBlogPosts();
            console.log('blogPosts:', blogPosts); // debugging
            const blogPost = blogPosts.find(blogPost => blogPost.id === blogPostId);
            showEditBlogPostModal(blogPost);
            updateBlogPostsTable();
        }
    });
});

async function fetchBlogPosts() {
    try {
        const response = await fetch(`${endpoint}`);
        const blogPosts = await response.json();
        return blogPosts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return null;
    }
}
async function fetchBlogPostById(blogPostId) {
    const response = await fetch(`${endpoint}/${blogPostId}`);
    const blogPost = await response.json();
    return blogPost;
}


async function adminblogposts(event) {
    event.preventDefault();
    createBlogPostModal.style.display = 'block';
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const imageUrl = document.querySelector('#imageUrl').value;
    const fileUrl = document.querySelector('#fileUrl').value;
    const blogPost = {title, content, imageUrl, fileUrl};
    try {
        const response = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blogPost),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Blog post created successfully.');
        createBlogPostModal.style.display = 'none';
        await fetchBlogPosts();  // refresh the blog posts
        updateBlogPostsTable();
        window.location.reload();
    } catch (error) {
        console.error('Error creating blog post:', error);
    }
}


async function showEditBlogPostModal(blogPostId) {
    const blogPost = await fetchBlogPostById(blogPostId);
    document.querySelector('#updateBlogPostForm [name="blogPostId"]').value = blogPost.blogPostId;
    document.querySelector('#updateBlogPostForm [name="title"]').value = blogPost.title;
    document.querySelector('#updateBlogPostForm [name="content"]').value = blogPost.content;
    document.querySelector('#updateBlogPostForm [name="imageUrl"]').value = blogPost.imageUrl;
    document.querySelector('#updateBlogPostForm [name="fileUrl"]').value = blogPost.fileUrl;
    document.querySelector('#editBlogPostModal').style.display = 'block';
    // Add event listener to the Update button in the edit modal
    document.querySelector('#updateBlogPostButton').addEventListener('click', handleUpdateBlogPostFormSubmit);
}

async function handleUpdateBlogPostFormSubmit(event) {
    const blogPostId = document.querySelector('#updateBlogPostForm [name="blogPostId"]').value;
    const title = document.querySelector('#updateBlogPostForm [name="title"]').value;
    const content = document.querySelector('#updateBlogPostForm [name="content"]').value;
    const imageUrl = document.querySelector('#updateBlogPostForm [name="imageUrl"]').value;
    const fileUrl = document.querySelector('#updateBlogPostForm [name="fileUrl"]').value;

    const updatedBlogPost = await updateBlogPost(blogPostId, title, content, imageUrl, fileUrl);
    if (updatedBlogPost) {
        hideEditBlogPostModal();
        await fetchBlogPosts();
        updateBlogPostsTable();
        window.location.reload();
    }
}


async function updateBlogPost(event) {
    const form = editBlogPostModal.querySelector('form');
    const blogPostId = form.elements['blogPostId'].value;
    const title = form.elements['title'].value;
    const content = form.elements['content'].value;
    const imageUrl = form.elements['imageUrl'].value;
    const fileUrl = form.elements['fileUrl'].value;
    const blogPost = {blogPostId, title, content, imageUrl, fileUrl};
    try {
        const response = await fetch(`${endpoint}/${blogPostId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(blogPost),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Blog post updated successfully.');
        editBlogPostModal.style.display = 'none';
        await updateBlogPostsTable();
        window.location.reload();
    } catch (error) {
        console.error('Error updating blog post:', error);
    }
}

async function updateBlogPostsTable() {
    try {
        const blogPosts = await fetchBlogPosts();
        const blogPostsTableBody = document.querySelector('#blogPostsTable tbody');
        blogPostsTableBody.innerHTML = '';

        blogPosts.forEach((blogPost, index) => {
            const blogPostRow = `
        <tr class="${index % 2 === 0 ? 'even' : 'odd'}">
          <td>${blogPost.blogPostId}</td>
          <td>${blogPost.title}</td>
          <td>${blogPost.content}</td>
          <td>${blogPost.imageUrl}</td>
          <td>${blogPost.fileUrl}</td>
          <td>${blogPost.createdAt}</td>
          <td>
            <button class="editBlogPostButton" data-blogpostid="${blogPost.blogPostId}">Edit</button>
            <button class="deleteBlogPostButton" data-blogpostid="${blogPost.blogPostId}">Delete</button>
          </td>
        </tr>
      `;
            blogPostsTableBody.insertAdjacentHTML('beforeend', blogPostRow);
        });

        console.log('Blog posts table updated.');

        // Add event listeners to the Edit and Delete buttons in each row
        const editButtons = document.querySelectorAll('.editBlogPostButton');
        const deleteButtons = document.querySelectorAll('.deleteBlogPostButton');

        editButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const blogPostId = event.target.getAttribute('data-blogpostid');
                await showEditBlogPostModal(blogPostId);
            });
        });

        deleteButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const blogPostId = event.target.getAttribute('data-blogpostid');
                await deleteBlogPost(blogPostId);
                await fetchBlogPosts();
                updateBlogPostsTable();
            });
        });
    } catch (error) {
        console.error('Error updating blog posts table:', error);
    }
}
//TODO: Remove unecessary endpoints, del
async function deleteBlogPost(blogPostId) {
    try {
        const response = await fetch(`${endpoint}/${blogPostId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        updateBlogPostsTable();
        return true;
    } catch (error) {
        console.error(`Error deleting blog post with ID ${blogPostId}:`, error);
        return false;
    }
}

async function handleDeleteBlogPostButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const blogPostId = event.target.dataset.blogpostid;
    const deleteConfirmationMessage = document.querySelector('#deleteConfirmationMessage');

    if (!deleteConfirmationMessage) {
        console.error('Error: delete confirmation message element not found.');
        return;
    }

    deleteConfirmationMessage.style.display = 'block';

    const confirmDeleteButton = document.querySelector('#confirmDeleteButton');
    confirmDeleteButton.addEventListener('click', async () => {
        const success = await deleteBlogPost(blogPostId);

        if (success) {
            console.log(`Blog post with ID ${blogPostId} deleted successfully.`);
            deleteConfirmationMessage.style.display = 'none';
            await updateBlogPostsTable();
        } else {
            console.error(`Error deleting blog post with ID ${blogPostId}.`);
            deleteConfirmationMessage.style.display = 'none';
        }
    });

    const cancelDeleteButton = document.querySelector('#cancelDeleteButton');
    cancelDeleteButton.addEventListener('click', () => {
        deleteConfirmationMessage.style.display = 'none';
    });
    window.location.reload();
}

function showCreateBlogPostModal() {
    createBlogPostModal.style.display = 'block';
}
function hideEditBlogPostModal() {
    document.querySelector('#editBlogPostModal').style.display = 'none';
}

window.onload = async function () {
    await updateBlogPostsTable();
};
