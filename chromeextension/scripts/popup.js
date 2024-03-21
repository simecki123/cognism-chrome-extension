// popup.js

document.addEventListener('DOMContentLoaded', function () {
    const analyzeButton = document.getElementById('analyze-button');
    analyzeButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'detectForms' }, function (response) {
                if (response && response.formData && response.formData.length > 0) {
                    displayForms(response.formData);
                } else {
                    displayNoFormsMessage();
                }
            });
        });
    });

    function displayForms(formData) {
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = ''; // Clear previous content
        formData.forEach(formInfo => {
            const formElement = document.createElement('div');
            formElement.classList.add('form-info');
            formElement.innerHTML = `
                <div>Action: ${formInfo.action}</div>
                <div>Method: ${formInfo.method}</div>
                <div>Inputs:</div>
                <ul>
                    ${formInfo.inputs.map(input => `
                        <li>
                            Type: ${input.type}, Name: ${input.name}, Value: ${input.value}, Hidden: ${input.hidden}
                        </li>
                    `).join('')}
                </ul>
            `;
            formContainer.appendChild(formElement);
        });
    }

    function displayNoFormsMessage() {
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = '<p>No forms detected on this webpage.</p>';
    }
});
