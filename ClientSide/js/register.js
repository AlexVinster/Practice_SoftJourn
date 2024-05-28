document.getElementById('registerButton').addEventListener('click', registerUser);

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const nonAlphanumericRegex = /[^A-Za-z0-9]/;
  const digitRegex = /\d/;
  const uppercaseRegex = /[A-Z]/;

  return (
    nonAlphanumericRegex.test(password) &&
    digitRegex.test(password) &&
    uppercaseRegex.test(password)
  );
}

function isUsernameAvailable(username) {
  return fetch(`https://localhost:7018/api/Users/checkUsername?username=${encodeURIComponent(username)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data.available);
}

function isEmailAvailable(email) {
  return fetch(`https://localhost:7018/api/Users/checkEmail?email=${encodeURIComponent(email)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data.available);
}

function registerUser() {
  const form = document.getElementById('registrationForm');
  const formData = new FormData(form);
  const username = formData.get('username');
  const email = formData.get('email');

  const password1 = formData.get('password1');
  const password2 = document.getElementById('password2').value;
  let password;

  // Check for empty fields
  if (!username || !email || !password1 || !password2) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.classList.add('visible');
    errorMessageElement.textContent = 'Please fill in all fields.';
    return;
  }

  // Check for valid email
  if (!isValidEmail(email)) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.classList.add('visible');
    errorMessageElement.textContent = 'Please enter a valid email address.';
    return;
  }

  // Check for matching passwords
  if (password1 !== password2) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.classList.add('visible');
    errorMessageElement.textContent = 'Passwords do not match. Please try again.';
    return;
  } else {
    password = password1;
  }

  // Check for spaces in username
  if (username.includes(' ')) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.classList.add('visible');
    errorMessageElement.textContent = 'Username cannot contain spaces.';
    return;
  }

  // Check for available username
  isUsernameAvailable(username)
    .then(usernameAvailable => {
      if (!usernameAvailable) {
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.classList.add('visible');
        errorMessageElement.textContent = 'Username is already taken. Please choose another.';
      } else {
        // Check for available email
        isEmailAvailable(email)
          .then(emailAvailable => {
            if (!emailAvailable) {
              const errorMessageElement = document.getElementById('error-message');
              errorMessageElement.classList.add('visible');
              errorMessageElement.textContent = 'Email is already taken. Please choose another.';
            } else {
              // Check for valid password
              if (!isValidPassword(password)) {
                const errorMessageElement = document.getElementById('error-message');
                errorMessageElement.classList.add('visible');
                errorMessageElement.textContent = 'Please enter a password that meets the requirements:\nContains at least one digit\nContains at least one uppercase letter\nContains at least one special character';
                return;
              }
              // Send registration request
              fetch('https://localhost:7018/api/Authenticate/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: username,
                  email: email,
                  password: password,
                })
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  // Process server response
                  console.log(data);
                  if (data.status === 'Success') {
                    window.location.href = './index.html';
                  } else {
                    const errorMessageElement = document.getElementById('error-message');
                    errorMessageElement.classList.add('visible');
                    errorMessageElement.textContent = 'Registration failed. Please try again.';
                  }
                })
                .catch(error => {
                  console.log(error);
                  const errorMessageElement = document.getElementById('error-message');
                  errorMessageElement.classList.add('visible');
                  errorMessageElement.textContent = 'Registration failed. Please try again.';
                });
            }
          });
      }
    });
}

document.getElementById('registrationForm').addEventListener('submit', event => {
  event.preventDefault();
  registerUser();
});