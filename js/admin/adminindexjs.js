// Get button elements
const coursesButton = document.querySelector("#coursesButton");
const commissionsButton = document.querySelector("#commissionsButton");
const blogButton = document.querySelector("#blogButton");
const backButton = document.querySelector("#backButton");

// Add event listeners
coursesButton.addEventListener("click", () => {
    window.location.href = "admin/courses"; // Replace with the actual endpoint for administrating courses
});

commissionsButton.addEventListener("click", () => {
    window.location.href = "admin/commissions"; // Replace with the actual endpoint for administrating commissions
});

blogButton.addEventListener("click", () => {
    window.location.href = "admin/blog"; // Replace with the actual endpoint for administrating blog
});

backButton.addEventListener("click", () => {
    window.location.href = "home"; // Replace with the actual endpoint for the normal homepage
});
