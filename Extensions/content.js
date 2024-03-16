// Send a message to the background script to filter emails
function filterEmails() {
  const filters = [
    { type: "subject", value: "important" },
    { type: "sender", value: "[example@example.com](mailto:example@example.com)" },
    { type: "date", value: "yesterday" },
  ];
  chrome.runtime.sendMessage({ type: "filter-emails", filters });
}

// Send a message to the background script to summarize the user's emails
function summarizeEmails() {
  chrome.runtime.sendMessage({ type: "summarize-emails" }, (response) => {
    // Display the summaries in the UI
    const summariesContainer = document.querySelector("#summaries-container");
    summariesContainer.innerHTML = "";
    response.summaries.forEach((summary) => {
      summariesContainer.innerHTML += `<p>${summary}</p>`;
    });
  });
}

// Send a message to the background script to schedule an email
function scheduleEmail() {
  const id = new Date().getTime();
  const time = new Date();
  time.setMinutes(time.getMinutes() + 1);
  chrome.runtime.sendMessage({
    type: "schedule-email",
    id,
    time,
    to: "recipient@example.com",
    subject: "Test Email",
    body: "This is a test email.",
  });
}

// Add click event listeners to the filter, summarize, and schedule buttons
const filterButton = document.querySelector("#filter-button");
filterButton.addEventListener("click", filterEmails);

const summarizeButton = document.querySelector("#summarize-button");
summarizeButton.addEventListener("click", summarizeEmails);

const scheduleButton = document.querySelector("#schedule-button");
scheduleButton.addEventListener("click", scheduleEmail);