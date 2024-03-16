// Send a message to the background script to filter emails
chrome.runtime.sendMessage({
    type: "filter-emails",
    filters: [
      { type: "subject", value: "important" },
      { type: "sender", value: "[example@example.com](mailto:example@example.com)" },
      { type: "date", value: "yesterday" },
    ],
  });