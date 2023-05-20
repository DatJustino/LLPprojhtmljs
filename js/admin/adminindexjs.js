


const endpoint = "http://localhost:63342/LLPprojhtmljs/templates/admin";
// Get button elements
const coursesButton = document.querySelector("#coursesButton");
const commissionsButton = document.querySelector("#commissionsButton");
const blogButton = document.querySelector("#blogButton");
const backButton = document.querySelector("#backButton");

// Add event listeners
coursesButton.addEventListener("click", () => {
    window.location.href = `${endpoint}/admincourse.html`; // Replace with the actual endpoint for administrating courses
});

commissionsButton.addEventListener("click", () => {
    window.location.href = `${endpoint}/admincommissions.html`; // Replace with the actual endpoint for administrating commissions
});

blogButton.addEventListener("click", () => {
    window.location.href = `${endpoint}/adminblog.html`; // Replace with the actual endpoint for administrating blog
});

backButton.addEventListener("click", () => {
    window.location.href = `http://localhost:63342/LLPprojhtmljs/templates/main/index.html`; // Replace with the actual endpoint for the normal homepage
});
