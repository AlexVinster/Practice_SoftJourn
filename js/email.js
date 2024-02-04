document.addEventListener('DOMContentLoaded', function () {
  var emailInput = document.getElementById('emailInput');
  var subscribeBtn = document.getElementById('subscribeBtn'); 
  var modal = document.getElementById('modal');
  var subscribeModal = document.getElementById('subscribeModal');
  var modalText = document.getElementById('modalText');
  var closeModal = document.getElementById('closeModal');

  modal.style.display = 'none';

  var subscribeClickHandler = function (event) {
    if (emailInput.value.trim() === '') {
      modalText.textContent = 'Please enter your email address.';
    } else if (!isValidEmail(emailInput.value.trim())) {
      modalText.textContent = 'Email Invalid.';
    } else {
      var successMessage = 'Your E-Mail: <span style="color: green;">' + emailInput.value.trim() + '</span> successfully subscribed.';
      modalText.innerHTML = successMessage;
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

  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  emailInput.addEventListener('input', function () {
    if (isValidEmail(emailInput.value.trim())) {
      emailInput.style.color = 'green';
    } else {
      emailInput.style.color = '';
    }
  });

  var footerEmailInput = document.getElementById('footerInput');
  var footerSubscribeBtn = document.getElementById('footerbtn');

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
});
