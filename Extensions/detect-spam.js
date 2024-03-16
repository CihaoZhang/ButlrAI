const GMailApi = require('gmail-api');

const gmail = new GMailApi();

gmail.init().then(() => {
  gmail.listMessages({}, (err, messages) => {
    if (err) {
      console.error(err);
      return;
    }

    messages.forEach((message) => {
      gmail.get('users/me/messages/' + message.id, (err, messageData) => {
        if (err) {
          console.error(err);
          return;
        }

        // Perform spam detection on the message data
        const isSpam = detectSpam(messageData);

        // If the message is spam, move it to the spam folder
        if (isSpam) {
          gmail.moveMessageToSpam(message.id);
        }
      });
    });
  });
});

function detectSpam(messageData) {

    const scamWords = ['scam', `win`, `free`, 'cheat', 'fraud', 'cheat', 'con', 'hack', 'thief', 'spam', 'phishing', 'ripoff', 'ruse'];
    const lowerCaseMessage = message.toLowerCase();
    const words = lowerCaseMessage.split(' ');

  // Check if any of the scam words are in the message
  for (const word of scamWords) {
    if (words.includes(word)) {
      return true;
    }
  }
  if (lowerCaseMessage.includes('win ') || lowerCaseMessage.includes(' free')) {
    return true;
  }

  return false;
}

function moveMessageToSpam(messageId) {
  gmail.moveMessageToSpam(messageId);
}