function showError(message) {
    try {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.add('visible');
    } catch (error) {
        console.error('Error displaying error message:', error);
    }
}

function hideError() {
    try {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.classList.remove('visible');
    } catch (error) {
        console.error('Error hiding error message:', error);
    }
}

function showInfoMessage(message) {
    try {
        const infoMessageDiv = document.getElementById('info-message');
        infoMessageDiv.textContent = message;
        infoMessageDiv.classList.add('visible');
    } catch (error) {
        console.error('Error displaying info message:', error);
    }
}

function hideInfoMessage() {
    try {
        const infoMessageDiv = document.getElementById('info-message');
        infoMessageDiv.classList.remove('visible');
    } catch (error) {
        console.error('Error hiding info message:', error);
    }
}

async function getCurrentUserInfo() {
    try {
        const token = getToken();
        const response = await fetch('https://localhost:7018/api/Users/currentUser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            showError(data.message || 'Failed to fetch current user info');
            throw new Error(data.message || 'Failed to fetch current user info');
        }

        const data = await response.json();
        console.log('Current user data:', data);
        return data;
    } catch (error) {
        console.error('Error getting current user data:', error);
        showError(error.message);
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

        if (!response.ok) {
            const data = await response.json();
            showError(data.message || 'Failed to change username');
            throw new Error(data.message || 'Failed to change username');
        }

        const data = await response.json();
        console.log('Change username result:', data);
        logout();
        return data;
    } catch (error) {
        console.error('Error changing username:', error);
        showError(error.message);
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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (!response.ok) {
            const data = await response.json();
            showError(data.message || 'Failed to change password');
            throw new Error(data.message || 'Failed to change password');
        }

        const data = await response.json();
        console.log('Change password result:', data);
        return data;
    } catch (error) {
        console.error('Error changing password:', error);
        showError(error.message);
        throw error;
    }
}

async function changeArtistInformation(artistId, newName, newImageURL, newBio, newWallet, newLinks, userId) {
    const token = getToken();

    try {
        const response = await fetch(`https://localhost:7018/api/Artist/${artistId}?name=${newName}&imageUrl=${newImageURL}&bio=${newBio}&walletAddress=${newWallet}&links=${newLinks}&userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Artist update failed:', responseData);
            showError(responseData.message || 'Failed to update artist information');
            throw new Error(responseData.message || 'Failed to update artist information');
        }

        console.log('Artist updated successfully.');
        await showArtists();
    } catch (error) {
        console.log('Error updating artist information:', error);
        showError(error.message);
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

        if (!response.ok) {
            const data = await response.json();
            showError(data.message || 'Failed to change email');
            throw new Error(data.message || 'Failed to change email');
        }

        const data = await response.json();
        console.log('Change email result:', data);
        return data;
    } catch (error) {
        console.error('Error changing email:', error);
        showError(error.message);
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
        showError(error.message);
    }
}

async function addArtist() {
    try {
        const currentUser = await getCurrentUserInfo();

        var artistData = {
            id: null,
            userId: currentUser.userId,
            name: document.getElementById('artistName').value,
            bio: document.getElementById('artistBiography').value,
            walletAddress: document.getElementById('artistWallet').value,
            links: document.getElementById('artistLinks').value,
        };

        var imageFile = document.getElementById('artistImage').files[0];

        var formData = new FormData();
        formData.append('name', artistData.name);
        formData.append('bio', artistData.bio);
        formData.append('walletAddress', artistData.walletAddress);
        formData.append('links', artistData.links);
        formData.append('image', imageFile);
        formData.append('userId', artistData.userId);

        const response = await fetch('https://localhost:7018/api/Artist', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const responseData = await response.json();
            showError(responseData.message || 'Failed to add artist');
            throw new Error(responseData.message || 'Failed to add artist');
        }

        console.log('Artist added successfully.');
    } catch (error) {
        console.error('Error adding artist:', error);
        showError(error.message);
    }
}

async function ShowArtistInfo() {
    try {
        const currentUser = await getCurrentUserInfo();
        const artistId = currentUser.artistId;

        const currentArtist = await fetch(`https://localhost:7018/api/Artist/${artistId}`);
        const currentArtistData = await currentArtist.json();

        if (!currentArtist.ok) {
            const artistImage = document.getElementById("imageDiv");
            artistImage.innerHTML = `
                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Profile Image" class="d-block ui-w-80" id="artistImagePreview">`;
            showInfoMessage(currentArtistData.message || 'You are not artist');
            throw new Error('Failed to fetch artist info');
        }

        const currentArtistName = document.getElementById("artistName");
        const currentBio = document.getElementById("artistBiography");
        const currentLinks = document.getElementById("artistLinks");
        const currentWallet = document.getElementById("artistWallet");

        const artistImage = document.getElementById("imageDiv");
        artistImage.innerHTML = `
            <img src="https://localhost:7018${currentArtistData.imageUrl}" alt="${currentArtistData.name}" class="d-block ui-w-80" id="artistImagePreview">
        `;

        currentArtistName.value = currentArtistData.name;
        currentBio.value = currentArtistData.bio;
        currentLinks.value = currentArtistData.links;
        currentWallet.value = currentArtistData.walletAddress;
    } catch (error) {
        console.log('Error fetching current artist', error);
        // showError(error.message);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        await ShowArtistInfo();

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.addEventListener('click', function () {
            console.log('Cancel button clicked');
            window.location.href = './index.html';
        });

        const saveChangesBtn = document.querySelector('.btn-primary');

        try {
            const { username, email } = await getCurrentUserInfo();
            console.log('Current username:', username);

            const usernameInput = document.getElementById('usernameInput');
            const emailInput = document.getElementById('emailInput');
            if (usernameInput && emailInput) {
                usernameInput.value = username;
                emailInput.value = email;
            }
        } catch (error) {
            console.error('Error getting current user data:', error);
        }

        const become_button = document.getElementById("div_become_button");

        saveChangesBtn.addEventListener('click', async function () {
            try {
                console.log('Save changes button clicked');
                console.log('Current tab:', currentTab, 'Current tab id: ', currentTab.id);

                if (currentTab && currentTab.id === 'account-general') {
                    console.log('General tab is active');
                    const newUsername = document.getElementById('usernameInput').value;
                    console.log('New username:', newUsername);
                    const newEmail = document.getElementById("emailInput").value;
                    try {
                        const { username } = await getCurrentUserInfo();
                        if (newUsername !== username) {
                            const usernameChangeResult = await changeUsername(newUsername);
                            console.log('Username change result:', usernameChangeResult);
                        }
                        const emailChangeResult = await changeEmail(newEmail);
                        console.log("New email:", emailChangeResult);
                        window.location.reload();
                    } catch (error) {
                        console.error('Error changing username:', error);
                    }
                } else if (currentTab.id === 'account-change-password') {
                    console.log('Change password tab is active');
                    const currentPassword = document.getElementById('currentPasswordInput').value;
                    const newPassword = document.getElementById('newPasswordInput').value;
                    console.log('Current password:', currentPassword);
                    console.log('New password:', newPassword);
                    try {
                        const passwordChangeResult = await changePassword(currentPassword, newPassword);
                        console.log('Password change result:', passwordChangeResult);
                        window.location.reload();
                    } catch (error) {
                        console.error('Error changing password:', error);
                    }
                } else if (currentTab.id === 'account-artist') {
                    console.log('Artist tab is active');

                    try {
                        const currentUser = await getCurrentUserInfo();
                        const userId = currentUser.userId;

                        const artistData = {
                            id: currentUser.artistId,
                            name: document.getElementById("artistName").value,
                            bio: document.getElementById("artistBiography").value,
                            walletAddress: document.getElementById("artistLinks").value,
                            links: document.getElementById("artistWallet").value,
                            userId: userId,
                        };

                        var newImageURL = document.getElementById('artistImage').files[0];
                        const formData = new FormData();
                        formData.append('id', artistData.id);
                        formData.append('name', artistData.name);
                        formData.append('bio', artistData.bio);
                        formData.append('walletAddress', artistData.walletAddress);
                        formData.append('links', artistData.links);
                        formData.append('userId', artistData.userId);

                        if (newImageURL != null) {
                            formData.append('image', newImageURL);
                        }

                        const token = getToken();

                        const response = await fetch(`https://localhost:7018/api/Artist/${artistData.id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                            body: formData,
                        });

                        if (response.ok) {
                            console.log('Artist updated successfully.');
                            window.location.reload();
                        } else {
                            const responseData = await response.json();
                            console.error('Artist update failed:', responseData);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.error('Error handling save changes:', error);
            }
        });

        document.getElementById('artistImage').addEventListener('change', function () {
            try {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('artistImagePreview').setAttribute('src', URL.createObjectURL(file));
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error changing artist image:', error);
                showError('Error changing artist image');
            }
        });

        $('.list-group-item').on('shown.bs.tab', async function (event) {
            const target = $(event.target).attr("href");
            console.log('Target tab:', target);

            if (target === '#account-artist') {
                const currentUser = await getCurrentUserInfo();
                const becomeButtonDiv = document.getElementById('div_become_button');
                if (currentUser.artistId == null) {
                    becomeButtonDiv.innerHTML = `<button class="btn btn-outline-primary" id="btn_become_artist" onclick="addArtist()">
                            Become artist
                        </button>`;
                } else {
                    becomeButtonDiv.innerHTML = '';
                }
            }
        });
    } catch (error) {
        console.error('Error during DOMContentLoaded:', error);
        showError('Error initializing page');
    }
});
