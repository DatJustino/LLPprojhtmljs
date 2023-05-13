"use strict";

const endpoint = "http://localhost:8080/commissions";
let commissions;

window.addEventListener("load", initApp);

function initApp() {
    updateCommissionsTable(); // update the table of commissions: get and show all commissions

    // event listeners
    document.querySelector("#createCommissionButton").addEventListener("click", showCreateCommissionDialog);
    document.querySelector("#create-commission-form").addEventListener("submit", createCommissionClicked);
    document.querySelector("#update-commission-form").addEventListener("submit", updateCommissionClicked);
    document.querySelector("#delete-commission-form").addEventListener("submit", deleteCommissionClicked);
    document.querySelector("#delete-commission-dialog .btn-cancel").addEventListener("click", deleteCancelClicked);
/*
    document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
*/
/*    document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
    document.querySelector("#input-search").addEventListener("search", inputSearchChanged);*/
}

// ============== Events ============== //

function showCreateCommissionDialog() {
    document.querySelector("#create-commission-dialog").style.display = "block"; // show create commission dialog
}

function createCommissionClicked(event) {
    event.preventDefault();
    const form = event.target;
    const fName = form.elements.comFName.value;
    const lName = form.elements.comLName.value;
    const email = form.elements.comEmail.value;
    const phoneNumber = form.elements.comPhoneNumber.value;
    const subject = form.elements.comSubject.value;
    const description = form.elements.comDescription.value;
    const pageFormat1 = form.elements.comPageFormat1.value;
    const pageFormat2 = form.elements.comPageFormat2.value;
    const deliveryDate = form.elements.comDeliveryDate.value;
    const street = form.elements.comStreet.value;
    const houseNumber = form.elements.comHouseNumber.value;
    const floor = form.elements.comFloor.value;
    const zipCode = form.elements.comZipCode.value;
    const image1 = form.elements.comImage1.files[0];
    const image2 = form.elements.comImage2.files[0];
    const image3 = form.elements.comImage3.files[0];

    createCommission(fName, lName, email, phoneNumber, subject,
        description, pageFormat1, pageFormat2, deliveryDate, street,
        houseNumber, floor, zipCode, image1, image2, image3);
    form.reset();
}
async function createCommission(fName, lName, email, phoneNumber, subject, description, pageFormat1, pageFormat2, deliveryDate, street, houseNumber, floor, zipCode, image1, image2, image3) {
    const commissionData = {
        firstName: fName,
        lastName: lName,
        email: email,
        phoneNumber: phoneNumber,
        subject: subject,
        description: description,
        pageFormat1: pageFormat1,
        pageFormat2: pageFormat2,
        deliveryDate: deliveryDate,
        street: street,
        houseNumber: houseNumber,
        floor: floor,
        zipCode: zipCode,
    };

    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);
    formData.append("image3", image3);
//TODO: Datatype of pictures are wrong error 415 (Unsupported Media Type) !!!!! FIX THIS
    const response = await fetch(`${endpoint}/create`, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        console.log("New commission successfully added");
        updateCommissionsTable();
    }
}

function deleteCommissionClicked(event) {
    event.preventDefault();
    const id = event.target.getAttribute("data-id");
    deleteCommission(id);
}

function deleteCancelClicked() {
    document.querySelector("#delete-commission-dialog").style.display = "none";
}

function sortByChanged(event) {
    const selectedValue = event.target.value;

    if (selectedValue === "firstName") {
        commissions.sort(compareFirstName);
    } else if (selectedValue === "lastName") {
        commissions.sort(compareLastName);
    }

    showCommissions(commissions);
}
async function updateCommissionsTable() {
    commissions = await getCommissions();
    showCommissions(commissions);
}

/*
function inputSearchChanged(event) {
    const value = event.target.value;
    const commissionsToShow = searchCommissions(value);
    showCommissions(commissionsToShow);
}
*/

// ============== Commissions ============== //


async function getCommissions() {
    const response = await fetch(`${endpoint}`);
    const data = await response.json();
    const commissions = prepareData(data);
    return commissions;
}

function showCommissions(listOfCommissions) {
    const tableBody = document.querySelector("#commissionsTable tbody");
    tableBody.innerHTML = "";

    for (const commission of listOfCommissions) {
        showCommission(commission);
    }
}

function showCommission(commissionObject) {
    const tableBody = document.querySelector("#commissionsTable tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${commissionObject.commissionId}</td>
  <td>${commissionObject.fname}</td>
  <td>${commissionObject.lname}</td>
  <td>${commissionObject.email}</td>
  <td>${commissionObject.phoneNumber}</td>
  <td>${commissionObject.subject}</td>
  <td>${commissionObject.description}</td>
  <td>${commissionObject.pageFormat1}</td>
  <td>${commissionObject.pageFormat2}</td>
  <td>${commissionObject.deliveryDate}</td>
  <td>${commissionObject.street}</td>
  <td>${commissionObject.houseNumber}</td>
  <td>${commissionObject.floor}</td>
  <td>${commissionObject.zipCode}</td>
  <td>
      <button class="editCommissionButton btn btn-com" data-id="${commissionObject.commissionId}">Edit</button>
      <button class="deleteCommissionButton btn btn-delete" data-id="${commissionObject.commissionId}">Delete</button>
  </td>`;

    tableBody.appendChild(row);

    // add event listeners to com and delete buttons
    row.querySelector(".editCommissionButton").addEventListener("click", updateCommissionClicked);
    row.querySelector(".deleteCommissionButton").addEventListener("click", deleteCommissionClicked);
}
function searchCommissions(searchValue) {
    searchValue = searchValue.toLowerCase();

    const results = commissions.filter((commission) => {
        const fullName = `${commission.firstName}`.toLowerCase() + `${commission.lastName}`.toLowerCase();
        return fullName.includes(searchValue);
    });

    return results;
}



async function deleteCommission(id) {
    const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        console.log("Commission successfully deleted");
        updateCommissionsTable();
    }
}

async function updateCommission(id, fName, lName, email, phoneNumber, subject, description,
                                pageFormat1, pageFormat2, deliveryDate, street, houseNumber,
                                floor, zipCode, image1, image2, image3) {
    const commissionData = {
        commissionId: id,
        firstName: fName,
        lastName: lName,
        email: email,
        phoneNumber: phoneNumber,
        subject: subject,
        description: description,
        pageFormat1: pageFormat1,
        pageFormat2: pageFormat2,
        deliveryDate: deliveryDate,
        street: street,
        houseNumber: houseNumber,
        floor: floor,
        zipCode: zipCode,
    };

    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);
    formData.append("image3", image3);

    const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        body: formData,
    });

    if (response.ok) {
        console.log("Commission successfully updated");
        updateCommissionsTable();
    }
}
function updateCommissionClicked(event) {
    event.preventDefault();
    const form = event.target;
    const id = form.elements.commissionId.value;
    const fName = form.elements.comFName.value;
    const lName = form.elements.comLName.value;
    const email = form.elements.comEmail.value;
    const phoneNumber = form.elements.comPhoneNumber.value;
    const subject = form.elements.comSubject.value;
    const description = form.elements.comDescription.value;
    const pageFormat1 = form.elements.comPageFormat1.value;
    const pageFormat2 = form.elements.comPageFormat2.value;
    const deliveryDate = form.elements.comDeliveryDate.value;
    const street = form.elements.comStreet.value;
    const houseNumber = form.elements.comHouseNumber.value;
    const floor = form.elements.comFloor.value;
    const zipCode = form.elements.comZipCode.value;
    const image1 = form.elements.comImage1.files[0];
    const image2 = form.elements.comImage2.files[0];
    const image3 = form.elements.comImage3.files[0];
    updateCommission(id, fName, lName, email, phoneNumber, subject,
        description, pageFormat1, pageFormat2, deliveryDate, street,
        houseNumber, floor, zipCode, image1, image2, image3);
    form.reset();
}

// ============== Helper Functions ============== //
function prepareData(dataObject) {
    return dataObject;
}
/*function prepareData(dataObject) {
    const commissionsArray = [];

    for (const key in dataObject) {
        const commission = dataObject[key];
        commission.id = key;
        commissionsArray.push(commission);
    }

    return commissionsArray;
}*/

function compareFirstName(a, b) {
    return a.firstName.localeCompare(b.firstName);
}

function compareLastName(a, b) {
    return a.lastName.localeCompare(b.lastName);
}

