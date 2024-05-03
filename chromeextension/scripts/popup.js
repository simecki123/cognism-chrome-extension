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
                                <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" id="checkbox-default" class="w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100"  />
                                <label class="checkbox-input-label">${formInfo.labels[index+1].value}</label>
                                
                            </div>
                            ` :
                            ((input.type === 'text' || input.type === 'password' ) &&
                                (input.value !== '') ? 
                                `
                                <div class="page-inputs>
                                    <label class="input-label">${formInfo.labels[index].value}</label>
                                    <input type="${input.type}" name="page-input" id="${index}" placeholder="${input.placeholder}" class=" block w-full max-w-xs px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-violet-500 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed" value="${input.value}" />
                                    <div class="page-inputs">
                                    ${formInfo.labels[index].value === 'Work Email' ? `
                                        <div class="enrich-hidden-container">
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" id="checkbox-default" class=" hidden-checkbox w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100"  type="checkbox" />
                                                <label class="hidden-label">Hidden</label>
                                            </div>
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" id="checkbox-default" class=" hidden-checkbox w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100"  type="checkbox" type="checkbox" />
                                                <label class="hidden-label">Trigger</label>
                                            </div>
                                        </div>
                                    `:
                                    `
                                        <div class="enrich-hidden-container">
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" id="checkbox-default" class=" hidden-checkbox w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"  type="checkbox" type="checkbox" />
                                                <label class="hidden-label">Hidden</label>
                                            </div>
                                            <div class="enrich-hidden-container">
                                                <input name="user-input" id="${index}" id="checkbox-default" class=" hidden-checkbox w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100"  type="checkbox" type="checkbox" />
                                                <label class="hidden-label">Enrich</label>
                                            </div>
                                        </div>
                                    `
                                    }
                                    
                                </div>
                                </div>
                                ` : (input.type === 'text') ? `

                                <div class="page-inputs">
                                    <label class="hidden-label">${formInfo.labels[index+1].value}</label>
                                    <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="coments-input block w-full max-w-xs px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-violet-500 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed" value="${input.value}" />
                                    
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
                            <input hidden="hidden" name="user-option-input" id="${index}" type="checkbox" id="checkbox-default" class="user-checkbox" />
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
                        <input hidden="hidden" name="user-option-input" id="${index}" type="checkbox" id="checkbox-default" class="user-checkbox" />
                        <label hidden="hidden" name="user-option-input" id="${index}" class="question-label">Fallback to domain </label>
                        

                    </div>
                        `: ``)
                    }
                    </div>
                `).join('')}

                <div class="inputs">
                        ${formInfo.selects.map((select, index) => `
                        <div class="page-inputs">
                            <div class="page-inputs">
                                <select hidden="hidden" name="page-input" id="100" name="${select.name}" class="h-auto border border-violet-500 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none">
                                    ${select.options.map(option => `
                                        <option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="page-inputs">
                                    <div class="enrich-hidden-container">
                                        <div class="enrich-hidden-container">
                                            <input name="user-input" id="100" id="checkbox-default" class=" hidden-checkbox w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100" type="checkbox" />
                                            <label class="hidden-label">Hidden</label>
                                        </div>
                                        <div class="enrich-hidden-container">
                                            <input name="user-input" id="100" id="checkbox-default" class=" hidden-checkbox w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100" type="checkbox" />
                                            <label class="hidden-label">Enrich</label>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        
                        <div class= "additional-user-fields">
                            <select hidden="hidden" name="user-option-input" id="100" class="user-select-option ">
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
            
            <hr />
            <div class="action-div">Hidden Inputs:</div>
            <ul>
                ${formInfo.hiddenInputs.map((input, index) => `
                    <div class="inputs">
                        <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="block w-full max-w-xs px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-violet-500 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed" value="${input.value}" />
                    </div>
                `).join('')}
            </ul>

            <div class="action-div">Textareas:</div>
            <ul>
                ${formInfo.textareas.map(textarea => `
                    <textarea name="${textarea.name}" placeholder="${textarea.placeholder}" class="block w-full max-w-xs h-40 px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-2xl placeholder-gray-400 focus:outline-none resize-none leading-relaxed">${textarea.value}</textarea>
                `).join('')}
            </ul>

            <div class="action-div">Buttons:</div>
            <ul>
                ${formInfo.buttons.map(button => `
                    <div class="button-div">
                        <button type="${button.type}" class="py-2.5 px-6 text-sm bg-indigo-500 text-white rounded-lg cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-700">${button.value}</button>
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