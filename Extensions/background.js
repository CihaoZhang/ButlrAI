// background.js
chrome.browserAction.onClicked.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url.includes('mail.google.com')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  } else {
    alert('Please open a Gmail tab to use this extension.');
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'popup.html' });
});