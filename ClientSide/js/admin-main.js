function getToken() {
    return sessionStorage.getItem('token');
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.addEventListener('DOMContentLoaded', async function () {
    const token = getToken();
    if (!token) {
        window.location.href = './admin-login.html'; 
    }
    
    const decodedToken = parseJwt(token);
    console.log('Decoded:', decodedToken);

    // Перевірка наявності ролі "Admin"
    const isAdmin = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] &&
                    decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].includes('Admin');

    if (isAdmin) {
        console.log('Користувач є адміном.');
        // Ваш код для адміністратора
    } else {
        console.log('Користувач не є адміном.');
        window.location.href = './index.html'
    }
});



async function showUsers() {
    hideAll();
    document.getElementById('users').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5069/api/Users');
        const usersData = await response.json();

        const usersTableBody = document.getElementById('usersTableBody');
        usersTableBody.innerHTML = '';

        usersData.forEach(user => {
            const row = usersTableBody.insertRow();
            row.innerHTML = `<td>${user.id}</td><td>${user.userName}</td><td>${user.email}</td>`;
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function showNFTs() {
    hideAll();
    document.getElementById('nfts').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5069/api/NFT');
        const nftsData = await response.json();

        const nftsTableBody = document.getElementById('nftsTableBody');
        nftsTableBody.innerHTML = '';

        nftsData.forEach(nft => {
            const row = nftsTableBody.insertRow();
            row.innerHTML = `<td>${nft.id}</td>
                            <td>${nft.name}</td>
                            <td>${nft.price}</td>
                            <td>${nft.description}</td>
                            <td>${nft.imageUrl}</td>
                            <td><img src="http://localhost:5069${nft.imageUrl}" alt="${nft.name}" style="max-width: 100px; max-height: 100px;"></td>
                            <td>${nft.artistId}</td>
                            <td class="admin-actions">
                            <button class="btn modal_button hvr-shrink small-btn" onclick="editNFT(${nft.id})">Edit</button>
                            <button class="btn modal_button hvr-shrink small-btn" onclick="deleteNFT(${nft.id})">Delete</button></td>`;
        });
    } catch (error) {
        console.error('Error fetching NFTs:', error);
    }
}

async function showArtists() {
    hideAll();
    document.getElementById('artists').style.display = 'block';

    try {
        const response = await fetch('http://localhost:5069/api/Artist');
        const usersData = await response.json();

        const usersTableBody = document.getElementById('artistsTableBody');
        usersTableBody.innerHTML = '';

        usersData.forEach(artist => {
            const row = usersTableBody.insertRow();
            row.innerHTML = `<td>${artist.id}</td>
                            <td>${artist.name}</td>
                            <td>${artist.bio}</td>
                            <td>${artist.dateRegistered}</td>
                            <td>${artist.walletAddress}</td>
                            <td>${artist.links}</td>
                            <td>${artist.imageUrl}</td>
                            <td><img src="http://localhost:5069${artist.imageUrl}" alt="${artist.name}" style="max-width: 100px; max-height: 100px;"></td>
                            <td class="admin-actions">
                            <button class="btn modal_button hvr-shrink small-btn" onclick="editArtist(${artist.id})">Edit</button>
                            <button class="btn modal_button hvr-shrink small-btn" onclick="deleteArtist(${artist.id})">Delete</button></td>
                            `;
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function updateNFT() {
    try {
        const nftData = {
            id: currentNFTId,
            name: document.getElementById('editNFTName').value,
            description: document.getElementById('editNFTDescription').value,
            price: document.getElementById('editNFTPrice').value,
            artistId: document.getElementById('editNftArtistId').value,
        };

        const updatedImageFile = document.getElementById('editNFTPhoto').files[0];

        const formData = new FormData();
        formData.append('id', nftData.id);
        formData.append('name', nftData.name);
        formData.append('description', nftData.description);
        formData.append('price', nftData.price);
        formData.append('artistId', nftData.artistId);

        if (updatedImageFile != null) {
            formData.append('image', updatedImageFile);
        }

        const response = await fetch(`http://localhost:5069/api/NFT/${nftData.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('NFT updated successfully.');
            await showNFTs();
        } else {
            const responseData = await response.json();
            console.error('NFT update failed:', responseData);
        }
    } catch (error) {
        console.error('Error updating NFT:', error);
    }

    closeEditNFTModal();
}

async function updateArtist() {
    try {
        const artistData = {
            id: currentArtistId,
            name: document.getElementById('editArtistName').value,
            bio: document.getElementById('editArtistBiography').value,
            walletAddress: document.getElementById('editArtistWallet').value,
            links: document.getElementById('editArtistLinks').value,
        };

        const updatedImageFile = document.getElementById('editArtistImage').files[0];

        const formData = new FormData();
        formData.append('id', artistData.id);
        formData.append('name', artistData.name);
        formData.append('bio', artistData.bio);
        formData.append('walletAddress', artistData.walletAddress);
        formData.append('links', artistData.links);

        if (updatedImageFile != null) {
            formData.append('image', updatedImageFile);
        }

        const response = await fetch(`http://localhost:5069/api/Artist/${artistData.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Artist updated successfully.');
            await showArtists();
        } else {
            const responseData = await response.json();
            console.error('Artist update failed:', responseData);
        }
    } catch (error) {
        console.error('Error updating artist:', error);
    }

    closeEditArtistModal();
}

function showAddNFT() {
    hideAll();
    document.getElementById('add-nft').style.display = 'block';
}
function showAddArtist() {
    hideAll();
    document.getElementById('add-artist').style.display = 'block';
}

function hideAll() {
    document.getElementById('users').style.display = 'none';
    document.getElementById('nfts').style.display = 'none';
    document.getElementById('add-nft').style.display = 'none';
    document.getElementById('artists').style.display = 'none';
    document.getElementById('add-artist').style.display = 'none';
}

function toggleSidebar() {
    var sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('closed');
}

function editNFT(id) {
    fetch(`http://localhost:5069/api/NFT/${id}`)
        .then(response => response.json())
        .then(nftData => {
            currentNFTId = id;

            document.getElementById('editNFTName').value = nftData.name;
            document.getElementById('editNFTDescription').value = nftData.description;
            const formattedPrice = nftData.price.toString().replace('.', ',');
            document.getElementById('editNFTPrice').value = formattedPrice;
            document.getElementById('editNftArtistId').value = nftData.artistId;

            document.getElementById('editNFTModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching NFT data:', error));
}

function editArtist(id) {
    fetch(`http://localhost:5069/api/Artist/${id}`)
        .then(response => response.json())
        .then(artistData => {
            currentArtistId = id;

            document.getElementById('editArtistName').value = artistData.name;
            document.getElementById('editArtistBiography').value = artistData.bio;
            document.getElementById('editArtistWallet').value = artistData.walletAddress;
            document.getElementById('editArtistLinks').value = artistData.links;

            document.getElementById('editArtistModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching artist data:', error));
}

async function deleteArtist(id) {
    try {
        const response = await fetch(`http://localhost:5069/api/Artist/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (response.ok) {
            console.log(`Artist with id ${id} deleted successfully.`);

            const deletedRow = document.getElementById(`artistRow-${id}`);
            if (deletedRow) {
                deletedRow.remove();
            } else {
                console.error(`Element with id 'artistRow-${id}' not found.`);
            }
            showArtists();
        } else {
            const responseData = await response.json();
            console.error('Artist deletion failed:', responseData);
        }
    } catch (error) {
        console.error('Error deleting artist:', error);
    }
}

async function deleteNFT(id) {
    try {
        const response = await fetch(`http://localhost:5069/api/NFT/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (response.ok) {
            console.log(`NFT with id ${id} deleted successfully.`);

            const deletedRow = document.getElementById(`nftRow-${id}`);
            if (deletedRow) {
                deletedRow.remove();

            } else {
                console.error(`Element with id 'nftRow-${id}' not found.`);
            }
            showNFTs();
        } else {
            const responseData = await response.json();
            console.error('NFT deletion failed:', responseData);
        }
    } catch (error) {
        console.error('Error deleting NFT:', error);
    }
}


function closeEditNFTModal() {
    document.getElementById('editNFTModal').style.display = 'none';
}
function closeEditArtistModal() {
    document.getElementById('editArtistModal').style.display = 'none';
}

async function addNFT() {
    var nftData = {
        id: null,
        name: document.getElementById('nftName').value,
        description: document.getElementById('nftDescription').value,
        price: document.getElementById('nftPrice').value,
        artistId: document.getElementById('artistId').value,
    };

    var imageFile = document.getElementById('nftImage').files[0];

    var formData = new FormData();
    formData.append('name', nftData.name);
    formData.append('description', nftData.description);
    formData.append('price', nftData.price);
    formData.append('artistId', nftData.artistId);
    formData.append('image', imageFile);

    try {
        const response = await fetch('http://localhost:5069/api/NFT', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('NFT added successfully.');

            showNFTs();
        } else {
            const responseData = await response.json();
            console.error('NFT add failed:', responseData);
        }
    } catch (error) {
        console.error('Error adding NFT:', error);
        if (response.status === 400) {
            const responseData = await response.json();
            console.error('Validation errors:', responseData.errors);
        }
    }
}

async function addArtist() {
    var artistData = {
        id: null,
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

    try {
        const response = await fetch('http://localhost:5069/api/Artist', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Artist added successfully.');
            showArtists();
        } else {
            const responseData = await response.json();
            console.error('Artist add failed:', responseData);
        }
    } catch (error) {
        console.error('Error adding artist:', error);
        if (response.status === 400) {
            const responseData = await response.json();
            console.error('Validation errors:', responseData.errors);
        }
    }
}
