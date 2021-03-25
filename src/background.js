var serverhost = 'http://297ab559-9a59-4b4a-b408-049c5805e6af.uksouth.azurecontainer.io/score';
//127.0.0.1:8080
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        /*
        var url = serverhost + '/biasdet/get_prediction/?url='+ encodeURIComponent(request.article_url) ;

        console.log(url);

        fetch(url)
            .then(response => response.json())
            .then(response => sendResponse({farewell: response}))
            .catch(error => console.log(error))

        return true;  // Will respond asynchronously.

        */

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