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
            buttons: []
        };

        const labels = form.querySelectorAll('label');
        labels.forEach(label => {
            formInfo.labels.push({
                value: label.innerHTML
            });
        });

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            formInfo.inputs.push({
                type: input.type,
                name: input.name,
                placeholder: input.placeholder,
                class: input.class,
                value: input.value,
                hidden: input.type === 'hidden'
            });
        });

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
        let targetIframe = null;

        // Iterate through all iframes on the page
        const iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            // Check if the iframe's contentDocument is an HTML document
            if (iframe.contentDocument && iframe.contentDocument.documentElement.tagName.toLowerCase() === 'html') {
                console.log("Html je u ovom iframeu...")
                // Check if the iframe's document contains at least one form
                //Cant find form for some reason...
                const formsInIframe = iframe.contentDocument.body.querySelectorAll('form');
                
                if (formsInIframe.length > 0) {
                    
                    // If found, set it as the target iframe
                    targetIframe = iframe;
                    break;
                }
            }
        }

        if (targetIframe) {
            console.log("Target iframe found.");
            // Detect forms within the target iframe's document
            const formData = detectFormsInDocument(targetIframe.contentDocument);
            sendResponse({ formData });
        } else {
            console.log("No target iframe found.");
            // If no target iframe found, detect forms in the main document
            const formData = detectFormsInDocument(document);
            sendResponse({ formData });
        }
    }
});
