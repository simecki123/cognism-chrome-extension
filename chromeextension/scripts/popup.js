document.addEventListener('DOMContentLoaded', function () {
    
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'detectForms' }, function (response) {
            if (response && response.formData && response.formData.length > 0) {
                displayForms(response.formData);
                checkLoginButton();
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
            <hr class="big-hr" />
            <div class="action-method-container">
                <div class="action-container">
                    <p>Action:</p>
                    <p><a href="${formInfo.action}">${formInfo.action}</a></href>
                </div>
                <div class="method-container">
                    <p>Method:</p>
                    <p>${formInfo.method}</p>
                </div>
            </div>
            <hr />
        
            

            <div class="action-div">Inputs:</div>
            <ul>
                ${formInfo.inputs.map((input, index) => `
                    <div class="inputs">
                        ${input.type === 'checkbox' ? 
                            `
                            <div class="page-inputs-checkbox">
                                <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="page-checkbox" value="${input.value}" />
                                <label class="checkbox-input-label">${formInfo.labels[index+1].value}</label>
                                
                            </div>
                            ` :
                            ((input.type === 'text' || input.type === 'password' ) &&
                                (input.value !== '') ? 
                                `
                                <div class="page-inputs>
                                    <label class="input-label">${formInfo.labels[index].value}</label>
                                    <input type="${input.type}" name="page-input" id="${index}" placeholder="${input.placeholder}" class="page-input" value="${input.value}" />
                                    <div class="page-inputs">
                                    ${formInfo.labels[index].value === 'Work Email' ? `
                                        <div class="enrich-hidden-container">
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" class="hidden-checkbox" type="checkbox" />
                                                <label class="hidden-label">Hidden</label>
                                            </div>
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" class="hidden-checkbox" type="checkbox" />
                                                <label class="hidden-label">Trigger</label>
                                            </div>
                                        </div>
                                    `:
                                    `
                                        <div class="enrich-hidden-container">
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" class="hidden-checkbox" type="checkbox" />
                                                <label class="hidden-label">Hidden</label>
                                            </div>
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" class="hidden-checkbox" type="checkbox" />
                                                <label class="hidden-label">Enrich</label>
                                            </div>
                                        </div>
                                    `
                                    }
                                    
                                </div>
                                </div>
                                ` : (input.type === 'text') ? `

                                <div class="page-inputs">
                                    <label class="input-label">${formInfo.labels[index+1].value}</label>
                                    <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="page-input" value="${input.value}" />
                                    
                                </div>
                                `:``)
                        }
                        

                        ${ formInfo.labels[index].value !== 'Work Email' && input.type !== 'submit' && input.type !== 'checkbox' && input.value.trim() != '' ? `
                        <div class= "additional-user-fields">
                            <select hidden="hidden" name="user-option-input" id="${index}" class="user-select-option">
                                <option value="company-name">Company Name</option>
                                <option value="company-email">Company Email</option>
                                <option value="company-website">Company Website</option>
                                <option value="company-industry">Company Industry</option>
                                <option value="company-revenue">Company Revenue</option>
                                <option value="job-title">Job Title</option>
                                <option value="seniority">Seniority</option>
                                <option value="department">Department</option>
                                <option value="ip-country">IP Country</option>
                                <option value="ip-state">IP State</option>
                                <option value="ip-city">IP City</option>
                                <option value="sales-headcount">Sales Headcount</option>
                                <option value="marketing-automation">Using Marketing Automation Tool</option>
                                <option value="sales-automation">Using Sales Automation Tool</option>
                                <option value="crm">Using CRM</option>
                            </select>
                            <input hidden="hidden" name="user-option-input" id="${index}" type="checkbox" class="user-checkbox" />
                            <label hidden="hidden" name="user-option-input" id="${index}" class="question-label">Show if not matched</label>
                            

                        </div>` : ((formInfo.labels[index].value === 'Work Email' && input.type !== 'submit' && input.type !== 'checkbox' && input.value.trim() != '') ?
                        `
                        <div class= "additional-user-fields">
                        <select hidden="hidden" name="user-option-input" id="${index}" class="user-select-option">
                            <option value="company-name">Company Name</option>
                            <option value="company-email">Company Email</option>
                            <option value="company-website">Company Website</option>
                            <option value="company-industry">Company Industry</option>
                            <option value="company-revenue">Company Revenue</option>
                            <option value="job-title">Job Title</option>
                            <option value="seniority">Seniority</option>
                            <option value="department">Department</option>
                            <option value="ip-country">IP Country</option>
                            <option value="ip-state">IP State</option>
                            <option value="ip-city">IP City</option>
                            <option value="sales-headcount">Sales Headcount</option>
                            <option value="marketing-automation">Using Marketing Automation Tool</option>
                            <option value="sales-automation">Using Sales Automation Tool</option>
                            <option value="crm">Using CRM</option>
                        </select>
                        <input hidden="hidden" name="user-option-input" id="${index}" type="checkbox" class="user-checkbox" />
                        <label hidden="hidden" name="user-option-input" id="${index}" class="question-label">Fallback to domain</label>
                        

                    </div>
                        `: ``)
                    }
                    </div>
                `).join('')}

                <div class="inputs">
                        ${formInfo.selects.map((select, index) => `
                        <div class="page-inputs">
                            <div class="page-inputs">
                                <select name="page-input" id="100" name="${select.name}" class="page-input">
                                    ${select.options.map(option => `
                                        <option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="page-inputs">
                                    <div class="enrich-hidden-container">
                                        <div class="enrich-hidden-container">
                                            <input name="user-input" id="100" class="hidden-checkbox" type="checkbox" />
                                            <label class="hidden-label">Hidden</label>
                                        </div>
                                        <div class="enrich-hidden-container">
                                            <input name="user-input" id="100" class="hidden-checkbox" type="checkbox" />
                                            <label class="hidden-label">Enrich</label>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        
                        <div class= "additional-user-fields">
                            <select hidden="hidden" name="user-option-input" id="100" class="user-select-option">
                                <option value="company-name">Company Name</option>
                                <option value="company-email">Company Email</option>
                                <option value="company-website">Company Website</option>
                                <option value="company-industry">Company Industry</option>
                                <option value="company-revenue">Company Revenue</option>
                                <option value="job-title">Job Title</option>
                                <option value="seniority">Seniority</option>
                                <option value="department">Department</option>
                                <option value="ip-country">IP Country</option>
                                <option value="ip-state">IP State</option>
                                <option value="ip-city">IP City</option>
                                <option value="sales-headcount">Sales Headcount</option>
                                <option value="marketing-automation">Using Marketing Automation Tool</option>
                                <option value="sales-automation">Using Sales Automation Tool</option>
                                <option value="crm">Using CRM</option>
                            </select>
                            <input hidden="hidden" name="user-option-input" id="100" type="checkbox" class="user-checkbox" />
                            <label hidden="hidden" name="user-option-input" id="100" class="question-label">Show if not matched</label>
                            
                        </div>

                    `).join('')}
                </div>

                
            </ul>

            <div class="action-div">Hidden Inputs:</div>
            <ul>
                ${formInfo.hiddenInputs.map((input, index) => `
                    <div class="inputs">
                        <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="hidden-inputs" value="${input.value}" />
                    </div>
                `).join('')}
            </ul>

            <div class="action-div">Textareas:</div>
            <ul>
                ${formInfo.textareas.map(textarea => `
                    <textarea name="${textarea.name}" placeholder="${textarea.placeholder}" class="${textarea.class}">${textarea.value}</textarea>
                `).join('')}
            </ul>

            <div class="action-div">Buttons:</div>
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



function displayNoFormsMessage() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '<p>No forms detected on this webpage.</p>';
}

function checkLoginButton() {
    const loginButtons = document.querySelectorAll('button[type="submit"]');
    if (loginButtons.length === 0) {
        console.log("Login button not found.");
    } else {
        loginButtons.forEach(loginButton => {
            loginButton.addEventListener('click', function () {
                const inputList = [];
                const textareaList = [];
                const selectList = [];
                
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

                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'simulateButtonClick', inputList, textareaList, selectList });
                });
            });
        });
    }
}