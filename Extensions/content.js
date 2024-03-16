// Send a message to the background script to filter emails
function filterEmails() {
  const filters = [
    { type: "subject", value: "important" },
    { type: "sender", value: "example@example.com" },
    { type: "date", value: "yesterday" },
  ];
  chrome.runtime.sendMessage({ type: "filter-emails", filters });
}

// Send a message to the background script to mark an email as read or unread
function markEmail(email, isRead) {
  chrome.runtime.sendMessage({
    type: "mark-email",
    emailId: email.id,
    isRead,
  });
}

// Send a message to the background script to mark an email as spam
function markEmailAsSpam(email) {
  chrome.runtime.sendMessage({
    type: "mark-email-as-spam",
    emailId: email.id,
  });
}

// Send a message to the background script to move an email to a specific folder
function moveEmailToFolder(email, folder) {
  chrome.runtime.sendMessage({
    type: "move-email-to-folder",
    emailId: email.id,
    folder,
  });
}

// Send a message to the background script to schedule an email
function scheduleEmail(emailData, time) {
  chrome.runtime.sendMessage({
    type: "schedule-email",
    emailData,
    time,
  });
}

// Send a message to the background script to summarize the emails
function summarizeEmails() {
  chrome.runtime.sendMessage({ type: "summarize-emails" });
}

// Add click event listeners to the filter, mark, categorize, schedule, and summarize buttons
const filterButton = document.querySelector("#filter-button");
filterButton.addEventListener("click", filterEmails);

const markReadButton = document.querySelector("#mark-read-button");
markReadButton.addEventListener("click", () => {
  const email = document.querySelector("#selected-email");
  if (email) {
    markEmail(email, true);
  }
});

const markUnreadButton = document.querySelector("#mark-unread-button");
markUnreadButton.addEventListener("click", () => {
  const email = document.querySelector("#selected-email");
  if (email) {
    markEmail(email, false);
  }
});

const markSpamButton = document.querySelector("#mark-spam-button");
markSpamButton.addEventListener("click", () => {
  const email = document.querySelector("#selected-email");
  if (email) {
    markEmailAsSpam(email);
  }
});

const moveToInboxButton = document.querySelector("#move-to-inbox-button");
moveToInboxButton.addEventListener("click", () => {
  const email = document.querySelector("#selected-email");
  if (email) {
    moveEmailToFolder(email, "INBOX");
  }
});

const moveToSpamButton = document.querySelector("#move-to-spam-button");
moveToSpamButton.addEventListener("click", () => {
  const email = document.querySelector("#selected-email");
  if (email) {
    moveEmailToFolder(email, "SPAM");
  }
});

const scheduleButton = document.querySelector("#schedule-button");
scheduleButton.addEventListener("click", () => {
  const emailData = {
    to: document.querySelector("#to").value,
    subject: document.querySelector("#subject").value,
    body: document.querySelector("#body").value,
  };
  const time = document.querySelector("#time").value;
  scheduleEmail(emailData, time);
});

const summarizeButton = document.querySelector("#summarize-button");
summarizeButton.addEventListener("click", summarizeEmails);