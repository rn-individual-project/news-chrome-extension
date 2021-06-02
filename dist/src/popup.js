const text = [
    "Loading...",
    "The server is a lemon and two electrodes. Please wait...",
    "Is this Windows?",
    "Summoning more fact-checking elves...",
    "*elevator music*",
    "I swear it's almost done!",
    "Optimizing the optimizer...",
    "Fact-checking the facts...",
    "Patience! Detecting fake news is not easy, you know...",
    "Discovering witty loading messages...",
    "Do you smell something burning?",
    "Hacking into the mainframe...",
    "\"Don't believe everything you read on the internet\" - William Shakespeare",
    "\"If it's online then it must be true!\" - Genghis Khan",
    "Bob, our fake news detector is on holiday today...",
    "Initializing the initializers...",
    "Updating the updaters...",
    "What is truth really, anyway?",
    "Electrocuting the neural networks..."
];

window.onload = function () {

    setInterval(changeText, 3000)
    function changeText() {
        document.getElementById('loading').innerText = text[Math.floor(Math.random() * text.length)];
    }

    function showEvidence() {
        let evidences = document.getElementById('evidences')
        evidences.style.display = (evidences.style.display) === 'block' ? 'none' : 'block'
        let buttonText = document.getElementById('evidence-button').innerText
        document.getElementById('evidence-button').innerText = (buttonText === "View Evidence") ? "Hide Evidence" : "View Evidence"
    }
    document.getElementById('evidence-button').addEventListener("click", showEvidence)

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let url = tabs[0].url
        chrome.tabs.sendMessage(tabs[0].id, {url: url}, function(response) {
            console.log(response.innerText)
            console.log(url)
            chrome.runtime.sendMessage({article: response.innerText, url: url}, function (response) {
                document.getElementById('loading').style.display = 'none'
                document.getElementById('evidence-button').style.display = 'inline-block'
                document.getElementById('explanation').style.display = 'block'
                let result = response.result
                let claim_veracity = JSON.parse(response.result.claim_veracity)
                let score = JSON.parse(result.score)
                let displayText
                let color
                let image_src
                if (score === "") {
                    displayText = "Sorry! Article could not be parsed :("
                    color = "grey"
                } else {
                    score = score*0.7 + (1 - claim_veracity)*0.3
                    console.log(score)

                    let searchResults = result.search_results
                    for (let i = 0; i < Math.min(5, searchResults.length); i++) {
                        a = searchResults[i]
                        console.log(a)
                        let link = document.createElement('a');
                        link.target = '_newtab'
                        link.href = a.url
                        link.innerHTML = a.name
                        document.getElementById('name' + i).appendChild(link)
                        document.getElementById('evidence' + i).innerHTML = a.snippet
                        document.getElementById('source' + i).innerHTML = a.displayUrl
                        //document.getElementById('source' + i).innerText = a.
                        //document.getElementById('name' + i).innerHTML = a.name
                    }
                    console.log(searchResults)

                    if (score < 0.5) {
                        displayText = "This page is reliable and unbiased"
                        color = "green"
                        image_src = "../img/reliable.jpg"
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
                            displayText = "The language in this article indicates that there may be some misinformation or bias. "
                            color = "orange"
                            image_src = "../img/warning.jpg"
                        } else {
                            displayText = "The language in this article indicates that there is a high level of misinformation or bias."
                            color = "red"
                            image_src = "../img/fake.jpg"
                        }
                    }
                }
                document.getElementById('image').style.display = 'block'
                document.getElementById('image').src = image_src
                document.getElementById('meter-label').innerText = "Score: " + score
                document.getElementById('meter').value = score
                document.getElementById('meter').style.display = 'block'
                document.getElementById('output').innerText = displayText
                document.getElementById('output').style.color = color
            })
        })
    })

}