/* © Copyright 2021, Tobias Günther, All rights reserved. */

let downloadPageURL = "https://en.onlymp3.to/";

/**
 * Ready the DOM and setup intervals/variables on the download-page.
 */
if (window.location.href.includes(downloadPageURL)) {
  let reactContainer = document.createElement("div");
  document.body.appendChild(reactContainer);

  setupDownloadPage();
  listenToBackground();
  setInterval(removeAds, 10);

  var videoURL;
  var readyDownloadInterval = setInterval(readyDownload, 100);
  var startDownloadInterval;

  setTimeout(() => {
    startDownloadInterval = setInterval(startDownload, 500);
  }, 1000);
}

/**
 * Hides the actual content of the host website by creating react components.
 */
function setupDownloadPage() {
  document.body.style.cssText = "overflow-y: hidden;";
  document.getElementsByTagName("title")[0].innerHTML = "Downloading...";

  const infoText = React.createElement(
    "p",
    { key: "infoText", className: "hideContent" },
    "The download is starting shortly!"
  );

  const wrapper = React.createElement(
    "div",
    { key: "wrapper", className: "hideContent" },
    infoText
  );

  let reactContainer = document.createElement("div");
  document.body.appendChild(reactContainer);

  const root = ReactDOM.createRoot(reactContainer);
  root.render(wrapper);
}

/**
 * Gets and opens the file-download-url so that the download starts.
 */
function startDownload() {
  let downloadBtn = document.getElementsByTagName("button")[5];

  if (typeof downloadBtn !== "undefined" && downloadBtn !== null) {
    window.open(downloadBtn.getElementsByTagName("a")[0].getAttribute("href"));
    clearInterval(startDownloadInterval);

    closeDownloadTab();
  }
}

/**
 * Sends a message to the background i order to close the host-website.
 */
function closeDownloadTab() {
  setTimeout(function () {
    chrome.runtime.sendMessage({ closeTab: "." });
  }, 2000);
}

/**
 * Adds message listener which awaits the videoURL who's to be downloaded from the background.
 */
function listenToBackground() {
  chrome.runtime.onMessage.addListener(function (request) {
    videoURL = request.URLToInsert;
  });
}

/**
 * Provides the videoURL to the host website, and initializes the video conversion.
 */
function readyDownload() {
  let input = document.getElementById("txtUrl");
  let submitBtn = document.getElementById("btnSubmit");

  if (typeof videoURL !== "undefined" && typeof submitBtn !== "undefined") {
    input.value = videoURL;

    setTimeout(function () {
      submitBtn.click();
    }, 100);

    clearInterval(readyDownloadInterval);
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
