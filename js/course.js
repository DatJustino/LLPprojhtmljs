
console.log('Courses.js loaded');


const endpoint = "http://localhost:8080/courses";

async function fetchCourses() {
    try {
        const response = await fetch(`${endpoint}`);
        const courses = await response.json();
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return null;
    }
}

function populateCourses(courses) {
    const courseContainer = document.querySelector(".course-container");

    // Clear the container
    courseContainer.innerHTML = '';

    courses.forEach(course => {
        // Create a new course div
        const courseDiv = document.createElement("div");
        courseDiv.className = 'course';

        // Create the content div
        const contentDiv = document.createElement("div");
        contentDiv.className = 'content';

        // Create and set the image
        const courseImg = document.createElement("img");
        courseImg.src = course.courseImageUrl;
        courseImg.alt = course.courseName;

        // Create and set the text content
        const textDiv = document.createElement("div");
        textDiv.className = 'text-content';

        const courseTitle = document.createElement("h2");
        courseTitle.textContent = course.courseName;

        const courseDesc = document.createElement("p");
        courseDesc.textContent = course.courseDescription;

        // Append elements
        textDiv.appendChild(courseTitle);
        textDiv.appendChild(courseDesc);
        contentDiv.appendChild(courseImg);
        contentDiv.appendChild(textDiv);
        courseDiv.appendChild(contentDiv);

        // Append the course to the course container
        courseContainer.appendChild(courseDiv);
    });
}

// Fetch and populate the courses on page load
document.addEventListener('DOMContentLoaded', async () => {
    const courses = await fetchCourses();
    if (courses) {
        populateCourses(courses);
    }
});