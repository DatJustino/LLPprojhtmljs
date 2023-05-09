console.log('commissions.js loaded');

const createCommissionForm = document.querySelector('#create-commission-form');

createCommissionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(createCommissionForm);
    const commission = Object.fromEntries(formData.entries());

    fetch('http://localhost:8080/commissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commission)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response data as needed
        })
        .catch(error => console.error(error));
});