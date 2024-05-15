function getToken() {
    return sessionStorage.getItem('token');
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getCurrentUserInfo() {
    const token = getToken();
    var authorized = new Boolean(true);
    if (!token) {
        var authorized = false;
        console.error('Token is missing. Unable to fetch user data.');
        return authorized;
    }

    try {
        const response = await fetch('https://localhost:7018/api/Users/currentUser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Current user data:', data);
        return data;
    } catch (error) {
        console.error('Error getting current user data:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const token = getToken();
    const signUpButton = document.getElementById('signUpButton');
    if (token) {
        if (signUpButton) {
            signUpButton.classList.remove("header_menuitem_button");
            signUpButton.innerHTML = '<img src="./images/formuser.svg">';
            signUpButton.setAttribute('href', './account_settings.html');
        }
    } else {
        console.error('Unauthorized');
    }
    getCurrentUserInfo();
});

