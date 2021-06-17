/* Some funny loading messages inspired by https://gist.github.com/meain/6440b706a97d2dd71574769517e7ed32 */
const loading_messages = [
    "Loading...",
    "The server is a lemon and two electrodes. Please wait...",
    "Summoning more fact-checking elves...",
    "*elevator music*",
    "I swear it's almost done!",
    "Optimizing the optimizer...",
    "Fact-checking the facts...",
    "Patience! Detecting fake news is not easy, you know...",
    "Do you smell something burning?",
    "Initializing the initializers...",
    "Updating the updaters...",
    "What is truth really, anyway?",
    "Electrocuting the neural networks...",
    "Crunching the numbers...",
    "The AI is becoming sentient...",
    "The elves are overheating..."
];

window.onload = function () {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let url = tabs[0].url;
        chrome.tabs.sendMessage(tabs[0].id, {url: url}, function(response) {
            console.log(response.innerText);
            console.log(url);
            chrome.runtime.sendMessage({article: response.innerText, url: url}, function (response) {
                let result = response.result;

                if (isException(result)) {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('load-spinner').style.display = 'none';
                    return;
                }

                let claim_veracity = JSON.parse(result.claim_veracity);
                let score = JSON.parse(result.score);

                score = score*0.6 + claim_veracity*0.4;
                console.log(score);

                displayElements(score);
                displaySearchResults(result.search_results)

                if (score > 0.4) {
                    // Send sentence with max attention for content script for highlighting
                    maxSent = getMaxAttention(result.sentences, result.sa);
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {sentence: maxSent}, function (response) {
                        });
                    });
                }
            })
        })
    })

    function displaySearchResults(searchResults) {
        for (let i = 0; i < Math.min(5, searchResults.length); i++) {
            a = searchResults[i];
            console.log(a);
            let link = document.createElement('a');
            link.target = '_newtab';
            link.href = a.url;
            link.innerHTML = a.name;
            document.getElementById('name' + i).appendChild(link);
            document.getElementById('evidence' + i).innerHTML = a.snippet;
            document.getElementById('source' + i).innerHTML = a.displayUrl;
        }
        console.log(searchResults);
    }

    function isException(result) {
        let message;
        if (result.hasOwnProperty('exception')) {
            if (result.type === "LanguageException" || result.type === "NoTextException") {
                message = result.exception;
            } else if (result.type === "ArticleException") {
                message = "Sorry! Article could not be parsed :(";
            } else {
                message = "Something went wrong :(\nWe're working on fixing this.";
            }
            document.getElementById('output').innerText = message;
            document.getElementById('output').style.color = "grey";
            return true;
        }
        return false;
    }

    function displayElements(score) {
        if (score < 0.4) {
            document.getElementById('output').innerText = "I think this page is reliable and unbiased"
            document.getElementById('output').style.color = "green"
            document.getElementById('image').src = "../img/reliable.jpg"
        } else if (score < 0.7) {
            document.getElementById('output').innerText = "The language in this article makes me think that there may be some misinformation or bias. "
            document.getElementById('output').style.color = "orange"
            document.getElementById('image').src = "../img/warning.jpg"
        } else {
            document.getElementById('output').innerText = "The language in this article makes me think that there is a high level of misinformation or bias."
            document.getElementById('output').style.color = "red"
            document.getElementById('image').src = "../img/fake.jpg"
        }
        document.getElementById('loading').style.display = 'none';
        document.getElementById('load-spinner').style.display = 'none';
        document.getElementById('image').style.display = 'block';
        score = (Math.round(score * 100) / 100).toFixed(2);
        document.getElementById('meter-label').innerHTML = "<b>Fake News Score: " + score + "</b>";
        document.getElementById('meter').value = score;
        document.getElementById('meter').style.display = 'block';
        document.getElementById('evidence-button').style.visibility = 'visible';
        document.getElementById('explanation').style.display = 'block';
    }

    /* Loading */
    setInterval(changeText, 3000);
    function changeText() {
        document.getElementById('loading').innerText = loading_messages[Math.floor(Math.random() * loading_messages.length)];
    }

    function showEvidence() {
        let evidences = document.getElementById('evidences');
        evidences.style.display = (evidences.style.display) === 'block' ? 'none' : 'block';
        let buttonText = document.getElementById('evidence-button').innerHTML;
        document.getElementById('evidence-button').innerHTML = (buttonText === "View Evidence") ? "Hide Evidence" : "View Evidence";
    }
    document.getElementById('evidence-button').addEventListener("click", showEvidence);
}

/* Get sentence with most attention */
function getMaxAttention(sentences, attention) {
    let sentence_attention = attention.replaceAll("\n", ",").replace(/\s+/g, '').replaceAll("0.]", "0.0]");
    sentence_attention = JSON.parse(sentence_attention).flat();
    console.log(sentence_attention);
    maxSent = sentences[sentence_attention.indexOf(Math.max(...sentence_attention))];
    console.log(maxSent);
    return maxSent;
}