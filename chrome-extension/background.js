chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchPdf') {
        fetch(request.url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/pdf, */*'
            }
        })
        .then(response => response.arrayBuffer())
        .then(data => sendResponse({ success: true, data: Array.from(new Uint8Array(data)) }))
        .catch(error => sendResponse({ success: false, error: error.message }));
        
        return true; // Indica que responderemos assincronamente
    }
});
