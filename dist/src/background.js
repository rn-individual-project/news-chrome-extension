(function () {
  var $e39320be2fcaa38be67f2bda499e9371$var$serverhost = 'https://fake-news-detector.azurewebsites.net';
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    function getCSRF() {
      tokenName = "csrftoken";
      if (document.cookie && document.cookie !== "") {
        let cookies = document.cookie.split(";");
        for (let cookie in cookies) {
          cookie = jQuery.trim(cookie);
          if (cookie.substring(0, tokenName.length + 1) === tokenName + "=") {
            return decodeURIComponent(cookie.substring(tokenName.length + 1));
          }
        }
      }
      return null;
    }
    let csrftoken = getCSRF();
    const url = $e39320be2fcaa38be67f2bda499e9371$var$serverhost + '/biasdet/get_prediction/';
    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'article': request.article,
        'url': request.url,
        'csrfmiddlewaretoken': csrftoken
      })
    }).then(response => response.json()).then(response => sendResponse({
      result: response
    })).catch(error => console.log(error));
    return true;
  });
})();

//# sourceMappingURL=background.js.map
