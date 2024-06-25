document.addEventListener('DOMContentLoaded', async function () {
    
    const currentUser = await getCurrentUserInfo();
    const artistId = currentUser.artistId;

    if (!artistId) {
        window.location.href = "./index.html";
    }

    const addNftForm = document.getElementById('addNftForm');
    addNftForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const userId = currentUser.userId;
        await addNFT(userId, artistId);
        alert("NFT added successfully");
    });

    function getToken() {
        return sessionStorage.getItem('token');
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

    async function fetchTokenSymbols() {
        try {
            const response = await fetch('https://localhost:7018/api/Tokens');
            if (!response.ok) {
                throw new Error('Failed to fetch token symbols');
            }
            const tokenData = await response.json();
            const select = document.getElementById('tokenSymbol');

            tokenData.forEach(token => {
                const opt = document.createElement('option');
                opt.value = token.symbol;
                opt.text = token.symbol;
                select.add(opt);
            });
        } catch (error) {
            console.error('Error fetching token symbols:', error);
            showError('Failed to fetch token symbols');
        }
    }

    fetchTokenSymbols();
});

async function addNFT(userId, artistId) {
    // Отримання обрізаного зображення
    var croppedImage = document.getElementById('croppedResult');

    // Створення canvas для отримання файлу
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = croppedImage.width;
    canvas.height = croppedImage.height;
    ctx.drawImage(croppedImage, 0, 0, croppedImage.width, croppedImage.height);

    // Отримання файлу зображення з canvas
    canvas.toBlob(async function(blob) {
        var nftData = {
            name: document.getElementById('nftName').value,
            description: document.getElementById('nftDescription').value,
            price: parseFloat(document.getElementById('nftPrice').value),
            tokenSymbol: document.getElementById('tokenSymbol').value,
            forSale: document.getElementById('marketplaceAvailability').value, // оновлено для відповідності ідентифікатора елементу
            artistId: artistId,
            isSold: false,
            ownerId: userId,
        };

        var formData = new FormData();
        formData.append('name', nftData.name);
        formData.append('description', nftData.description);
        formData.append('price', nftData.price);
        formData.append('tokenSymbol', nftData.tokenSymbol);
        formData.append('forSale', nftData.forSale);
        formData.append('artistId', nftData.artistId);
        formData.append('isSold', nftData.isSold);
        formData.append('ownerId', nftData.ownerId);
        formData.append('image', blob, 'croppedImage.png');
        
        try {
            const token = getToken();
            const responseNFT = await fetch('https://localhost:7018/api/NFT', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const responseData = await responseNFT.json();

            if (responseNFT.ok) {
                console.log('NFT added successfully.');
                document.getElementById('addNftForm').reset();
            } else {
                console.error('NFT add failed:', responseData);
            }
        } catch (error) {
            console.error('Error adding NFT:', error);
            if (error.response && error.response.status === 400) {
                console.error('Validation errors:', error.response.errors);
            }
        }
    }, 'image/png');
}

function showError(message) {
    alert(`Error: ${message}`);
}
