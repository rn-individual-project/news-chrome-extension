$(function(){


    $('#keywordsubmit').click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let article_url = tabs[0].url
            console.log(article_url)
            if (article_url) {
                chrome.runtime.sendMessage(
                    {article_url: article_url},
                    function (response) {
                        result = response.farewell;
                        console.log(result.score);
                        displayText = (result.score > 0) ? ("This article is biased. Score: " + result.score) : ("This article is unbiased. Score: " + result.score)
                        document.getElementById('output').innerText = displayText
                    });
            }

        });
    });
});