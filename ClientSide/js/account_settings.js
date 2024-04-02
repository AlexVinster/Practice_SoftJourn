function getToken() {
    return sessionStorage.getItem('token');
}

async function getCurrentUserId() {
    try {
        const token = getToken();
        const response = await fetch('https://localhost:7018/api/Users/currentUser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Current user ID:', data.userID);
        return data.userID;
    } catch (error) {
        console.error('Error getting current user ID:', error);
        throw error;
    }
}

async function changeUsername(newUsername) {
    try {
        const token = getToken();
        const userId = await getCurrentUserId();
        const response = await fetch(`https://localhost:7018/api/Users/changeUsername?userId=${userId}&newUsername=${newUsername}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        const userId = getUserIdFromToken(token); // get id from token
        const response = await fetch('https://localhost:7018/api/Users/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM content loaded');
    const saveChangesBtn = document.querySelector('.btn-primary'); // select button
    console.log('Save changes button:', saveChangesBtn);

    saveChangesBtn.addEventListener('click', async function () {
        console.log('Save changes button clicked');
        const currentTab = document.querySelector('.tab-pane.active.show'); // Get Current tab
        console.log('Current tab:', currentTab);

        if (currentTab.id === 'account-general') {
            console.log('General tab is active');
            // Якщо активна вкладка - "General", то виконуємо зміну імені користувача
            const newUsername = document.querySelector('#usernameInput').value;
            console.log('New username:', newUsername);
            try {
                const usernameChangeResult = await changeUsername(newUsername);
                console.log('Username change result:', usernameChangeResult);
            } catch (error) {
                console.error('Error changing username:', error);
            }
        } else if (currentTab.id === 'account-change-password') {
            console.log('Change password tab is active');
            // Якщо активна вкладка - "Change password", то виконуємо зміну паролю
            const currentPassword = document.querySelector('#currentPasswordInput').value;
            const newPassword = document.querySelector('#newPasswordInput').value;
            console.log('Current password:', currentPassword);
            console.log('New password:', newPassword);
            try {
                const passwordChangeResult = await changePassword(currentPassword, newPassword);
                console.log('Password change result:', passwordChangeResult);
            } catch (error) {
                console.error('Error changing password:', error);
            }
        }
    });
});