console.log("post.js loaded");

function initApp() {
    var urlParams = new URLSearchParams(window.location.search);
    var postId = urlParams.get('id');

    fetchBlogPost(postId)
        .then(data => {
            renderBlogPost(data);
            return fetchComments(postId);
        })
        .then(comments => renderComments(comments))
        .catch(error => handleFetchError('Error:', error));

    var addCommentForm = document.getElementById('add-comment-form');
    addCommentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var userName = document.getElementById('userName').value;
        var content = document.getElementById('content').value;

        var comment = {
            userName: userName,
            content: content
        };

        addComment(postId, comment)
            .then(response => handleAddCommentResponse(response))
            .catch(error => handleFetchError('Error adding comment:', error));

        // Reset the form fields after submitting the comment
        addCommentForm.reset();
    });
}

function fetchBlogPost(postId) {
    return fetch(`http://localhost:8080/blogpost/${postId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch blog post');
            }
        });
}

function renderBlogPost(data) {
    var createdAt = new Date(data.createdAt);
    var day = createdAt.getDate().toString().padStart(2, '0');
    var month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
    var year = createdAt.getFullYear().toString().slice(-2);
    var formattedDate = `${day}/${month}/${year}`;

    var blogPostDiv = document.createElement('div');
    blogPostDiv.classList.add('blog-post');

    var headerTitle = document.createElement('h2');
    headerTitle.textContent = data.headerTitle;
    blogPostDiv.appendChild(headerTitle);

    var blogPostDate = document.createElement('p');
    blogPostDate.textContent = formattedDate;
    blogPostDate.classList.add('blogPostDate'); // Add specific class
    blogPostDiv.appendChild(blogPostDate);

    var blogImg = document.createElement('img');
    blogImg.src = data.imageUrl;
    blogImg.alt = "Post image";
    blogPostDiv.appendChild(blogImg);

    var blogPostTitle = document.createElement('h3');
    blogPostTitle.textContent = data.title;
    blogPostDiv.appendChild(blogPostTitle);

    var blogPostDescription = document.createElement('p');
    blogPostDescription.textContent = data.description;
    blogPostDiv.appendChild(blogPostDescription);

    var blogPostContent = document.createElement('p');
    blogPostContent.textContent = data.content;
    blogPostDiv.appendChild(blogPostContent);

    document.getElementById('blog-post').appendChild(blogPostDiv);
}

function fetchComments(postId) {
    return fetch(`http://localhost:8080/blogpost/${postId}/comments`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch comments');
            }
        });
}

function renderComments(comments) {
    var commentsDiv = document.getElementById('comments');
    comments.forEach(comment => {
        var commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        var commentHeaderDiv = document.createElement('div');
        commentHeaderDiv.classList.add('comment-header');

        var userName = document.createElement('h4');
        userName.classList.add('author');
        userName.innerText = comment.userName;
        commentHeaderDiv.appendChild(userName);

        var commentTime = document.createElement('span');
        commentTime.classList.add('time');
        var date = new Date(comment.createdAt);  // assuming comment object has createdAt attribute
        commentTime.innerText = date.toLocaleString();
        commentHeaderDiv.appendChild(commentTime);

        var commentContent = document.createElement('p');
        commentContent.classList.add('comment-content');
        commentContent.innerText = comment.content;

        commentDiv.appendChild(commentHeaderDiv);
        commentDiv.appendChild(commentContent);
        commentsDiv.appendChild(commentDiv);
    });
}

function addComment(postId, comment) {
    return fetch(`http://localhost:8080/blogpost/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
        .then(response => {
            if (response.ok) {
                return 'Comment added successfully'; // return a success message
            } else {
                throw new Error('Failed to add comment');
            }
        })
        .catch(error => {
            console.error('Error adding comment:', error);
        });
}

function handleAddCommentResponse(response) {
    console.log('Comment added successfully');
    // Optionally, you can display a success message or perform other actions
}

function handleFetchError(message, error) {
    console.error(message, error);
    // Optionally, you can display an error message or handle the error
}

window.onload = function() {
    initApp();
};
