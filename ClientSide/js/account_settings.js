async function getCurrentUserInfo() {
    try {
        const token = getToken();
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

async function changeUsername(newUsername) {
    try {
        const token = getToken();
        const { userId } = await getCurrentUserInfo();
        const response = await fetch(`https://localhost:7018/api/Users/changeUsername?userId=${userId}&newUsername=${newUsername}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Change username result:', data);
        return data;
    } catch (error) {
        console.error('Error changing username:', error);
        throw error;
    }
}

async function changePassword(currentPassword, newPassword) {
    try {
        const token = getToken();
        const { userId } = await getCurrentUserInfo();
        const response = await fetch(`https://localhost:7018/api/Users/changePassword?userId=${userId}&currentPassword=${currentPassword}&newPassword=${newPassword}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });
        const data = await response.json();
        console.log('Change password result:', data);
        return data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}

async function changeEmail(newEmail) {
    try {
        const token = getToken();
        const { userId } = await getCurrentUserInfo();
        const response = await fetch(`https://localhost:7018/api/Users/changeEmail?userId=${userId}&newEmail=${newEmail}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Change email result:', data);
        return data;
    } catch (error) {
        console.error('Error changing email:', error);
        throw error;
    }
}

async function logout() {
    try {
        sessionStorage.removeItem('token');
        console.log('User logged out successfully');
        window.location.href = './index.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {

    const cancelButton = document.getElementById('cancel-button'); // вибрати кнопку "Cancel"
    cancelButton.addEventListener('click', function () {
        console.log('Cancel button clicked');
        window.location.href = './index.html'; // перенаправлення на index.html
    });

    const saveChangesBtn = document.querySelector('.btn-primary'); // select button
    console.log('Save changes button:', saveChangesBtn);

    // Отримати поточну інформацію про користувача при завантаженні сторінки
    try {
        const { username, email } = await getCurrentUserInfo();
        console.log('Current username:', username);

        // Вивести поточну інформацію про користувача у відповідні поля на сторінці
        const usernameInput = document.querySelector('#usernameInput');
        const emailInput = document.querySelector('#emailInput');
        if (usernameInput && emailInput) {
            usernameInput.value = username;
            emailInput.value = email;
        }
    } catch (error) {
        console.error('Error getting current user data:', error);
    }

    saveChangesBtn.addEventListener('click', async function () {
        console.log('Save changes button clicked');
        const currentTab = document.querySelector('.tab-pane.active.show'); // Get Current tab
        console.log('Current tab:', currentTab);

        if (currentTab.id === 'account-general') {
            console.log('General tab is active');
            // Якщо активна вкладка - "General", то виконуємо зміну
            const newUsername = document.querySelector('#usernameInput').value;
            console.log('New username:', newUsername);
            try {
                const usernameChangeResult = await changeUsername(newUsername);
                console.log('Username change result:', usernameChangeResult);
                // logout();
                // window.location.href = './admin-login.html';
            } catch (error) {
                console.error('Error changing username:', error);
            }
        }
        if (currentTab.id === 'account-general') {
            const newEmail = document.querySelector('#emailInput').value;
            console.log('New email:', newEmail);
            try {
                const emailChangeResult = await changeEmail(newEmail);
                console.log('Email change result:', emailChangeResult);
                logout();
                window.location.href = './admin-login.html';
            } catch (error) {
                console.error('Error changing email:', error);
            }
        }
        else if (currentTab.id === 'account-change-password') {
            console.log('Change password tab is active');
            // Якщо активна вкладка - "Change password", то виконуємо зміну паролю
            const currentPassword = document.querySelector('#currentPasswordInput').value;
            const newPassword = document.querySelector('#newPasswordInput').value;
            console.log('Current password:', currentPassword);
            console.log('New password:', newPassword);
            try {
                const passwordChangeResult = await changePassword(currentPassword, newPassword);
                console.log('Password change result:', passwordChangeResult);
                logout();
                window.location.href = './admin-login.html';
            } catch (error) {
                console.error('Error changing password:', error);
            }
        }
    });
});
