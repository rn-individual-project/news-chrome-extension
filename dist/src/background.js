(function () {
  var $e39320be2fcaa38be67f2bda499e9371$var$serverhost = 'http://ff12df23-38aa-4eea-86f1-11896fecbc85.uksouth.azurecontainer.io/score';
  // 127.0.0.1:8080
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    fetch($e39320be2fcaa38be67f2bda499e9371$var$serverhost, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: request.article_url
      })
    }).then(response => response.json()).then(response => sendResponse({
      farewell: response
    })).catch(error => console.log(error));
    return true;
  });
})();

//# sourceMappingURL=background.js.map
