// contentScript.js

// Function to detect forms within a document
function detectFormsInDocument(doc) {
    // Detecting all forms
    const forms = doc.querySelectorAll('form');
    // Get all form data (input fields, select fields, textareas and buttons)
    const formData = [];
    // Form structure
    forms.forEach(form => {
        const formInfo = {
            action: form.action,
            method: form.method,
            labels: [],
            inputs: [],
            selects: [],
            textareas: [],
            buttons: []
        };

        // Extract labels
        const labels = form.querySelectorAll('label');
        labels.forEach(label => {
            formInfo.labels.push({
                value: label.innerHTML
            });
        });

        // Extract inputs
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            // Check if the input is hidden
            const inputInfo = {
                name: input.name,
                placeholder: input.placeholder,
                class: input.class,
                value: input.value,
                hidden: input.type === 'hidden'
            };

            // Conditionally add type attribute if input is not hidden
            if (!inputInfo.hidden) {
                inputInfo.type = input.type;
            }

            formInfo.inputs.push(inputInfo);
        });

        

        // Extract select elements and their options
        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            const selectInfo = {
                name: select.name,
                options: []
            };

            // Extract options
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                selectInfo.options.push({
                    value: option.value,
                    text: option.textContent,
                    selected: option.selected
                });
            });

            formInfo.selects.push(selectInfo);
        });

        // Extract textareas
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            formInfo.textareas.push({
                name: textarea.name,
                placeholder: textarea.placeholder,
                class: textarea.class,
                value: textarea.value,
                hidden: textarea.type === 'hidden'
            });
        });

        // Extract buttons
        const buttons = form.querySelectorAll('button');
        buttons.forEach(button => {
            formInfo.buttons.push({
                type: button.type,
                value: button.innerHTML,
                class: button.class,
                hidden: button.type === 'hidden'
            });
        });
        
        formData.push(formInfo);
    });
    return formData;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'detectForms') {
        // Detect forms in the main document
        const formData = detectFormsInDocument(document);
        sendResponse({ formData });
    }
});

//____________________________________________________________________________________________

// Simulate a submit button click. We will trigger submit button from here.
function simulateButtonClick(inputList, textareaList, selectList) {
    // Find the button element on the webpage
    const loginButton = document.querySelector('button[type="submit"]');
  
    // Simulate a click event on the button
    if (loginButton) {
        console.log("Aktivacija pokrenuta");
      
        // Fill in input values
        inputList.forEach(inputData => {
            const inputField = document.querySelector(`input[name="${inputData.name}"]`);
            if (inputField) {
                inputField.value = inputData.value;
            }
        });
      
        // Fill in textarea values
        textareaList.forEach(textareaData => {
            const textareaField = document.querySelector(`textarea[name="${textareaData.name}"]`);
            if (textareaField) {
                textareaField.value = textareaData.value;
            }
        });
      
        // Fill in select values
        selectList.forEach(selectData => {
            const selectField = document.querySelector(`select[name="${selectData.name}"]`);
            if (selectField) {
                const option = selectField.querySelector(`option[value="${selectData.value}"]`);
                if (option) {
                    option.selected = true;
                }
            }
        });
      
        // Trigger a change event for select elements.
        const changeEvent = new Event('change', { bubbles: true });
        selectList.forEach(selectData => {
            const selectField = document.querySelector(`select[name="${selectData.name}"]`);
            if (selectField) {
                selectField.dispatchEvent(changeEvent);
            }
        });
      
        // Simulate button click after filling in the form fields
        loginButton.click();
    } else {
        console.log('Login button not found on the page.');
    }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'simulateButtonClick') {
        // Call the function to simulate button click
        simulateButtonClick(message.inputList, message.textareaList, message.selectList);
    }
});



