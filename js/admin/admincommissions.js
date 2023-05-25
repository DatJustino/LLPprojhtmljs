"use strict";

const endpoint = "http://localhost:8080/admin/commissions";
let commissions;
let currentCommissionId;

window.addEventListener("load", initApp);

function initApp() {
    updateCommissionsTable(); // update the table of commissions: get and show all commissions

    // event listeners
    document.querySelector("#createCommissionButton").addEventListener("click", showCreateCommissionDialog);
    document.querySelector("#create-commission-form").addEventListener("submit", handleCreateCommission);
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
        updateCommissionsTable();
    }
}

function createFormData(commissionData) {
    const formData = new FormData();
    for (const key in commissionData) {
        formData.append(key, commissionData[key]);
    }
    return formData;
}

/*
function inputSearchChanged(event) {
    const value = event.target.value;
    const commissionsToShow = searchCommissions(value);
    showCommissions(commissionsToShow);
}
*/

/*function sortByChanged(event) {
    const selectedValue = event.target.value;

    if (selectedValue === "firstName") {
        commissions.sort(compareFirstName);
    } else if (selectedValue === "lastName") {
        commissions.sort(compareLastName);
    }

    showCommissions(commissions);
}*/


// ============== Commissions ============== //


async function getCommissions() {
    const response = await fetch(`${endpoint}`);
    const data = await response.json();
    const commissions = prepareData(data);
    return commissions;
}

async function updateCommissionsTable() {
    commissions = await getCommissions();
    showCommissions(commissions);
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
  <td>${commissionObject.firstname}</td>
  <td>${commissionObject.lastname}</td>
  <td>${commissionObject.email}</td>
  <td>${commissionObject.phonenumber}</td>
  <td>${commissionObject.subject}</td>
  <td>${commissionObject.description}</td>
  <td>${commissionObject.pageformat1}</td>
  <td>${commissionObject.pageformat2}</td>
  <td>${commissionObject.deliverydate}</td>
  <td>${commissionObject.street}</td>
  <td>${commissionObject.housenumber}</td>
  <td>${commissionObject.floor}</td>
  <td>${commissionObject.zipcode}</td>
  <td id="textTooLong">${commissionObject.imageurl1}</td>
  <td id="textTooLong">${commissionObject.imageurl2}</td>
  <td id="textTooLong">${commissionObject.imageurl3}</td>
  <td>
      <button class="editCommissionButton btn btn-com" data-id="${commissionObject.commissionId}">Edit</button>
      <button class="deleteCommissionButton btn btn-delete" data-id="${commissionObject.commissionId}">Delete</button>
  </td>`;

    tableBody.appendChild(row);

    // add event listeners to com and delete buttons
    row.querySelector(".editCommissionButton").addEventListener("click", function () {
        currentCommissionId = commissionObject.commissionId;
        showUpdateCommissionDialog(commissionObject);
    });
    row.querySelector(".deleteCommissionButton").addEventListener("click", function () {
        currentCommissionId = commissionObject.commissionId;
        showDeleteCommissionDialog(commissionObject);
    });
}

function showUpdateCommissionDialog(commission) {
    document.querySelector("#update-commission-dialog").style.display = "block";
    const form = document.querySelector("#update-commission-form");
    form.querySelector("#firstname").value = commission.firstname;
    form.querySelector("#lastname").value = commission.lastname;
    form.querySelector("#email").value = commission.email;
    form.querySelector("#phonenumber").value = commission.phonenumber;
    form.querySelector("#subject").value = commission.subject;
    form.querySelector("#description").value = commission.description;
    form.querySelector("#pageformat1").value = commission.pageformat1;
    form.querySelector("#pageformat2").value = commission.pageformat2;
    form.querySelector("#deliverydate").value = commission.deliverydate;
    form.querySelector("#street").value = commission.street;
    form.querySelector("#housenumber").value = commission.housenumber;
    form.querySelector("#floor").value = commission.floor;
    form.querySelector("#zipcode").value = commission.zipcode;
    form.querySelector("#imageurl1").value = commission.imageurl1;
    form.querySelector("#imageurl2").value = commission.imageurl2;
    form.querySelector("#imageurl3").value = commission.imageurl3;
}

/*
function searchCommissions(searchValue) {
    searchValue = searchValue.toLowerCase();

    const results = commissions.filter((commission) => {
        const fullName = `${commission.firstName}`.toLowerCase() + `${commission.lastName}`.toLowerCase();
        return fullName.includes(searchValue);
    });

    return results;
}
*/

async function updateCommission(id, firstname, lastname, email, phonenumber, subject, description,
                                pageformat1, pageformat2, deliverydate, street, housenumber,
                                floor, zipcode, imageurl1, imageurl2, imageurl3) {
    const commissionData = {
        commissionId: id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phonenumber: phonenumber,
        subject: subject,
        description: description,
        pageformat1: pageformat1,
        pageformat2: pageformat2,
        deliverydate: deliverydate,
        street: street,
        housenumber: housenumber,
        floor: floor,
        zipcode: zipcode,
        imageurl1: imageurl1,
        imageurl2: imageurl2,
        imageurl3: imageurl3,
    };

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phonenumber", phonenumber);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("pageformat1", pageformat1);
    formData.append("pageformat2", pageformat2);
    formData.append("deliverydate", deliverydate);
    formData.append("street", street);
    formData.append("housenumber", housenumber);
    formData.append("floor", floor);
    formData.append("zipcode", zipcode);
    formData.append("imageurl1", imageurl1);
    formData.append("imageurl2", imageurl2);
    formData.append("imageurl3", imageurl3);
    console.log(formData);
    const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commissionData),
    });
    if (response.ok) {
        console.log("Commission successfully updated");
        updateCommissionsTable();
    }
}

function updateCommissionClicked(event) {
    event.preventDefault();
    const form = event.target;
    const id = event.target.getAttribute("data-id");
    const commission = commissions.find(commission => commission.commissionId == id);

    const firstname = form.querySelector("#firstname").value;
    const lastname = form.querySelector("#lastname").value;
    const email = form.querySelector("#email").value;
    const phonenumber = form.querySelector("#phonenumber").value;
    const subject = form.querySelector("#subject").value;
    const description = form.querySelector("#description").value;
    const pageformat1 = form.querySelector("#pageformat1").value;
    const pageformat2 = form.querySelector("#pageformat2").value;
    const deliverydate = form.querySelector("#deliverydate").value;
    const street = form.querySelector("#street").value;
    const housenumber = form.querySelector("#housenumber").value;
    const floor = form.querySelector("#floor").value;
    const zipcode = form.querySelector("#zipcode").value;
    const imageurl1 = form.querySelector("#imageurl1").value;
    const imageurl2 = form.querySelector("#imageurl2").value;
    const imageurl3 = form.querySelector("#imageurl3").value;
    console.log(id, firstname, lastname, email, phonenumber, subject, description,
        pageformat1, pageformat2, deliverydate, street, housenumber,
        floor, zipcode, imageurl1, imageurl2, imageurl3);
    updateCommission(currentCommissionId, firstname, lastname, email, phonenumber, subject,
        description, pageformat1, pageformat2, deliverydate, street,
        housenumber, floor, zipcode, imageurl1, imageurl2, imageurl3);
    form.reset();
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

function deleteCommissionClicked(event) {
    event.preventDefault();
    const id = event.target.getAttribute("data-id");
    deleteCommission(id);
    document.querySelector("#delete-commission-dialog").style.display = "none";
}

function deleteCancelClicked() {
    document.querySelector("#delete-commission-dialog").style.display = "none";
}

function prepareData(dataObject) {
    return dataObject;
}

function hideCreateCommissionModal() {
    const modal = document.querySelector("#create-commission-dialog");
    modal.style.display = 'none';
}

function hideEditCommissionModal() {
    const modal = document.querySelector("#edit-commission-dialog");
    modal.style.display = 'none';
}

function showDeleteCommissionDialog(commissionObject) {
    const id = commissionObject.commissionId;
    const commission = commissions.find(commission => commission.commissionId == id);
    document.querySelector("#dialog-delete-post-title").textContent = `${commission.firstname} ${commission.lastname}`;
    document.querySelector("#delete-commission-form").setAttribute("data-id", id);
    document.querySelector("#delete-commission-dialog").style.display = "block";
}

function compareFirstName(a, b) {
    return a.firstName.localeCompare(b.firstName);
}

function compareLastName(a, b) {
    return a.lastName.localeCompare(b.lastName);
}

