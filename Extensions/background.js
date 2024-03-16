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
            filter.type === "subject" &&
            subject.toLowerCase().includes(filter.value.toLowerCase())
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
  } else if (request.type === "mark-email") {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Execute JavaScript code to mark the email as read or unread
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          // Get the current email element
          const email = document.querySelector('.yW .yX .yW > .y6');

          // Check if the email is marked as read or unread
          if (email.classList.contains('zA')) {
            // Mark the email as unread
            email.classList.remove('zA');
          } else {
            // Mark the email as read
            email.classList.add('zA');
          }
        `,
      });
    });
  } else if (request.type === "mark-email-as-spam") {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Execute JavaScript code to mark the email as spam
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          // Get the current email element
          const email = document.querySelector('.yW .yX .yW > .y6');

          // Mark the email as spam
          email.reportSpam();
        `,
      });
    });
 } else if (request.type === "move-email-to-folder") {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Execute JavaScript code to move the email to a specific folder
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          // Get the current email element
          const email = document.querySelector('.yW .yX .yW > .y6');

          // Move the email to a specific folder
          email.moveTo('[Gmail]/${request.folder}');
        `,
      });
    });
  } else if (request.type === "schedule-email") {
    // Schedule the email to be sent at the specified time
    const emailData = request.emailData;
    const time = request.time;

    // Save the email data to send later
    chrome.storage.local.set({
      [time]: emailData,
    });
  } else if (request.type === "summarize-emails") {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Execute JavaScript code to summarize the emails
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          // Get all the email elements\\
          const emails = document.querySelectorAll('.yW > .y6');

          // Initialize an empty array to store the summaries
          const summaries = [];

          // Loop through each email and summarize it using the OpenAI API
          emails.forEach((email) => {
            // Extract the email text
            const text = email.innerText;

            // Call the OpenAI API to summarize the email
            fetch('https://api.openai.com/v1/engines/davinci/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
              },
              body: JSON.stringify({
                prompt:\`Summarize this email:\n\n\${text}\`,
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
                  chrome.runtime.sendMessage({
                    type: 'summaries-ready',
                    summaries,
                  });
                }
              });
          });
        `,
      });
    });
  }
});