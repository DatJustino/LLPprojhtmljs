console.log('courses.js loaded');

const coursesTable = document.querySelector('#coursesTable');

// Function to fetch all courses
async function fetchCourses() {
    try {
        const response = await fetch('http://localhost:8080/courses');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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


////////////////////// CREATE COURSE /////////////////////////
// Function to create a new course
async function createCourse(event) {
    event.preventDefault();
    createCourseModal.style.display = 'block';
    const courseId = document.querySelector('#courseId').value;
    console.log('courseId:', courseId);
    const courseName = document.querySelector('#courseName').value;
    const courseImageUrl = document.querySelector('#courseImageUrl').value;
    const courseContent = document.querySelector('#courseContent').value;
    const course = {courseName, courseImageUrl, courseContent: courseContent};

    try {
        const response = await fetch('http://localhost:8080/courses', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(course),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Course created successfully.');
        createCourseModal.style.display = 'none';
        await fetchCourses();  // refresh the courses
        updateCoursesTable();
        window.location.reload();
    } catch (error) {
        console.error('Error creating course:', error);
    }
}



///////////////////////////////////////////////// COURSE UPDATE /////////////////////////////////////////////////
// Function to update the courses table with the fetched courses
async function updateCoursesTable() {
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
}

// Call the function to update the courses table when the page loads



///////////////////////////////////////////////// COURSE XXXXX /////////////////////////////////////////////////


function showEditForm(courseId) {
    const editForm = document.querySelector('#editForm');
    const nameInput = editForm.querySelector('input[name="courseName"]');
    const imageUrlInput = editForm.querySelector('input[name="courseImageUrl"]');
    const descriptionInput = editForm.querySelector('input[name="courseDescription"]');

    nameInput.value = courseName;
    const img = document.createElement('img');
    img.src = courseImageUrl;
    imageUrlInput.value = img.src;
    descriptionInput.value = courseDescription;
    editForm.dataset.courseId = courseId; // store the course ID on the form for later
    editForm.style.display = 'block';

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const courseId = editForm.dataset.courseId;
        const courseName = editForm.querySelector('input[name="courseName"]').value;
        const courseImageUrl = editForm.querySelector('input[name="courseImageUrl"]').value;
        const courseDescription = editForm.querySelector('input[name="courseDescription"]').value;

        const updatedCourse = {courseId, courseName, courseImageUrl, courseDescription};

        const success = await updateCourse(updatedCourse);

        if (success) {
            console.log(`Course with ID ${courseId} updated successfully.`);
            editForm.style.display = 'none';
            await updateCoursesTable();
        } else {
            console.error(`Error updating course with ID ${courseId}.`);
            editForm.style.display = 'none';
        }
    });
}


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

async function updateCourse(event) {
    const form = editCourseModal.querySelector('form');
    const courseId = form.elements['courseId'].value;
    const courseName = form.elements['courseName'].value;
    const courseImageUrl = form.elements['courseImageUrl'].value;
    const courseDescription = form.elements['courseDescription'].value;

    const course = {courseId, courseName, courseImageUrl, courseDescription};

    try {
        const response = await fetch(`http://localhost:8080/courses/${courseId}`, {
            method: 'PUT', headers: {
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


async function deleteCourse(courseId) {
    try {
        const response = await fetch(`http://localhost:8080/courses/${courseId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error(`Error deleting course with ID ${courseId}:`, error);
        return false;
    }
}


function showCreateCourseModal() {
    createCourseModal.style.display = 'block';
}


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


function hideEditCourseModal() {
    document.querySelector('#editCourseModal').style.display = 'none';
}





const editCourseModal = document.querySelector('#editCourseModal');
const createCourseButton = document.querySelector('#createCourseButton');
const createCourseModal = document.querySelector('#createCourseModal');
createCourseButton.addEventListener('click', showCreateCourseModal);
coursesTable.addEventListener('click', showEditCourseModal);
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

coursesTable.addEventListener('click', async (event) => {
    if (event.target.classList.contains('editCourseButton')) {
        const courseId = event.target.dataset.courseId;
        console.log('courseId:', courseId); // debugging
        const courses = await fetchCourses();
        console.log('courses:', courses); // debugging
        const course = courses.find(course => course.id === courseId);
        showEditCourseModal(course);
        updateCoursesTable();
    }
});

window.onload = async function () {
    await updateCoursesTable();
};
updateCoursesTable();