// Function to display all admins in the table
function displayAdmins(admins) {
    const adminTableBody = document.querySelector('#adminTable tbody');
    adminTableBody.innerHTML = '';
    for (const admin of admins) {
        const row = adminTableBody.insertRow();
        row.innerHTML = `
      <td>${admin.adminId}</td>
      <td>${admin.adminEmail}</td>
      <td>${admin.adminPassword}</td>
      <td>
        <button class="editAdminButton" data-id="${admin.adminId}">Edit</button>
        <button class="deleteAdminButton" data-id="${admin.adminId}">Delete</button>
      </td>
    `;
    }
}

// Function to fetch all admins from the server
async function fetchAdmins() {
    const response = await fetch('/admins');
    const admins = await response.json();
    displayAdmins(admins);
}

// Function to create a new admin
async function createAdmin(adminEmail, adminPassword) {
    const response = await fetch('/admins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            adminEmail: adminEmail,
            adminPassword: adminPassword
        })
    });
    const newAdmin = await response.json();
    return newAdmin;
}

// Function to update an existing admin
async function updateAdmin(adminId, adminEmail, adminPassword) {
    const  response = await fetch(/admins/${adminId}, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    adminId: adminId,
                    adminEmail: adminEmail,
                    adminPassword: adminPassword
                })
            });
            const updatedAdmin = await response.json();
            return updatedAdmin;
        }

// Function to delete an existing admin
    async function deleteAdmin(adminId) {
        const response = await fetch('/admins/' + adminId, {
            method: 'DELETE'
        });
        const deletedAdmin = await response.json();
        return deletedAdmin;
    }

// Function to handle form submission for creating a new admin
    async function handleCreateAdminFormSubmit(event) {
        event.preventDefault();
        const adminEmail = document.querySelector('#createAdminForm #adminEmail').value;
        const adminPassword = document.querySelector('#createAdminForm #adminPassword').value;
        await createAdmin(adminEmail, adminPassword);
        document.querySelector('#createAdminForm').reset();
        await fetchAdmins();
    }

// Function to handle form submission for updating an existing admin
    async function handleUpdateAdminFormSubmit(event) {
        event.preventDefault();
        const adminId = document.querySelector('#updateAdminForm #adminId').value;
        const adminEmail = document.querySelector('#updateAdminForm #adminEmail').value;
        const adminPassword = document.querySelector('#updateAdminForm #adminPassword').value;
        await updateAdmin(adminId, adminEmail, adminPassword);
        document.querySelector('#updateAdminForm').reset();
        await fetchAdmins();
    }

// Function to handle form submission for deleting an existing admin
    async function handleDeleteAdminFormSubmit(event) {
        event.preventDefault();
        const adminId = document.querySelector('#deleteAdminForm #adminId').value;
        await deleteAdmin(adminId);
        document.querySelector('#deleteAdminForm').reset();
        await fetchAdmins();
    }

// Event listener for clicking the Edit button for an admin
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('editAdminButton')) {
            const adminId = event.target.dataset.id;
            const response = await fetch('/admins/' + adminId);
            const admin = await response.json();
            document.querySelector('#updateAdminForm #adminId').value = admin.adminId;
            document.querySelector('#updateAdminForm #adminEmail').value = admin.adminEmail;
            document.querySelector('#updateAdminForm #adminPassword').value = admin.adminPassword;
        }
    });

// Event listener for clicking the Delete button for an admin
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('deleteAdminButton')) {
            const adminId = event.target.dataset.id;
            document.querySelector('#deleteAdminForm #adminId').value = adminId;
        }
    });

// Event listener for submitting the Create Admin form
    document.querySelector('#createAdminForm').addEventListener('submit', handleCreateAdminFormSubmit);

// Event listener for submitting the Update Admin form
    document.querySelector('#updateAdminForm').addEventListener('submit', handleUpdateAdminFormSubmit);

// Event listener for submitting the Delete Admin form
    document.querySelector('#deleteAdminForm').addEventListener('submit', handleDeleteAdminFormSubmit);

// Fetch all admins when the page loads
fetchAdmins();