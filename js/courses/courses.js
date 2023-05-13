"use strict";

console.log('courses.js loaded');

const coursesTable = document.querySelector('#coursesTable');
const editCourseModal = document.querySelector('#editCourseModal');
const createCourseButton = document.querySelector('#createCourseButton');
const createCourseModal = document.querySelector('#createCourseModal');
createCourseButton.addEventListener('click', showCreateCourseModal);

document.querySelector('#createCourseModal').addEventListener('submit', createCourse);
document.querySelector('#editCourseModal form').addEventListener('submit', updateCourse);
confirmDeleteButton.addEventListener('click', async (event) => {
    const courseId = event.target.dataset.courseId;
    const success = await deleteCourse(courseId);
    if (success) {
        console.log(`Course with ID ${courseId} deleted successfully.`);
        await updateCoursesTable();
    } else {
        console.error(`Error deleting course with ID ${courseId}.`);
    }
});

/*
coursesTable.addEventListener('click', showEditCourseModal);
*/
coursesTable.addEventListener('click', async (event) => {
    coursesTable.addEventListener('click', async (event) => {
        if (event.target.classList.contains('editCourseButton')) {
            const courseId = event.target.dataset.courseId;
            const courses = await fetchCourses();
            const course = courses.find(course => course.courseId === courseId); // Fix: Use courseId instead of id
            showEditCourseModal(course); // Pass the courseId instead of the course object
            updateCoursesTable();
        }
    });
});

// Function to fetch all courses
async function fetchCourses() {
    try {
        const response = await fetch('http://localhost:8080/courses/all');
        /*        if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }*/
        const courses = await response.json();
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return null;
    }
}

async function fetchCourseById(courseId) {
    const response = await fetch(`http://localhost:8080/courses/${courseId}`);
    const course = await response.json();
    return course;
}

/*async function fetchcoursebyidtest(courseId)
 {
    const course = await fetchCourseById(courseId);
    console.log(course);
}
fetchcoursebyidtest(61)*/
// Example usage:

////////////////////// CREATE COURSE /////////////////////////
// Function to create a new course
async function createCourse(event) {
    event.preventDefault();
    createCourseModal.style.display = 'block';
    const courseName = document.querySelector('#courseName').value;
    const courseImageUrl = document.querySelector('#courseImageUrl').value;
    const courseDescription = document.querySelector('#courseDescription').value;
    const course = {courseName, courseImageUrl, courseDescription};

    try {
        const response = await fetch('http://localhost:8080/courses/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(course),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Course created successfully.');
        createCourseModal.style.display = 'none';
        console.log(course)
        updateCoursesTable();
        window.location.reload();
    } catch (error) {
        console.error('Error creating course:', error);
    }
}

///////////////////////////////////////////////// COURSE UPDATE /////////////////////////////////////////////////

async function showEditCourseModal(courseId) {
    const course = await fetchCourseById(courseId);
    document.querySelector('#updateCourseForm [name="courseId"]').value = course.courseId;
    document.querySelector('#updateCourseForm [name="courseName"]').value = course.courseName;
    document.querySelector('#updateCourseForm [name="courseImageUrl"]').value = course.courseImageUrl;
    document.querySelector('#updateCourseForm [name="courseDescription"]').value = course.courseDescription;
    document.querySelector('#editCourseModal').style.display = 'block';
    // Add event listener to the Update button in the edit modal
    document.querySelector('#updateCourseButton').addEventListener('click', handleUpdateCourseFormSubmit);
}

async function handleUpdateCourseFormSubmit(event) {
    const courseId = document.querySelector('#updateCourseForm [name="courseId"]').value;
    const courseName = document.querySelector('#updateCourseForm [name="courseName"]').value;
    const courseImageUrl = document.querySelector('#updateCourseForm [name="courseImageUrl"]').value;
    const courseDescription = document.querySelector('#updateCourseForm [name="courseDescription"]').value;

    const updatedCourse = await updateCourse(courseId, courseName, courseImageUrl, courseDescription);
    if (updatedCourse) {
        hideEditCourseModal();
        await fetchCourses();
        updateCoursesTable();
        window.location.reload();
    }
}

async function updateCourse(event) {
    const form = editCourseModal.querySelector('form');
    const courseId = form.elements['courseId'].value;
    const courseName = form.elements['courseName'].value;
    const courseImageUrl = form.elements['courseImageUrl'].value;
    const courseDescription = form.elements['courseDescription'].value;
    const course = {courseId, courseName, courseImageUrl, courseDescription};
    try {
        const response = await fetch(`http://localhost:8080/courses/edit/${courseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(course),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Course updated successfully.');
        editCourseModal.style.display = 'none';
        await updateCoursesTable();
        window.location.reload();
    } catch (error) {
        console.error('Error updating course:', error);
    }
}

// Function to update the courses table with the fetched courses

async function updateCoursesTable() {
    try {
        const courses = await fetchCourses();
        const coursesTableBody = document.querySelector('#coursesTable tbody');
        coursesTableBody.innerHTML = '';

        courses.forEach((course, index) => {
            const courseRow = `
                <tr class="${index % 2 === 0 ? 'even' : 'odd'}">
                    <td>${course.courseId}</td>
                    <td>${course.courseName}</td>
                    <td>${course.courseDescription}</td>
                    <td>${course.courseImageUrl}</td>
                    <td>
                        <img src="${course.courseImageUrl}">
                    </td>
                    <td>
                        <button class="editCourseButton" data-courseId="${course.courseId}">Edit</button>
                        <button class="deleteCourseButton" data-courseId="${course.courseId}">Delete</button>
                    </td>
                </tr>
            `;
            coursesTableBody.insertAdjacentHTML('beforeend', courseRow);
        });

        console.log('Courses table updated.');

        // Add event listeners to the Edit and Delete buttons in each row
        const editButtons = document.querySelectorAll('.editCourseButton');
        const deleteButtons = document.querySelectorAll('.deleteCourseButton');

        editButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const courseId = event.target.getAttribute('data-courseId');
                await showEditCourseModal(courseId);
            });
        });

        deleteButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const courseId = event.target.getAttribute('data-courseId');
                const success = await deleteCourse(courseId);
                if (success) {
                    console.log(`Course with ID ${courseId} deleted successfully.`);
                    await fetchCourses()
                    await updateCoursesTable();
                } else {
                    console.error(`Error deleting course with ID ${courseId}.`);
                }
            });
        });
    } catch (error) {
        console.error('Error updating courses table:', error);
    }
}

/*async function updateCoursesTable() {
    const courses = await fetchCourses();
    if (!courses) {
        console.error('Error fetching courses.');
        return;
    }

    const coursesTableBody = coursesTable.querySelector('tbody');
    coursesTableBody.innerHTML = '';

    for (const course of courses) {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = course.courseId;
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = course.courseName;
        row.appendChild(nameCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = course.courseDescription;
        row.appendChild(descriptionCell);

        const imageCell = document.createElement('td');
        imageCell.textContent = course.courseImageUrl;
        row.appendChild(imageCell);

        const img = document.createElement('img');
        img.src = course.courseImageUrl;
        row.appendChild(img);

        const actionsCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.dataset.courseId = course.courseId;
        editButton.addEventListener('click', (event) => {
            const courseId = event.target.dataset.courseId;
            showEditForm(courseId);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.courseId = course.courseId;
        deleteButton.addEventListener('click', async (event) => {
            const courseId = event.target.dataset.courseId;
            const success = await deleteCourse(courseId);
            if (success) {
                console.log(`Course with ID ${courseId} deleted successfully.`);
                await updateCoursesTable();
            } else {
                console.error(`Error deleting course with ID ${courseId}.`);
            }
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        coursesTableBody.appendChild(row);
    }
}*/

// Call the function to update the courses table when the page loads

async function deleteCourse(courseId) {
    try {
        const response = await fetch(`http://localhost:8080/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        updateCoursesTable()
        return true;
    } catch (error) {
        console.error(`Error deleting course with ID ${courseId}:`, error);
        return false;
    }
}


///////////////////////////////////////////////// COURSE XXXXX /////////////////////////////////////////////////


/*
async function showEditForm(courseId) {
    const editForm = document.querySelector('#updateCourseForm');
    const nameInput = editForm.querySelector('input[name="courseName"]');
    const imageUrlInput = editForm.querySelector('input[name="courseImageUrl"]');
    const descriptionInput = editForm.querySelector('textarea[name="courseDescription"]');

    try {
        const course = await fetchCourseById(courseId);
        nameInput.value = course.courseName;
        imageUrlInput.value = course.courseImageUrl;
        descriptionInput.value = course.courseDescription;
        editForm.style.display = 'block';
    } catch (error) {
        console.error(`Error fetching course with ID ${courseId}:`, error);
        editForm.style.display = 'none';
    }

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedCourse = {
            courseName: nameInput.value,
            courseImageUrl: imageUrlInput.value,
            courseDescription: descriptionInput.value,
        };

        const success = await updateCourse(updatedCourse);

        if (success) {
            console.log(`Course with ID ${updatedCourse.courseId} updated successfully.`);
            editForm.style.display = 'none';
            await updateCoursesTable();
        } else {
            console.error(`Error updating course with ID ${updatedCourse.courseId}.`);
            editForm.style.display = 'none';
        }
    });
}
*/


/*async function updateCourse(updatedCourse) {
    try {
        const response = await fetch(`http://localhost:8080/courses/${updatedCourse.courseId}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(updatedCourse),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error(`Error updating course with ID ${updatedCourse.courseId}:`, error);
        return false;
    }
}*/




function showCreateCourseModal() {
    createCourseModal.style.display = 'block';
}


function hideEditCourseModal() {
    document.querySelector('#editCourseModal').style.display = 'none';
}


window.onload = async function () {
    await updateCoursesTable();
};
