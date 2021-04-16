chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("here")
        if (request.sentence) {
            console.log("chrome extension running");
            sentences = request.sentence.split(/\r?\n/).filter(Boolean)
            paras = document.body.getElementsByTagName("p")
            j = 0
            for (i = 0; i < paras.length; i++) {
                if (j >= sentences.length) break;
                paras[i].innerHTML = paras[i].innerText.replace(sentences[j], `<mark>$&</mark>`)
                if (paras[i].innerText.includes(sentences[j])) j++;
            }
            sendResponse({farewell: "goodbye"});
        }
        return true;
    }
)