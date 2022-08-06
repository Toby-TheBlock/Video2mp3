/* © Copyright 2021, Tobias Günther, All rights reserved. */

let downloadPageURL = "onlymp3.to";
let filename = "";
var activeTabURL = "";
var returnTab = "";

/**
 * Gets the current active tab url when a tab gets switched to,
 * and stores it in the activeTabURL variable.
 */
chrome.tabs.onActivated.addListener(function () {
  setTimeout(function () {
    try {
      chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function (tabs) {
          activeTabURL = tabs[0].url;
        }
      );
    } catch (e) {
      console.log(e);
    }
  }, 100);
});

/**
 * Gets the current active tab url when a tab gets updated,
 * and stores it in the activeTabURL variable.
 */
chrome.tabs.onUpdated.addListener(function (tab, tabInfo) {
  try {
    if (
      typeof tabInfo.url !== "undefined" &&
      tabInfo.url.includes(downloadPageURL)
    ) {
      activeTabURL = tabInfo.url;
    }
  } catch (e) {
    console.log(e);
  }
});

/**
 * Suppresses any new tab creation while the download website is the active tab.
 * This is to prevent the opening of new tabs with spam/ad websites.
 */
// chrome.tabs.onCreated.addListener(function(tab) {
//     try {
//         if (activeTabURL.includes(downloadPageURL)) {
//             chrome.tabs.remove(tab.id);
//         }
//     } catch (e) {
//         console.log(e)
//     }
// })

/**
 * Listens for a message from the frontend, and acts based on the message content.
 * If the message is "videoURL" create a new tab for the download page,
 * and then send the message content to it.
 * If the message is "closeTab" close the current tab (download page),
 * and return to the YouTube video tab.
 * If the message is "filename" the value of the message is being stored for further use.
 */
chrome.runtime.onMessage.addListener(async function (request) {
  if (request.videoURL) {
    returnTab = request.videoURL;
    let tabId = await createNewTab();

    setTimeout(function () {
      chrome.tabs.sendMessage(tabId, { URLToInsert: "" + returnTab + "" });
    }, 3000);
  } else if (request.closeTab) {
    let tabToClose;
    let returnToTab;
    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.search(downloadPageURL) > -1) {
          tabToClose = tabs[i].id;
        } else if (tabs[i].url === returnTab) {
          returnToTab = tabs[i].id;
        }
      }
      chrome.tabs.remove(tabToClose);
      chrome.tabs.update(returnToTab, { selected: true });
    });
  } else if (request.filename) {
    filename = request.filename;
  }
});

/**
 * Creates a new tab and opens the video-converter webpage in it.
 * @returns {Promise<unknown>}
 */
function createNewTab() {
  return new Promise(function (resolve) {
    chrome.tabs.create({ url: "https://" + downloadPageURL }, function (tab) {
      resolve(tab.id);
    });
  });
}

/**
 * Listens for new file downloads and changes the filename to the video title.
 */
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  try {
    if (downloadItem.url.includes(downloadPageURL)) {
      suggest({ filename: filename + ".mp3", conflictAction: "overwrite" });
    }
  } catch (e) {
    // The provided filename contains invalid characters, don't change exsisting filename.
    console.log(e, filename);
  }
});
