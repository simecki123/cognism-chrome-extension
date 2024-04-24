
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchHtmlDocument') {
        const link = message.link;

        fetch(link)
            .then(response => response.text())
            .then(html => {
                sendResponse({ htmlDocument: html });
            })
            .catch(error => {
                console.error('Error fetching HTML document:', error);
                sendResponse({ htmlDocument: null }); // Send null if fetch fails
            });

        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});
