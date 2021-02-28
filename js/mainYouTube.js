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
            createDownloadBtn();
        } catch {
            if (failedAttempts < 100) {
                failedAttempts++;
                setupDownloadBtn();
            }
        }
    }
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

    let menuItems = document.getElementsByClassName("style-scope ytd-menu-renderer force-icon-button style-text")[0].parentElement;
    menuItems.insertBefore(container, menuItems.children[5]);
}


/**
 * Sends a message to the backend to signals the start of downloading the current video.
 */
function changeTabs() {
    chrome.runtime.sendMessage({videoURL: "" + window.location.href + ""});
}