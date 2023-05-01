console.log("We are in Script.js")
function handleFormSubmission(e, formName) {
    e.preventDefault();

    if (formName === 'login') {
        // Login form submission logic
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(`Email: ${email}, Password: ${password}`);
        // Call your login API here
    } else if (formName === 'register') {
        // Register form submission logic
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(`Email: ${email}, Password: ${password}`);
        // Call your register API here

    }
    document.getElementById('loginButton').addEventListener('click', (e) => {
        handleFormSubmission(e, 'login');
    });

    document.getElementById('registerButton').addEventListener('click', (e) => {
        handleFormSubmission(e, 'register');
    });

    document.getElementById('createCustomerButton').addEventListener('click', (e) => {
        handleFormSubmission(e, 'createCustomer');
    });

    async function fetchData(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching data from API');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
    function displayData(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.id}: ${item.name} (${item.email})`;
            container.appendChild(listItem);
        });
    }
    window.addEventListener('DOMContentLoaded', async () => {
        const data = await fetchData('https://localhost:8080/customers');
        if (data) {
            displayData(data, 'customerList');
        }
    });

    async function submitForm(url, formData) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error submitting form data to API');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
    async function handleLoginForm(event) {
        event.preventDefault();

        const formData = {
            email: event.target.email.value,
            password: event.target.password.value
        };

        const data = await submitForm('https://localhost:8080/login', formData);
        if (data && data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html'; // Redirect to dashboard
        } else {
            alert('Login failed. Please try again.');
        }
    }

    async function handleRegistrationForm(event) {
        event.preventDefault();

        const formData = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value
        };

        const data = await submitForm('https://localhost:8080/register', formData);
        if (data && data.message) {
            alert('Registration successful! You can now log in.');
            window.location.href = '/login.html'; // Redirect to login page
        } else {
            alert('Registration failed. Please try again.');
        }
    }

}
