console.log('createblogpost.js loaded');

const createBlogPostButton = document.querySelector('#createBlogPostButton');
const createBlogPostModal = document.querySelector('#createBlogPostModal');

window.onload = async function () {
    await updateBlogPostsTable();
};

function showCreateBlogPostModal() {
    createBlogPostModal.style.display = 'block';
}

async function createBlogPost(event) {
    event.preventDefault();
    createBlogPostModal.style.display = 'block';
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const imageUrl = document.querySelector('#imageUrl').value;
    const fileUrl = document.querySelector('#fileUrl').value;

    const blogPost = {title, content, imageUrl, fileUrl};

    try {
        const response = await fetch('http://localhost:8080/blogposts/create', {
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
        await fetchblogposts();  // refresh the blog posts
        updateBlogPostsTable();
        window.location.reload();
    } catch (error) {
        console.error('Error creating blog post:', error);
    }
}

document.querySelector('#createBlogPostModal').addEventListener('submit', createBlogPost);


const editBlogPostModal = document.querySelector('#editBlogPostModal');

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
        await fetchblogposts();
        updateBlogPostsTable();
        window.location.reload();

    }
}

async function fetchBlogPostById(blogPostId) {
    const response = await fetch(`http://localhost:8080/blogposts/${blogPostId}`);
    const blogPost = await response.json();
    return blogPost;
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
        const response = await fetch(`http://localhost:8080/blogposts/edit/${blogPostId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blogPost),
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

document.querySelector('#editBlogPostModal form').addEventListener('submit', updateBlogPost);
createBlogPostButton.addEventListener('click', showCreateBlogPostModal);

blogPostsTable.addEventListener('click', async (event) => {
    blogPostsTable.addEventListener('click', async (event) => {
        if (event.target.classList.contains('editBlogPostButton')) {
            const blogPostId = event.target.dataset.blogpostid;
            console.log('blogPostId:', blogPostId); // debugging
            const blogPosts = await fetchblogposts();
            console.log('blogPosts:', blogPosts); // debugging
            const blogPost = blogPosts.find(blogPost => blogPost.id == blogPostId);
            showEditBlogPostModal(blogPost);
            updateBlogPostsTable();
        }
    });
});


