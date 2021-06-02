chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.url) {
            //console.log(document.body.innerText)
            //console.log("chrome extension running");
            //sentences = request.sentence.split(/\r?\n/).filter(Boolean)
            //let paras = document.body.getElementsByTagName("p")
            const url = new URL(request.url)
            let text = ""
            console.log(url.hostname)
            if (url.hostname.valueOf() === "www.bbc.co.uk") {
                console.log("BBC!")
                let articles = document.body.getElementsByTagName("article")
                for (let k = 0; k < articles.length; k++) {
                    let article = articles[k]
                    let children = article.childNodes
                    for (let i = 0; i < children.length; i++) {
                        if (children[i].tagName === "DIV") {
                            let paras = children[i].getElementsByTagName("p")
                            for (let j = 0; j < paras.length; j++) {
                                text += paras[j].innerText
                                if (!paras[j].innerText.endsWith(".")) {
                                    text += ". "
                                } else {
                                    text += " "
                                }
                            }
                        }
                    }
                }
            }
            sendResponse({innerText: text})
        }
            //console.log(paras)
/*
            for (let i = 0; i < paras.length; i++) {
                text += paras[i].innerText
                if (!paras[i].innerText.endsWith(".")) {
                    text += ". "
                } else {
                    text += " "
                }
            }
            console.log(text)
            sendResponse({innerText: text});
        }
*/
        if (request.sentence) {
            console.log("chrome extension running");

            sentences = request.sentence.split(/\r?\n/).filter(Boolean)
            console.log(sentences)
            headline = request.headline

            //h1 = document.body.getElementsByTagName("h1")[0]
            //h1.innerHTML = h1.innerText.replace(headline, `<mark>$&</mark>`)

            paras = document.body.getElementsByTagName("p")
            console.log(paras.length)
            let j;
            let i;
            for (i = 0; i < paras.length; i++) {
                paras[i].innerHTML = paras[i].innerHTML.replace(/&nbsp;/g, " ")
                for (j = 0; j < sentences.length; j++) {
                    console.log(paras[i].innerText)
                    console.log(sentences[j])
                    paras[i].innerHTML = paras[i].innerText.replace(sentences[j],
                        `<div class="tooltip" ><span class="highlight">$&</span><span class="tooltiptext">This text has been highlighted because it contains language that indicates bias or misinformation.</span>`)
                }
            }
        }
        return true;
    }
)