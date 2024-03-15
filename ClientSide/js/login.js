async function adminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
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
             throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Response from backend:', data);

         sessionStorage.setItem('token', data.token);

          window.location.href = './admin-main.html';
     } catch (error) {
         console.error('Error:', error);
      }
}


