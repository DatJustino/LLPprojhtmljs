"use strict";

console.log("commissions.js loaded");
const endpoint = "http://localhost:8080/commissions";

window.addEventListener("load", initApp);

function initApp() {
    document.querySelector("#createCommissionButton").addEventListener("click", showCreateCommissionDialog);
    document.querySelector("#create-commission-form").addEventListener("submit", handleCreateCommission);
}
function showCreateCommissionDialog() {
    document.querySelector("#create-commission-dialog").style.display = "block"; // show create commission dialog
}
function hideCreateCommissionModal() {
    const modal = document.querySelector("#create-commission-dialog");
    modal.style.display = 'none';
}


function handleCreateCommission(event) {
    showCreateCommissionDialog();
    event.preventDefault();
    /*    const form = event.target;*/
    const form = event.target;
    const commissionData = {
        firstname: form.elements.firstname.value,
        lastname: form.elements.lastname.value,
        email: form.elements.email.value,
        phonenumber: form.elements.phonenumber.value,
        subject: form.elements.subject.value,
        description: form.elements.description.value,
        pageformat1: form.elements.pageformat1.value,
        pageformat2: form.elements.pageformat2.value,
        deliverydate: form.elements.deliverydate.value,
        street: form.elements.street.value,
        housenumber: form.elements.housenumber.value,
        floor: form.elements.floor.value,
        zipcode: form.elements.zipcode.value,
        imageurl1: form.elements.imageurl1.value,
        imageurl2: form.elements.imageurl2.value,
        imageurl3: form.elements.imageurl3.value
    };

    createCommission(commissionData);
    console.log(form)
    form.reset();
    hideCreateCommissionModal();
}

async function createCommission(commissionData) {
    const formData = createFormData(commissionData);

    const response = await fetch(`${endpoint}`, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        console.log("New commission successfully added");
    }
}

function createFormData(commissionData) {
    const formData = new FormData();
    for (const key in commissionData) {
        formData.append(key, commissionData[key]);
    }
    return formData;
}