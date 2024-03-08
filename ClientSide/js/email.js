document.addEventListener('DOMContentLoaded', function () {
  var emailInput = document.getElementById('emailInput');
  var subscribeBtn = document.getElementById('subscribeBtn'); 
  var modal = document.getElementById('modal');
  var modalText = document.getElementById('modalText');
  var closeModal = document.getElementById('closeModal');

  modal.style.display = 'none';

  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  var subscribeClickHandler = async function () {
    if (emailInput.value.trim() === '') {
      modalText.textContent = 'Please enter your email address.';
    } else if (!isValidEmail(emailInput.value.trim())) {
      modalText.textContent = 'Email Invalid.';
    } else {
      var successMessage = 'Your E-Mail: <span style="color: green;">' + emailInput.value.trim() + '</span> successfully subscribed.';
      modalText.innerHTML = successMessage;

      var email = emailInput.value.trim();
      var subject = 'Hello Email';
      var message = 'Thank you for subscribing to our newsletter!\nWe look forward to keeping you updated with our latest news and promotions.\nRegards,\nYour NFTMarketplace';

      await SendHelloEmail(email, subject, message);
    }

    modal.style.display = 'flex';
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

  // var footerEmailInput = document.getElementById('footerInput');
  // var footerSubscribeBtn = document.getElementById('footerbtn');

  // footerSubscribeBtn.addEventListener('click', function (event) {
  //   subscribeClickHandler(event, subscribeModal);
  // });

  // footerEmailInput.addEventListener('input', function () {
  //   if (isValidEmail(footerEmailInput.value.trim())) {
  //     footerEmailInput.style.color = 'green';
  //   } else {
  //     footerEmailInput.style.color = ''; 
  //   }
  // });

  async function SendHelloEmail(email, subject, message) {
    var messageData = {
      email: email,
      subject: subject,
      message: message
    }

    var formData = new FormData();
    formData.append('email', messageData.email);
    formData.append('subject', messageData.subject);
    formData.append('message', messageData.message);

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
