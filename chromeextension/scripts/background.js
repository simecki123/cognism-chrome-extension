// background.js
// Adding access to all elements(frames)
chrome.runtime.onInstalled.addListener(() => {
    chrome.webNavigation.onCompleted.addListener((details) => {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['contentScript.js'],
        allFrames: true
      });
    });
  });
  

