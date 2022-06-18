/* © Copyright 2021, Tobias Günther, All rights reserved. */

let downloadPageURL = "https://onlymp3.to/";

/**
 * Ready the DOM and setup intervals/variables on the download-page.
 */
if (window.location.href.includes(downloadPageURL)) {
    
    setupDownloadPage();
    listenToBackground();
    setInterval(removeAds, 10);

    var videoURL;
    var readyDownloadInterval = setInterval(readyDownload, 100);
    var startDownloadInterval;
    
    setTimeout(()=> { 
        startDownloadInterval = setInterval(startDownload, 100); 
    }, 1000);
}

/**
 * Hides the actual content of the host website.
 */
 function setupDownloadPage() {

    document.body.style.cssText = "overflow-y: hidden;";
    document.getElementsByTagName("title")[0].innerHTML = "Downloading...";

    const infoText = React.createElement(
        "p",
        {key: "infoText", className: "hideContent"},
        "The download is starting shortly!"
    );

    const wrapper = React.createElement(
        "div",
        {key: "wrapper", className: "hideContent"},
        infoText
    );

    /*
    const sidebarRight = React.createElement(
        "div",
        {key: "sidebarRight", className: "hideContent",  style: {left: "80%"}}
    );

    const footer = React.createElement(
        "div",
        {key: "footer", className: "hideContent",  style: {top: "510px"}}
    );

    root.render([header, sidebarLeft, sidebarRight, footer]);
    */
    let reactContainer = document.createElement("div");
    document.body.appendChild(reactContainer);

    const root = ReactDOM.createRoot(reactContainer);
    root.render(wrapper);

    // let header = 
    // header.style.cssText = "height: 230px;"
    // header.classList.add("hideContent");

    // let sidebarLeft = document.createElement("div");
    // sidebarLeft.style.cssText = "width: 280px;"
    // sidebarLeft.classList.add("hideContent");

    // let sidebarRight = document.createElement("div");
    // sidebarRight.style.cssText = "left: 80%;"
    // sidebarRight.classList.add("hideContent");

    // let footer = document.createElement("div");
    // footer.style.cssText = "top: 510px;"
    // footer.classList.add("hideContent");


    // document.body.appendChild(sidebarLeft);
    // document.body.appendChild(sidebarRight);
    // document.body.appendChild(footer);

    // document.body.style.cssText = "overflow-y: hidden;";

    // return (
    //     <div>
    //         <div class="hideContent" style="height: 230x;"></div>
    //         <div class="hideContent" style="width: 280x;"></div>
    //         <div class="hideContent" style="left: 80%;"></div>
    //         <div class="hideContent" style="top: 510px;"></div>
    //     </div>
    //     )
}


async function startDownload() {
    let downloadBtn = document.getElementById("btn251003003");
    
    let promise = await checkAvailability(downloadBtn);
    if (promise == 1) {
        setTimeout(() => {
            downloadBtn.childNodes[0].dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: false,
                view: window,
                button: 1,
                buttons: 0,
            }));

            closeDownloadTab();
        }, 3000);

        clearInterval(startDownloadInterval);
    }
}


function clickDownloadBtn(element) {
    eleem.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
        view: window,
        button: 1,
        buttons: 0,
    }));
}

/**
 * Sends message to background close the host-website.
 */
function closeDownloadTab() {
    setTimeout(function() {
        chrome.runtime.sendMessage({closeTab: "."});
    }, 2000);
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
    let input = document.getElementById("txtUrl");
    let submitBtn = document.getElementById("btnSubmit");

    if (typeof videoURL !== "undefined" && typeof submitBtn !== "undefined") {
        input.value = videoURL;

        setTimeout(function() {
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


function checkAvailability(element) {
    return new Promise(
        (resolve) => {
            if (typeof element !== "undefined" && element !== null) {
                resolve(1);
            }

            resolve(0);
        }
    );
}

/*
function injectReactToDOM() {
    let files = [["https://unpkg.com/react@18/umd/react.development.js", false], ["https://unpkg.com/react-dom@18/umd/react-dom.development.js", false], ["https://unpkg.com/@babel/standalone/babel.min.js", false], ["reactComponents", true]];
    files.forEach((currentEntry) => {
        let scriptTags = document.getElementsByTagName("script");
        for (i = 0; i < scriptTags.length; i++) {
            if (scriptTags[i].src.includes(currentEntry[0])) {
                scriptTags[i].parentNode.removeChild(scriptTags[i]);
            }
        }

        let scriptTag = document.createElement("script");
        
        if (currentEntry[1]) {
            scriptTag.type = "text/babel";
            fetch(chrome.runtime.getURL("js/" + currentEntry[0] + ".js"))
            .then(response => response.text())
            .then(text=> scriptTag.innerHTML = text);
            (document.body).appendChild(scriptTag);
        } else {
            scriptTag.src = currentEntry[0];
            (document.head || document.documentElement).appendChild(scriptTag);
        }

    });
}
*/











