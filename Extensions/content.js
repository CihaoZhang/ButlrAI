// content.js
const filterEmails = async () => {
  const emails = Array.from(document.querySelectorAll('.y6>div'));
  const filteredEmails = emails.filter(email => {
    const subject = email.querySelector('.z0>.vU>.aB>span');
    return subject && subject.textContent.includes('AI');
  });
  console.log('Filtered emails:', filteredEmails);
};

const detectSpam = async () => {
  const emails = Array.from(document.querySelectorAll('.y6>div'));
  const spamEmails = emails.filter(email => {
    const subject = email.querySelector('.z0>.vU>.aB>span');
    return subject && subject.textContent.includes('spam');
  });
  console.log('Spam emails:', spamEmails);
};

const scheduleEmail = async () => {
  const email = document.querySelector('.y6>div');
  const subject = email.querySelector('.z0>.vU>.aB>span');
  if (subject && subject.textContent.includes('schedule')) {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const formattedDate = date.toISOString().slice(0, 10);
    const input = document.createElement('input');
    input.type = 'date';
    input.value = formattedDate;
    email.querySelector('.aK1').appendChild(input);
    console.log('Email scheduled for:', formattedDate);
}
};

const summarizeEmail = async () => {
  const email = document.querySelector('.y6>div');
  const subject = email.querySelector('.z0>.vU>.aB>span');
  if (subject && subject.textContent.includes('summarize')) {
    const text = email.querySelector('.iI>.aB>span');
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `Summarize the following email:\n\n${text.textContent}`,
        max_tokens: 60,
        n: 1,
        stop: null,
        temperature: 0.5,
      }),
    });
    const data = await response.json();
    const summary = data.choices[0].text;
    email.querySelector('.aK1').innerHTML += `<div class="ar9">Summary: ${summary}</div>`;
    console.log('Email summary:', summary);
  }
};

const OPENAI_API_KEY = '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';

document.getElementById('filterEmails').addEventListener('click', filterEmails);
document.getElementById('detectSpam').addEventListener('click', detectSpam);
document.getElementById('scheduleEmail').addEventListener('click', scheduleEmail);
document.getElementById('summarizeEmail').addEventListener('click', summarizeEmail);

const console = document.getElementById('console');

console.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(tabs[0].url);
    console.innerHTML = tabs[0].url;
  });
});

document.getElementById('filterEmails').addEventListener('click', () => {
  chrome.tabs.create({ url: 'filter-emails.html' });
});

document.getElementById('detectSpam').addEventListener('click', () => {
  chrome.tabs.create({ url: 'detect-spam.html' });
});

document.getElementById('scheduleEmail').addEventListener('click', () => {
  chrome.tabs.create({ url: 'schedule-email.html' });
});

document.getElementById('summarizeEmail').addEventListener('click', () => {
  chrome.tabs.create({ url: 'summarize-email.html' });
});