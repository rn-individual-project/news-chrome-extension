chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("here")
        if (request.sentence) {
            console.log("chrome extension running");
            sentences = request.sentence.split(/\r?\n/)
            sentence = sentences[0]
            paras = document.body.getElementsByTagName("p")
            for (i = 0; i < paras.length; i ++) {
                paras[i].innerHTML = paras[i].innerText.replace(sentence, `<mark>$&</mark>`)
            }
            //document.body.innerHTML = document.body.innerHTML.replace(request.sentence, `<mark>$&</mark>`)
            sendResponse({farewell: "goodbye"});
        }
        return true;
    }
)