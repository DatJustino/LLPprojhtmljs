$(document).ready(function() {
    // Fetch and display images
    async function fetchImages() {
        $.ajax({
            url: 'http://localhost:8080/api/images',
            type: 'GET',
            success: function(response) {
                var postsSection = $('#posts');
                postsSection.empty();

                response.forEach(function(image) {
                    if (isImageFileTypeValid(image.imageName)) {
                        var postDiv = $('<div>').addClass('post');
                        var imgElement = $('<img>');
                        imgElement.attr('src', 'http://localhost:8080/api/images/' + image.imageId); // Set the image source to the endpoint
                        var captionElement = $('<p>').text(image.imageName);

                        postDiv.append(imgElement, captionElement);
                        postsSection.append(postDiv);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Failed to fetch images:', error);
            }
        });
    }

    // Function to check if the file extension is valid
    function isImageFileTypeValid(filename) {
        var validExtensions = ['.jpg', '.jpeg', '.png'];
        var extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        return validExtensions.includes(extension);
    }

    // Handle form submission
    $('#imageUploadForm').submit(function(e) {
        e.preventDefault(); // Prevent default form submission

        var fileInput = $('#imageFileInput')[0];
        var file = fileInput.files[0];

        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: 'http://localhost:8080/api/images',
            type: 'POST',
            data: formData,
            processData: false, // Prevent jQuery from processing the data
            contentType: false, // Let the browser set the content type
            success: function(response) {
                // Image uploaded successfully
                console.log('Image uploaded:', response);
                // Add logic to handle the uploaded image, such as displaying it on the page
                fetchImages(); // Fetch and display updated images
            },
            error: function(xhr, status, error) {
                // Error handling
                console.error('Image upload failed:', error);
            }
        });
    });

    // Fetch and display initial images
    fetchImages();
});
