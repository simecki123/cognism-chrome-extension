// Presenting form Data that we got from contentScript here.
document.addEventListener('DOMContentLoaded', function () {
    
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Loading animation
        showLoadingAnimation();
        chrome.tabs.sendMessage(tabs[0].id, { action: 'detectForms' }, function (response) {
            // If response is valid (formData exists)
            if (response && response.formData && response.formData.length > 0) {
                // Display forms
                displayForms(response.formData);
                //Not importannt for this project but there is functionality for button click
                checkLoginButton();
            } else {
                displayNoFormsMessage();
            }
            // Hide loading animation when content loads.
            hideLoadingAnimation();
        });
    });
});

// Show loaading animation function.
function showLoadingAnimation() {
    // Get container where this animation will be placed.
    const formContainer = document.getElementById('dot-container');
    // Create div element
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('loading-container');

    // Create three loading dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('loading-dot');
        loadingContainer.appendChild(dot);
    }
    // Apend this new container to formContainer
    formContainer.appendChild(loadingContainer);
}

// Hide loading animation
function hideLoadingAnimation() {
    // Get dot container.
    const formContainer = document.getElementById('dot-container');
    //Get loading container.
    const loadingContainer = formContainer.querySelector('.loading-container');
    // If exists remove it
    if (loadingContainer) {
        formContainer.removeChild(loadingContainer);
    }
}

// Funciton to display forms we got to the screen
function displayForms(formData) {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = ''; // Clear previous content
    // List all forms we got here
    formData.forEach(formInfo => {
        // Create div element where they will be placed.
        const formElement = document.createElement('div');
        formElement.classList.add('form-info');
        // Note that this presentation is special designed for "https://www.cognism.com/demo" and will not work same for other web pages.
        // It will create element for each of inputs from form from that cognism link icluding the hidden ones.
        // Index and name are important for enrich and hidden checkboxes.
        formElement.innerHTML = `
        <div class="page-inputs-checkbox"> 
            <label class="checkbox-input-label">Live Enrichment</label> 
            <input type="checkbox" id="checkbox-default" class="w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100"  />
        </div>
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
                            <!-- If certain input field is checkbox order it like this -->
                            <div class="page-inputs-checkbox">
                                <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" id="checkbox-default" class="w-5 h-5 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-violet-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-violet-500 checked:bg-indigo-100"  />
                                <label class="checkbox-input-label">${formInfo.labels[index+1].value}</label>
                                
                            </div>
                            ` :
                            // For input type of text and password(because in this link one input is type password) and input.name isnt 'pi_extra_field' becuse that is one extra field comments(You can easily hide it if not neded) order it like this.
                            //Under input field is hidden and enrich (trigger if Work Email) checkbox
                            ((input.type === 'text' || input.type === 'password' ) &&
                                (input.name !== 'pi_extra_field') ? 
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

                                ` : 
                                // Here is that hidden comment input field you can easily hide it if not needed.
                                (input.type === 'text') ? `

                                <div class="page-inputs">
                                    <label class="hidden-label">${formInfo.labels[index+1].value}</label>
                                    <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder}" class="coments-input block w-full max-w-xs px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-violet-500 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed" value="${input.value}" />
                                    
                                </div>
                                `:``)
                        }
                        
                        <!-- Hidden elements that appear when checkbox enrich is pressed -->
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
                            

                        </div>` : 
                        // Hidden elements that appear when trigger button is pressed.
                        ((formInfo.labels[index].value === 'Work Email' && input.type !== 'submit' && input.type !== 'checkbox' && input.value.trim() != '') ?
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
                
                <!-- SelectInput presentation chooseCountry element  -->
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
            <!-- Rest of the elements that are presented. Buttons hidden inputs textareas -->
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


// No form message function
function displayNoFormsMessage() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '<p>No forms detected on this webpage.</p>';
}



// -----------------------------------------------------------------------------------------
// Not important for this project but here it is. Check button click
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