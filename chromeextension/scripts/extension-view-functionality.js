// Wait for the document to fully load
// Logic of this code is this:
// There are 2 types of checkboxes (hidden-checkbox and Enrich or trigger checkboxes).
// There are more of them so we have 2 conditions id and label name
// One type of checkboxes is for making element with same id and certain name disabled.
// Same way it goes for checkboxes that make elements with same id and certain name visible or invisible.
document.addEventListener('DOMContentLoaded', function() {
    // Add a click event listener to the document
    document.addEventListener('click', function(event) {
        const target = event.target;

        // Check if the clicked element is a checkbox with class 'hidden-checkbox'
        if (target.matches('input.hidden-checkbox')) {
            const checkbox = target;
            const id = checkbox.getAttribute('id');
            const label = checkbox.nextElementSibling; // Get the label next to the checkbox

            // Check the label text to determine the type of checkbox
            if (label.textContent.trim() === 'Hidden') { // Only proceed if the label is "Hidden"
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
                // This part is for functionality of Enrich and Trigger checkboxes.
            } else if (label.textContent.trim() === 'Enrich' || label.textContent.trim() === 'Trigger') { // Proceed if label is "Enrich" or "Trigger"
                console.log('finding enrich buttons');
                // Take elements with certain name and id.
                const user_select = document.querySelectorAll(`[name="user-option-input"][id="${id}"]`);
                
                // Check if user select is there.
                if (user_select) {
                    console.log('conditions right');
                    if (checkbox.checked) {
                        console.log('checked-visible');
                        for(let i = 0; i < user_select.length; i++){
                            user_select[i].removeAttribute('hidden'); // Make element visible.
                            user_select[i].classList.remove('slow-disappear'); // Ensure the disappearing animation class is removed
                            user_select[i].classList.add('slow-appear'); // Add the appearing animation class
                            
                        }
                        
                    } else {
                        console.log('checked-invisible')
                        for(let i = 0; i < user_select.length; i++){
                            user_select[i].classList.remove('slow-appear'); // Remove the appearing animation class
                            user_select[i].classList.add('slow-disappear'); // Add the disappearing animation class
                            setTimeout(() => {
                                user_select[i].setAttribute('hidden', 'hidden');
                            }, 500); // Delay setting 'hidden' attribute to match animation duration
                            
                        }
                    }
                } else {
                    console.log('not there')
                }
            }
        }
    });
});


