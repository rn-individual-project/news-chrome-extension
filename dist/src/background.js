(function () {
  var $e39320be2fcaa38be67f2bda499e9371$var$serverhost = 'http://127.0.0.1:8000';
  // 127.0.0.1:8080
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === name + '=') {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    var url = $e39320be2fcaa38be67f2bda499e9371$var$serverhost + '/biasdet/get_prediction/';
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
