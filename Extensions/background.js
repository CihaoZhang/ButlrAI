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
    }
  });