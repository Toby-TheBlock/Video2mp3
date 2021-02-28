/* © Copyright 2021, Tobias Günther, All rights reserved. */

/**
 * Ready the DOM and setup intervals/variables on the download-page.
 */
if (window.location.href.includes("https://ytmp3.cc/")) {
    setupDownloadPage();
    listenToBackground();

    var interval = setInterval(readyDownload, 1);
    setInterval(downloadVideo, 1);

    var videoURL;
}


/**
 * Hides the actual content of the host website.
 */
function setupDownloadPage() {
    let container = document.createElement("div");
    container.id = "hideContent";

    let paragraph = document.createElement("p");
    paragraph.id = "infoText";
    paragraph.innerHTML = "Starting the download...";

    container.appendChild(paragraph);
    document.body.appendChild(container);
    document.getElementsByTagName("title")[0].innerHTML = "Downloading...";
}


/**
 * Adds message listener which awaits the videoURL who's to be downloaded from the background.
 */
function listenToBackground() {
    chrome.runtime.onMessage.addListener(function(request) {
        videoURL = request.URLToInsert;
    });
}


/**
 * Provides the videoURL to the host website, and initializes the video conversion.
 */
function readyDownload() {
    if (videoURL !== "") {
        setTimeout(function() {
            document.getElementById("input").value = videoURL;
            document.getElementById("submit").click();
        }, 1000);

        clearInterval(interval);
    }
}


/**
 * Starts the download of the converted video and sends message to background finish up.
 */
function downloadVideo() {
    if (document.getElementById("buttons").hasAttribute("style")) {
        document.getElementsByTagName("a")[5].click();
        setTimeout(function() {
            chrome.runtime.sendMessage({closeTab: "."});
        }, 2000);
    }
}