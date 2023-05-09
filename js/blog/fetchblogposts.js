console.log('fetchblogposts.js loaded');

// Function to fetch all blog posts from the server
async function fetchblogposts() {
    try {
        const response = await fetch('http://localhost:8080/blogposts/all');
        const blogPosts = await response.json();
        return blogPosts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return null;
    }
}


/*async function updateBlogPostsTable() {
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
    } catch (error) {
        console.error('Error updating blog posts table:', error);
    }
}*/


fetchblogposts();