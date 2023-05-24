console.log("blog.js loaded");
window.onload = function () {
    fetch("http://localhost:8080/blogpost")
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {
                var createdAt = new Date(post.createdAt); // Convert createdAt to a Date object
                var day = createdAt.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if necessary
                var month = (createdAt.getMonth() + 1).toString().padStart(2, '0'); // Get the month (months are zero-based) and pad with leading zero if necessary
                var year = createdAt.getFullYear().toString().slice(-2); // Get the last two digits of the year
                var formattedDate = `${day}/${month}/${year}`; // Format the date as dd/mm/yy

                var blogPostHtml = `
                    <div class="blog-post">
                        <div class="blogPostHeader">
                            <h2>${post.headerTitle}</h2>
                        </div>
                        <div class="blogPostDate">
                            <p><u>${formattedDate}</u></p>
                        </div>
                        <div class="blogPostTitle">
                            <h3>${post.title}</h3>
                        </div>
                        <div class="blogImgContent"><img class="imgBlogPost" src="${post.imageUrl}" alt="Post image">
                        <div class="overviewBlogDescription">
                            <p class="overviewBlogPostDescription">${post.description}</p>                
                        </div>
                        </div>
                        <p class="truncatedContent">${post.content}</p>
                        <a class="readMoreLink" href="post.html?id=${post.blogPostId}">Read more</a></div>
                    </div>
                `;
                document.getElementById('blog-overview').innerHTML += blogPostHtml;
            });
        })
        .catch(error => console.error('Error:', error));
};
