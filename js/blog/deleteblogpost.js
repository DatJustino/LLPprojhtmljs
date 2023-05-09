console.log('deleteblogpost.js loaded');

const blogPostsTable = document.querySelector('#blogPostsTable');
const deleteConfirmationMessage = document.querySelector('#deleteConfirmationMessage');
const confirmDeleteButton = document.querySelector('#confirmDeleteButton');
const cancelDeleteButton = document.querySelector('#cancelDeleteButton');

// Function to fetch all blog posts
async function fetchBlogPosts() {
    try {
        const response = await fetch('http://localhost:8080/blogposts/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogPosts = await response.json();
        return blogPosts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return null;
    }
}

// Function to delete a blog post by ID
async function deleteBlogPost(blogPostId) {
    try {
        const response = await fetch(`http://localhost:8080/blogposts/del/${blogPostId}`, {
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

// Function to handle clicking the Delete button in the blog posts table
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


// Event listener for clicking the Delete button in the blog posts table
blogPostsTable.addEventListener('click', async (event) => {
    if (event.target.classList.contains('deleteBlogPostButton')) {
        await handleDeleteBlogPostButtonClick(event);
        await window.location.reload();

    }
});
