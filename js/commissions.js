"use strict";
console.log('commissions.js loaded');

const endpoint = "https://localhost:8080/admin";
let commissions;

window.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    updatePostsGrid(); // update the grid of posts: get and show all posts

    // event listener
    document.querySelector("#create-commission-dialog").addEventListener("click", showCreatePostDialog);
    document.querySelector("#create-commission-form").addEventListener("submit", createPostClicked);
    document.querySelector("#form-update-post").addEventListener("submit", updatePostClicked);
    document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
    document.querySelector("#delete-commission-form .btn-cancel").addEventListener("click", deleteCancelClicked);
    document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
    document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
    document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}

// ============== events ============== //

function showCreatePostDialog() {
    document.querySelector("#create-commission-dialog").showModal(); // show create dialog
}

function createPostClicked(event) {
    const form = event.target; // or "this"
    // extract the values from inputs from the form
    const createFName = form.createFName.value;
    const createLName = form.createLName.value;
    const cEmail = form.cEmail.value;
    const cPhoneNumber = form.cPhoneNumber.value;

    createPost(title, body, image); // use values to create a new post
    form.reset(); // reset the form (clears inputs)
}

function updatePostClicked(event) {
    const form = event.target; // or "this"
    // extract the values from inputs in the form
    const title = form.title.value;
    const body = form.body.value;
    const image = form.image.value;
    // get id of the post to update - saved in data-id
    const id = form.getAttribute("data-id");
    updatePost(id, title, body, image); // call updatePost with arguments
}

function deletePostClicked(event) {
    const id = event.target.getAttribute("data-id"); // event.target is the delete form
    deletePost(id); // call deletePost with id
}

function deleteCancelClicked() {
    document.querySelector("#dialog-delete-post").close(); // close dialog
}

// ============== posts ============== //

async function updatePostsGrid() {
    posts = await getPosts(); // get posts from rest endpoint and save in variable
    showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
async function getPosts() {
    const response = await fetch(`${endpoint}`); // fetch request, (GET)
    const data = await response.json(); // parse JSON to JavaScript
    const posts = prepareData(data); // convert object of object to array of objects
    return posts; // return posts
}

function showPosts(listOfPosts) {
    document.querySelector("#commissions-table").innerHTML = ""; // reset the content of section#posts

    for (const post of listOfPosts) {
        showPost(post); // for every post object in listOfPosts, call showPost
    }
}

