/* © Copyright 2021, Tobias Günther, All rights reserved. */

window.setInterval(setupDownloadBtn, 100);
var failedAttempts = 0;


/**
 * Tries to setup the download button in the DOM if the current page is a video and the button doesn't already exist.
 * The setup will be retried if the previous attempt failed.
 */
function setupDownloadBtn() {
    if (window.location.href.includes("https://www.youtube.com/watch") && document.getElementById("downloadBtnContainer") === null) {
        try {
            removeExistingDownloadBtn();
            createDownloadBtn();
        } catch {
            if (failedAttempts < 100) {
                failedAttempts++;
                setupDownloadBtn();
            }
        }
    }
}

function removeExistingDownloadBtn() {
    document.getElementById("top-level-buttons-computed").childNodes[3].remove();
}


/**
 * Creates a download button and icon DOM-element and appends it to the YouTube-menu-renderer.
 */
function createDownloadBtn() {
    let container = document.createElement("div");
    container.id = "downloadBtnContainer";
    container.classList.add("downloadBtnContainer");
    container.addEventListener("click", changeTabs);

    let icon = document.createElement("p");
    icon.id = "downloadIcon";
    icon.innerHTML = "⤓";
    icon.classList.add("downloadBtnContainer");

    let downloadLink = document.createElement("p");
    downloadLink.innerHTML = "Download";
    downloadLink.classList.add("downloadBtnContainer");

    container.appendChild(icon);
    container.appendChild(downloadLink);

    document.getElementsByClassName("top-level-buttons style-scope ytd-menu-renderer")[0].appendChild(container);
}


/**
 * Sends a message to the backend to signals the start of downloading the current video.
 */
function changeTabs() {
    getFilenameForDownload();
    chrome.runtime.sendMessage({videoURL: "" + window.location.href + ""});
}


/**
 * Sends message to background with information about the filename who's to be used.
 */
function getFilenameForDownload() {
    let videoTitle = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].childNodes[0].innerHTML;
    chrome.runtime.sendMessage({filename: videoTitle});
}
