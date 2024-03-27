//popup.js

//When button is clicked start searching for forms.
// It activates chrome listener that is in contentScript.js
document.addEventListener('DOMContentLoaded', function () {
    const analyzeButton = document.getElementById('analyze-button');
    analyzeButton.addEventListener('click', function () {
        document.body.style.width = "300px";
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

// Declare labelCount outside of the displayForms function

function displayForms(formData) {
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
                        <input type="" name="${input.name}" placeholder="${input.placeholder}" class="${input.class}" value="${input.value}" ></input>
                        
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
