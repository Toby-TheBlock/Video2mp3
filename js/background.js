/* © Copyright 2021, Tobias Günther, All rights reserved. */


var activeTabURL = "";
var returnTab = "";


/**
 * Gets the current active tab url when a tab gets switched to,
 * and stores it in the activeTabURL variable.
 */
chrome.tabs.onActivated.addListener(function() {
    chrome.tabs.getSelected(null, function(activeTab) {
        activeTabURL = activeTab.url;
    });
})


/**
 * Gets the current active tab url when a tab gets updated,
 * and stores it in the activeTabURL variable.
 */
chrome.tabs.onUpdated.addListener(function(tab, tabInfo) {
    if (typeof tabInfo.url !== "undefined" && tabInfo.url.includes("https://ytmp3.cc/")) {
        activeTabURL = tabInfo.url;
    }
})


/**
 * Suppresses any new tab creation while the download website is the active tab.
 * This is to prevent the opening of new tabs with spam/ad websites.
 */
chrome.tabs.onCreated.addListener(function(tab) {
    if (activeTabURL.includes("https://ytmp3.cc/")) {
        chrome.tabs.remove(tab.id);
    }
})


/**
 * Listens for a message from the frontend, and acts based on the message content.
 * If the message is "videoURL" create a new tab for the download page,
 * and then send the message content to it.
 * If the message is "closeTab" close the current tab (download page),
 * and return to the YouTube video tab.
 */
chrome.runtime.onMessage.addListener(async function(request) {
    if (request.videoURL) {
        returnTab = request.videoURL;
        let tabId = await createNewTab();

        setTimeout(function() {
            chrome.tabs.sendMessage(tabId, {URLToInsert: "" + returnTab + ""});
        }, 1000);

    } else if (request.closeTab) {
        let tabToClose;
        let returnToTab;
        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.search("https://ytmp3.cc/") > -1) {
                    tabToClose = tabs[i].id;
                } else if (tabs[i].url === returnTab) {
                    returnToTab = tabs[i].id;
                }
            }
            chrome.tabs.remove(tabToClose);
            chrome.tabs.update(returnToTab, {selected: true});
        });
    }
})


/**
 * Creates a new tab and opens the video-converter webpage in it.
 * @returns {Promise<unknown>}
 */
function createNewTab() {
    return new Promise(
        function(resolve) {
            chrome.tabs.create({ url: "https://ytmp3.cc" }, function(tab) {
                resolve(tab.id);
            });
        }
    )
}