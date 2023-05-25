window.addEventListener("DOMContentLoaded", addNavBar)
async function addNavBar() {
    const resp = await fetch("/../../templates/admin/adminnavbar.html");
    const html = await resp.text();
    document.body.insertAdjacentHTML("beforebegin", html);
}