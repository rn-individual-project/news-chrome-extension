window.onload = function(){

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let article_url = tabs[0].url
            console.log(article_url)
            if (article_url) {
                chrome.runtime.sendMessage(
                    {article_url: article_url},
                    function (response) {
                        result = response.farewell;
                        let displayText
                        score = JSON.parse(result.score)
                        console.log(score)
                        if (score < 0.6) {
                            displayText = "This page is reliable and unbiased"
                        } else {
                            attention = result.attention.replaceAll("\n", ",")
                            attention = attention.replace(/\s+/g, '')
                            attention = attention.replaceAll("0.]", "0.0]")
                            attention = JSON.parse(attention).flat();
                            max = attention.indexOf(Math.max(...attention))
                            console.log(result.sentences)
                            maxSent = result.sentences[max]
                            console.log(maxSent)
                            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {sentence: maxSent}, function (response) {
                                    console.log(response.farewell);
                                });
                            });
                            if (score < 0.7) {
                                displayText = "This page may contain some misinformation or bias. \nThe highlighted text shows claims that are biased or may need to be verified."
                            } else {
                                displayText = "This page contains a high level of misinformation or bias. \nThe highlighted text shows claims that are biased or may need to be verified."
                            }
                        }
                        //displayText = (result.score > 0) ? ("This article is biased. Score: " + result.score) : ("This article is unbiased. Score: " + result.score)
                        document.getElementById('output').innerText = displayText
                    });
            }

        });
    };