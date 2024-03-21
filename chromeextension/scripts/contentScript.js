
// chrome listener that will start searching for forms when button is clicked.
// It listens to the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'detectForms') {
        const forms = document.querySelectorAll('form');
        const formData = [];
        forms.forEach(form => {
            const formInfo = {
                action: form.action,
                method: form.method,
                inputs: []
            };
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                formInfo.inputs.push({
                    type: input.type,
                    name: input.name,
                    value: input.value,
                    hidden: input.type === 'hidden'
                });
            });
            formData.push(formInfo);
        });
        sendResponse({ formData });
    }
});
