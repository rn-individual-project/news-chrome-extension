var serverhost = 'http://localhost:45519/score';
//127.0.0.1:8080
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        fetch(serverhost, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url : request.article_url})
        })
            .then(response => response.json())
            .then(response => sendResponse({ farewell: response}))
            .catch(error => console.log(error))

        return true

    });