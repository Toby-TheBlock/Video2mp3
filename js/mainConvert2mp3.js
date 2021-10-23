/* © Copyright 2021, Tobias Günther, All rights reserved. */

/**
 * Ready the DOM and setup intervals/variables on the download-page.
 */
if (window.location.href.includes("https://ytop1.com/")) {
    setupDownloadPage();
    listenToBackground();

    var interval = setInterval(readyDownload, 100);
    setInterval(downloadVideo, 100);
    setInterval(removeAds, 10);
    var videoURL;
}


/**
 * Starts the download of the converted video and sends message to background finish up.
 */
function downloadVideo() {
    let downloadBtn = document.getElementById("btnDown");

    if (typeof downloadBtn !== "undefined" && downloadBtn !== null) {
        downloadBtn.click();
        setTimeout(function() {
            chrome.runtime.sendMessage({closeTab: "."});
        }, 2000);
    }
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
    let input = document.getElementById("txtUrls");
    let submitBtn = document.getElementById("btnGetUrls");

    if (typeof videoURL !== "undefined" && typeof submitBtn !== "undefined") {
        input.value = videoURL;

        setTimeout(function() {
            submitBtn.click();
        }, 100);

        clearInterval(interval);
    }
}


/**
 * Removes all of the injected Ads (iframes) from the page.
 */
function removeAds() {
    let iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        iframes[i].remove();
    }
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








