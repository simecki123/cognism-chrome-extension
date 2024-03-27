// contentScript.js

// Function to detect forms within a document
function detectFormsInDocument(doc) {
    const forms = doc.querySelectorAll('form');
    const formData = [];
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

