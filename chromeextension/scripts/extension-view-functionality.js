// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Add a click event listener to the document
    document.addEventListener('click', function(event) {
        const target = event.target;

        // Check if the clicked element is a checkbox with class 'hidden-checkbox'
        if (target.matches('input.hidden-checkbox')) {
            const checkbox = target;
            const id = checkbox.getAttribute('id');

            // Find the corresponding input field or select element with the same ID
            const inputOrSelect = document.getElementById(id);

            if (inputOrSelect) {
                if (inputOrSelect.tagName === 'INPUT' && inputOrSelect.name === 'page-input') {
                    // Disable or enable the input field based on checkbox state
                    inputOrSelect.disabled = checkbox.checked;

                    // Change input field style when disabled
                    if (checkbox.checked) {
                        inputOrSelect.style.backgroundColor = '#808080'; // Grey background
                    } else {
                        inputOrSelect.style.backgroundColor = ''; // Reset background
                    }
                } else if (inputOrSelect.tagName === 'SELECT' && inputOrSelect.name === 'page-input') {
                    // Disable or enable the select field based on checkbox state
                    inputOrSelect.disabled = checkbox.checked;

                    // Additional logic specific to select elements if needed
                    if (checkbox.checked) {
                        // Add custom styling or behavior for disabled select elements
                        // Example: Change background color
                        inputOrSelect.style.backgroundColor = '#808080';
                    } else {
                        inputOrSelect.style.backgroundColor = '';
                    }
                }
            }
        }
    });
});
