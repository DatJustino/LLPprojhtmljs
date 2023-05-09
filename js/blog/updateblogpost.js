console.log('updateblogpost.js loaded');


// Function to update an existing blog post
async function updateBlogPost(blogPostId, title, content, imageUrl, fileUrl) {
    try {
        const response = await fetch(`http://localhost:8080/blogposts/edit/${blogPostId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                imageUrl,
                fileUrl
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const updatedBlogPost = text ? JSON.parse(text) : null;
        console.log('Blog post updated:', updatedBlogPost);
        return updatedBlogPost;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to handle form submission for updating a blog post
/*async function handleUpdateBlogPostFormSubmit(event) {
    event.preventDefault();

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
    }
}*/
function hideEditBlogPostModal() {
    document.querySelector('#editBlogPostModal').style.display = 'none';
}
// Function to fetch a single blog post by its ID

// Function to show the Edit Blog Post modal and populate its fields with the blog post data
/*
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
*/


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

    const confirmDelete = confirm("Are you sure you want to delete this blog post?");

    if (confirmDelete) {
        const success = await deleteBlogPost(blogPostId);

        if (success) {
            console.log(`Blog post with ID ${blogPostId} deleted successfully.`);
            await fetchBlogPosts(); // Call fetchblogposts() to refresh the HTML table after deleting the blog post
            updateBlogPostsTable();
        } else {
            console.error(`Error deleting blog post with ID ${blogPostId}.`);
        }
    }
}


//Updates blogposts table with new blogpost, deletefunction and updatefunction in the other files as well
// Function to update the blog posts table with the latest data from the server
//Updates blogposts table with new blogpost, deletefunction and updatefunction in the other files as well
async function updateBlogPostsTable() {
    try {
        const blogPosts = await fetchblogposts();
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
                await fetchblogposts();
                updateBlogPostsTable();
            });
        });
    } catch (error) {
        console.error('Error updating blog posts table:', error);
    }
}
