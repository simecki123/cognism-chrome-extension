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
            hiddenInputs: [],
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
                formInfo.inputs.push(inputInfo);
            } else {
               
                // Save hidden inputs in hidden Input array.
                formInfo.hiddenInputs.push(inputInfo);
            }

            
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
// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'detectForms') {
        // Detect forms in the main document
        let formData = detectFormsInDocument(document);
        
        if (formData.length < 1) {
            console.log("No forms found in this document. Fetching from external HTML document...");
            const links = searchForIframes(document);
            
            
            // Request HTML document from background script
            chrome.runtime.sendMessage({ action: 'fetchHtmlDocument', link: "https://go.cognism.com/l/488621/2022-05-30/cr6s2s" }, response => {
                const { htmlDocument } = response;
                

                // Parse the received HTML document and detect forms
                const parser = new DOMParser();
                const iframeDoc = parser.parseFromString(htmlDocument, 'text/html');
                
                formData = detectFormsInDocument(iframeDoc);

                console.log('Detected forms in external HTML document:', formData);
                sendResponse({ formData }); // Send the updated formData back synchronously
            });

            // Return true to indicate that sendResponse will be called asynchronously
            return true;
        } else {
            // Send the existing formData synchronously
            sendResponse({ formData });
        }
    }
});


function searchForIframes(doc) {
    const iframes = doc.querySelectorAll('iframe');
    const srcs = [];

    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        
        // Check if the iframe has a valid contentDocument
        if (iframe.contentDocument && iframe.contentDocument.documentElement.tagName.toLowerCase() === 'html') {
            const iframeDoc = iframe.contentDocument;
            const iframeSrc = iframe.src;

            // Collect the src attribute of the iframe
            srcs.push(iframeSrc);

            // Optionally, you can further process the iframeDoc here if needed
            console.log('Found iframe with loaded document. Src:', iframeSrc);
        }
    }

    return srcs;
}




//____________________________________________________________________________________________

// Simulate a submit button click. We will trigger submit button from here.
function simulateButtonClick(inputList, textareaList, selectList) {
    // Find the button element on the webpage
    const loginButton = document.querySelector('button[type="submit"]');
    
  
    // Simulate a click event on the button
    if (loginButton) {
        console.log("Aktivacija pokrenuta");
      
        // Fill in input values
        // Selects all input fields inside a form element
        const formInputFields = document.querySelectorAll('form input');
        if(formInputFields){
            for (i = 0; i < formInputFields.length; i++){
                formInputFields[i].value = inputList[i].value;
            }
        }
        
        
     // Fill in textarea values
      const formTextAreaFields = document.querySelectorAll('form textarea');
      if(formTextAreaFields){
        for (i = 0; i < formTextAreaFields.length; i++){
            formTextAreaFields[i].value = textareaList[i].value;
          }
      }
      
        
        
      const formselectedField = document.querySelectorAll('form select');
      if(formselectedField){

      }
        
      // Fill in select values
        selectList.forEach(selectData => {
            const formSelectField = document.querySelector('form ' + selectData.selector); // Assumes selector in selectData object
            if (formSelectField) {
                const option = formSelectField.querySelector('option[value="' + selectData.value + '"]'); // Assumes value property in selectData object
                if (option) {
                    option.selected = true;
                }
            }
        });

        // Trigger a change event for select elements.
        const changeEvent = new Event('change', { bubbles: true });
        selectList.forEach(selectData => {
            const formSelectField = document.querySelector('form ' + selectData.selector); // Assumes selector in selectData object
            if (formSelectField) {
                formSelectField.dispatchEvent(changeEvent);
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