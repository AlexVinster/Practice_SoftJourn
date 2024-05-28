async function adminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      if (!username ||!password) {
        throw new Error('Please enter both username and password.');
      }
  
      const response = await fetch('https://localhost:7018/api/Authenticate/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid username or password.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
  
      const data = await response.json();
      console.log('Response from backend:', data);
  
      sessionStorage.setItem('token', data.token);
  
      window.location.href = './admin-main.html';
    } catch (error) {
      const errorMessageElement = document.getElementById('error-message');
      errorMessageElement.classList.add('visible');
  
      if (error.message === 'Failed to fetch') {
        errorMessageElement.textContent = 'Connection refused. Please check your internet connection and try again.';
      } else if (error.message === 'Please enter both username and password.') {
        errorMessageElement.textContent = error.message;
      } else if (error.message === 'Invalid username or password.') {
        errorMessageElement.textContent = error.message;
      } else if (error.message === 'Server error. Please try again later.') {
        errorMessageElement.textContent = error.message;
      } else {
        errorMessageElement.textContent = 'An unknown error occurred. Please try again later.';
      }
    }
  }