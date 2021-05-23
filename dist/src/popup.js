window.onload = function () {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let url = tabs[0].url
        chrome.tabs.sendMessage(tabs[0].id, {url: url}, function(response) {
            console.log(response.innerText)
            chrome.runtime.sendMessage({article: response.innerText, url: url}, function (response) {
                let result = response.result
                let claim_veracity = JSON.parse(response.result.claim_veracity)
                let displayText
                if (result.score === "") {
                    displayText = "Sorry! Article could not be parsed :("
                } else {
                    let score = JSON.parse(result.score)
                    score = (score + (1 - claim_veracity)) / 2.0
                    console.log(score)

                    let searchResults = result.search_results
                    for (let i = 0; i < Math.min(5, searchResults.length); i++) {
                        a = searchResults[i]
                        console.log(a)
                        document.getElementById('evidence' + i).innerHTML = a.description
                        //document.getElementById('source' + i).innerText = a.
                        //document.getElementById('name' + i).innerHTML = a.name
                        let link = document.createElement('a');
                        link.target = '_newtab'
                        link.href = a.url
                        link.innerHTML = a.description
                        document.getElementById('name' + i).appendChild(link)
                    }
                    console.log(searchResults)

                    if (score < 0.5) {
                        displayText = "This page is reliable and unbiased"
                    } else {
                        sa = result.sa.replaceAll("\n", ",")
                        sa = sa.replace(/\s+/g, '')
                        sa = sa.replaceAll("0.]", "0.0]")
                        sa = JSON.parse(sa).flat();
                        console.log(sa)
                        ha = result.ha.replaceAll("\n", ",")
                        ha = ha.replace(/\s+/g, '')
                        ha = ha.replaceAll("0.]", "0.0]")
                        ha = JSON.parse(ha).flat();
                        headlineWords = result.headline.split(' ')
                        ha = ha.slice(0, headlineWords.length)
                        console.log(ha)
                        maxSent = result.sentences[sa.indexOf(Math.max(...sa))]
                        console.log(maxSent)
                        maxHeadline = headlineWords[ha.indexOf(Math.max(...ha))]

                        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, {sentence: maxSent, headline: maxHeadline}, function (response) {
                                //console.log(response.farewell);
                            });
                        });
                        if (score < 0.7) {
                            displayText = "The language in this article indicates that there may be some misinformation or bias. " +
                                "\nThe highlighted text shows the parts of the article that may be biased or may need to be verified." +
                                "\nScore: " + score
                        } else {
                            displayText = "The language in this article indicates that there is a high level of misinformation or bias." +
                                " \nThe highlighted text shows the parts of the article that are biased or may need to be verified. " +
                                "\nScore: " + score
                        }
                    }
                }
                document.getElementById('output').innerText = displayText
            })
        })
    })

}