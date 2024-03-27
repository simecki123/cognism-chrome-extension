//popup.js

//When button is clicked start searching for forms.
// It activates chrome listener that is in contentScript.js
document.addEventListener('DOMContentLoaded', function () {
    const analyzeButton = document.getElementById('analyze-button');
    analyzeButton.addEventListener('click', function () {
        // Make popup.html a bit wider.
        document.body.style.width = "300px";
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'detectForms' }, function (response) {
                //Check if there if any form to show
                if (response && response.formData && response.formData.length > 0) {
                    // Display form
                    displayForms(response.formData);
                    // Define submit button
                    checkLoginButton();
                } else {
                    // There is nothing to be shown.
                    displayNoFormsMessage();
                }
            });
        });
    });

// Displaying all detected forms in shape of the html elements.
function displayForms(formData) {
    // get container that is defined in popup.html. In that container we will put our elements.
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = ''; // Clear previous content
    formData.forEach(formInfo => {
        const formElement = document.createElement('div');
        formElement.classList.add('form-info');
        formElement.innerHTML = `
            <hr class="big-hr" />
            <div class="action-div">Action: ${formInfo.action}</div>
            <hr />
            <div class="action-div">Method: ${formInfo.method}</div>
            <hr />
        
            <div class="action-div">Labels:</div>
            <ul>
                ${formInfo.labels.map(label => `
                    <div class="label-name">
                        <label>${label.value}</label>
                    </div>
                `).join('')}
            </ul>
            <hr />

            <div class="action-div">Inputs:</div>
            <ul>
                ${formInfo.inputs.map((input, index) => `
                
                    <div class="inputs">
                        <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="${input.class}" value="${input.value}" ></input>
                        
                    </div>
                    
                `).join('')}
            </ul>

            <div class="action-div">Selects:</div>
            <ul>
                ${formInfo.selects.map(select => `
                    <div class="selects">
                        <select name="${select.name}" class="${select.class}">
                            ${select.options.map(option => `
                                <option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>
                            `).join('')}
                        </select>
                    </div>
                `).join('')}
            </ul>

            <div class="action-div">Textareas:</div>
            <ul>
                ${formInfo.textareas.map(textarea => `
                    <textarea name="${textarea.name}" placeholder="${textarea.placeholder}" class="${textarea.class}">${textarea.value}</textarea>
                `).join('')}
            </ul>
            <hr />

            <div class="action-div">Buttons: </div>
            <ul>
                ${formInfo.buttons.map(button => `
                    <div class="button-div">
                        <button type="${button.type}" class="${button.class}">${button.value}</button>
                    </div>  
                    
                `).join('')}
            </ul>

        `;
        formContainer.appendChild(formElement);
    });
}

    

// Simple function that appears when there is no form on page
function displayNoFormsMessage() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '<p>No forms detected on this webpage.</p>';
}
});


// Define button for logging in.
function checkLoginButton() {
    //There can be multiple forms and multiple submit buttons on one page
    const loginButtons = document.querySelectorAll('button[type="submit"]');
    // Check if there is any button
    if (loginButtons.length === 0) {
        console.log("Login button not found.");
    } else {
        console.log(loginButtons);
        //For each button we need to add listener for it.
        loginButtons.forEach(loginButton => {
            loginButton.addEventListener('click', function () {
                console.log("Button clicked...");
                // Create lists of all inputs, textareas, and selects
                const inputList = [];
                const textareaList = [];
                const selectList = [];
                
                // Get all values from inputs in special list.
                const formData = document.querySelectorAll('.form-info');
                formData.forEach(formInfo => {
                    formInfo.querySelectorAll('input').forEach(input => {
                        inputList.push({ name: input.name, value: input.value });
                    });
                    formInfo.querySelectorAll('textarea').forEach(textarea => {
                        textareaList.push({ name: textarea.name, value: textarea.value });
                    });
                    formInfo.querySelectorAll('select').forEach(select => {
                        selectList.push({ name: select.name, value: select.options[select.selectedIndex].value });
                    });
                });

                // Send a message to the content script to simulate button click
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'simulateButtonClick', inputList, textareaList, selectList });
                });
            });
        });
    }
}



