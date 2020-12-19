/* © Copyright 2020, Tobias Günther, All rights reserved. */

if (window.location.href.includes("https://ytmp3.cc/")) {
    setupDownloadPage();
    downloadVideo();
}


/**
 * Hides the actual content of the host website.
 */
function setupDownloadPage() {
    document.getElementsByTagName("title")[0].innerHTML = "Downloading...";

    let container = document.createElement("div");
    container.id = "hideContent";

    let paragraph = document.createElement("p");
    paragraph.id = "infoText";
    paragraph.innerHTML = "Starting the download...";

    container.appendChild(paragraph);
    document.body.appendChild(container);
}


/**
 * Listens for a message from the backend containing the video-url to download.
 * Once the url is received start the conversion and download of the mp3.
 */
function downloadVideo() {
    chrome.runtime.onMessage.addListener(function(request) {
        document.getElementById("input").value = request.URLToInsert;
        document.getElementById("submit").click();

        setTimeout(function() {
            document.getElementsByTagName("a")[5].click();
            setTimeout(function() {
                chrome.runtime.sendMessage({closeTab: "."});
            }, 1000);
        }, 1000);
    });
}
