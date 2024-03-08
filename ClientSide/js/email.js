document.addEventListener('DOMContentLoaded', function () {
  var emailInput = document.getElementById('emailInput');
  var subscribeBtn = document.getElementById('subscribeBtn'); 
  var modal = document.getElementById('modal');
  var modalText = document.getElementById('modalText');
  var closeModal = document.getElementById('closeModal');

  var footerEmailInput = document.getElementById('footerInput');
  var footerSubscribeBtn = document.getElementById('footerbtn');
  var subscribeModal = document.getElementById('subscribeModal');

  modal.style.display = 'none';

  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  var subscribeClickHandler = async function () {
    var email = emailInput.value.trim();
    var footerEmail = footerEmailInput.value.trim();

    if (email === '' && footerEmail === '') {
      modalText.textContent = 'Please enter your email address.';
      modal.style.display = 'flex';
    } else if ((email !== '' && !isValidEmail(email)) || (footerEmail !== '' && !isValidEmail(footerEmail))) {
      modalText.textContent = 'Email Invalid.';
      modal.style.display = 'flex';
    } else {
      var successMessage = 'Your E-Mail: <span style="color: green;">' + (email || footerEmail) + '</span> successfully subscribed.';
      modalText.innerHTML = successMessage;

      var subject = 'Thank you for subscribing';
      var message = 'Thank you for subscribing to our Digest!\nWe look forward to keeping you updated with our latest news and promotions.\nRegards,\nYour NFTMarketplace';

      if (email !== '') {
        await SendHelloEmail(email, subject, message);
      }

      modal.style.display = 'flex';
    }
  };

  subscribeBtn.addEventListener('click', subscribeClickHandler);

  closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  footerSubscribeBtn.addEventListener('click', function (event) {
    subscribeClickHandler(event, subscribeModal);
  });

  footerEmailInput.addEventListener('input', function () {
    if (isValidEmail(footerEmailInput.value.trim())) {
      footerEmailInput.style.color = 'green';
    } else {
      footerEmailInput.style.color = ''; 
    }
  });

  emailInput.addEventListener('input', function () {
    if (isValidEmail(emailInput.value.trim())) {
      emailInput.style.color = 'green';
    } else {
      emailInput.style.color = ''; 
    }
  });

  async function SendHelloEmail(email, subject, message) {
    var formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    try {
      // Check if required fields are present
      if (!email || !subject || !message) {
        console.error('Error: Email, subject, and message are required.');
        return;
      }
  
      const response = await fetch("https://localhost:7018/api/EmailSender", {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Email sent successfully!');
      } else {
        const errorMessage = await response.text();
        console.error('Failed to send email:', response.status, errorMessage);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }    
});
