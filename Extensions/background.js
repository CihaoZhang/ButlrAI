// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "filter-emails") {
    // Filter emails based on the user's criteria
    const filters = request.filters;
    const filteredEmails = [];

    const emails = document.querySelectorAll(".yW > .y6");
    emails.forEach((email) => {
      // Check if the email matches the user's filter criteria
      const subject = email.querySelector(".yW > .y7").innerText;
      const sender = email.querySelector(".yW > .y5").innerText;
      const date = email.querySelector(".yW > .y4").innerText;

      if (
        filters.some(
          (filter) =>
            filter.type === "subject" &&subject.toLowerCase().includes(filter.value.toLowerCase())
        ) ||
        filters.some(
          (filter) =>
            filter.type === "sender" &&
            sender.toLowerCase().includes(filter.value.toLowerCase())
        ) ||
        filters.some(
          (filter) =>
            filter.type === "date" &&
            date.toLowerCase().includes(filter.value.toLowerCase())
        )
      ) {
        filteredEmails.push(email);
      }
    });

    // Update the UI to display the filtered emails
    const filteredEmailsContainer = document.querySelector(
      "#filtered-emails-container"
    );
    filteredEmailsContainer.innerHTML = "";
    filteredEmails.forEach((email) => {
      filteredEmailsContainer.appendChild(email);
    });
  } else if (request.type === "summarize-emails") {
    // Get the user's emails
    const emails = document.querySelectorAll(".yW > .y6");

    // Initialize an empty array to store the summaries
    const summaries = [];

    // Loop through each email and summarize it using the OpenAI API
    emails.forEach((email) => {
      // Extract the email text
      const text = email.innerText;

      // Call the OpenAI API to summarize the email
      fetch("https://api.openai.com/v1/engines/davinci/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_OPENAI_API_KEY",
        },
        body: JSON.stringify({
          prompt: `Summarize this email:\n\n${text}`,
          max_tokens: 60,
          temperature: 0.5,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add the summary to the array
          summaries.push(data.choices[0].text);

          // Check if all the emails have been summarized
          if (summaries.length === emails.length) {
            // Send the summaries back to the content script
            sendResponse({ summaries });
          }
        });
    });
  } else if (request.type === "schedule-email") {
    // Schedule the email to be sent at the specified time
    chrome.alarms.create(request.id, {
      when: request.time,
    });

    // Save the email data to send later
    chrome.storage.local.set({
      [request.id]: {
        to: request.to,
        subject: request.subject,
        body: request.body,
      },
    });
  }
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  // Get the email data from storage
  chrome.storage.local.get(alarm.name, (data) => {
    // Send the email using the Gmail API
    const emailData = data[alarm.name];
    sendEmail(emailData.to, emailData.subject, emailData.body);

    // Delete the email data from storage
    chrome.storage.local.remove(alarm.name);
  });
});

// Function to send an email using the Gmail API
function sendEmail(to, subject, body) {
  // TODO: Implement this function using the Gmail API
}