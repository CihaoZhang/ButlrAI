const filterEmails = async () => {
    const emails = Array.from(document.querySelectorAll('.y6>div'));
    const filteredEmails = emails.filter(email => {
      const subject = email.querySelector('.z0>.vU>.aB>span');
      return subject && subject.textContent.includes('AI');
    });
    console.log('Filtered emails:', "None");
  };


  window.onload = function() {
    filterEmails();
  }