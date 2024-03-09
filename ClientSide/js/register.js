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
        throw new Error(`Помилка: ${response.status}`);
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

  // Перевірка на валідність email
  if (!isValidEmail(email)) {
    alert("Будь ласка, введіть валідну електронну пошту.");
    return;
  }

  // Перевірка на відповідність паролів
  if (password1 !== password2) {
    alert("Паролі не співпадають. Будь ласка, перевірте введені дані.");
    return;
  } else {
    password = password1;
  }

  // Перевірка доступності username
  isUsernameAvailable(username)
    .then(usernameAvailable => {
      if (!usernameAvailable) {
        alert("Цей username вже використовується. Будь ласка, виберіть інший.");
      } else {
        // Продовження реєстрації
        if (!isValidPassword(password)) {
          alert("Будь ласка, введіть пароль, який відповідає вимогам:\nМістить хоча б одну цифру\nМістить велику літеру\nМістить спеціальний символ");
          return;
        }

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
            throw new Error(`Помилка: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Обробка відповіді від сервера
          console.log(data);
          if (data.status === 'Success') {
            window.location.href = './index.html';
        }
        })
        .catch(error => {
          console.error('Помилка при відправці запиту:', error.message);
        });
      }
    })
    .catch(error => {
      console.error('Помилка при перевірці доступності username:', error.message);
    });
}


/* 

    THERE IS SOME UPDATE OF CLIENT AND SERVER FOR FUTURE
    USE LIKE 
     if (error.message === 'User already exists!') {
                alert('User already exists! Please choose a different username.');
    FOR IDENTITY USERNAME INSTEAD isUsernameAvailable

*/