// Function to display a success message
function displaySuccessMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('success-message');
  messageContainer.textContent = message;

  document.body.appendChild(messageContainer);

  // Automatically remove the message after 3 seconds
  setTimeout(() => {
    messageContainer.remove();
  }, 3000);
}

// Function to display an error message
function displayErrorMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('error-message');
  messageContainer.textContent = message;

  document.body.appendChild(messageContainer);

  // Automatically remove the message after 3 seconds
  setTimeout(() => {
    messageContainer.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", async function () {
  const numberOfItems = 9;
  const container = document.querySelector(".morenft_cardrow");
  const detail = document.querySelector(".nftartistinfo");
  const placeholderElement = document.getElementById('dynamicBackground');
  let buyerId = null;
  let nftIdForSale = null; // Variable to store the ID of the NFT being sold

  const style = document.createElement('style');
  style.innerHTML = `
    .success-message, .error-message {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px;
      border-radius: 5px;
      z-index: 1000;
      font-family: Arial, sans-serif;
      color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .success-message {
      background-color: green;
    }

    .error-message {
      background-color: red;
    }
  `;
  document.head.appendChild(style);

  try {
    const currentUser = await getCurrentUserInfo();

    const urlParams = new URLSearchParams(window.location.search);
    const nftidParam = urlParams.get('id');
    const artistIdParam = urlParams.get('artist');
    const ownerIdParam = urlParams.get('nftOwnerId');

    const responseNFT = await fetch(`https://localhost:7018/api/NFT/${nftidParam}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const nftData = await responseNFT.json();

    const responseArtist = await fetch(`https://localhost:7018/api/Artist/${artistIdParam}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const artistData = await responseArtist.json();

    const responseOwner = await fetch(`https://localhost:7018/api/Users/getUserById/${ownerIdParam}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const ownerData = await responseOwner.json();

    const responseAllNFTs = await fetch('https://localhost:7018/api/NFT');
    const allNFTsData = await responseAllNFTs.json();

    const responseAllArtists = await fetch('https://localhost:7018/api/Artist');
    const allArtistsData = await responseAllArtists.json();

    let sellButtonPresent = false; // Flag to determine if "Sell NFT" button is present

    for (let i = 0; i < numberOfItems; i++) {
      const divItem = document.createElement("div");
      divItem.classList.add("more_cardrow_item");

      if (i > 1 && i < 6) {
        divItem.classList.add("secondrow");
      }
      if (i >= 5) {
        divItem.classList.add("thirdrow");
      }

      const posNFT = Math.floor(Math.random() * allNFTsData.length);
      const {
        id: allId,
        imageUrl: allImageUrl,
        price: allPrice,
        forSale: allForSale,
        tokenSymbol: allTokenSymbol,
        name: allName,
        artistId: allArtistId,
        ownerId: allOwnerId,
      } = allNFTsData[posNFT];
      allNFTsData.splice(posNFT, 1);

      const artistDataForNFT = allArtistsData.find(artist => artist.id === allArtistId);

      const {
        imageUrl: allArtistsImages,
        name: allArtistsName,
      } = artistDataForNFT;

      const {
        id: nftId,
        name: nftNaming,
        imageUrl: nftImageUrl,
        description: nftDescription,
        artistId: nftArtistId,
        price: nftPrice,
        forSale: forSale,
        tokenSymbol: tokenSymbol,
        ownerId: nftOwnerId,
      } = nftData;

      placeholderElement.innerHTML = `<img class="nftImage" src="https://localhost:7018${nftData.imageUrl}" alt="${nftNaming}">`;

      const {
        imageUrl: artistImage,
        name: artistName
      } = artistData;

      const priceToShow = forSale ? `${nftPrice} ${tokenSymbol}` : "Not For Sale";
      const allPriceToShow = allForSale ? `${allPrice} ${allTokenSymbol}` : "Not For Sale";

      const responseUserById = await fetch(`https://localhost:7018/api/Users/getUserById/${nftOwnerId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const userIdData = await responseUserById.json();

      const {
        id: ownerId,
        userName: ownerUsername,
      } = userIdData;

      divItem.innerHTML = `
        <div class="atropos my-atropos-${i}">
          <div class="atropos-scale">
            <div class="atropos-rotate">
              <div class="atropos-inner">
                <a href="nftpage.html?id=${allId}&artist=${allArtistId}&ownerId=${allOwnerId}" class="more_card" onclick="passNftId(${allId})">
                  <img class="cardrow_img" src="https://localhost:7018${allImageUrl}" />
                  <div class="nft_card_placeholder">
                    <h5 data-atropos-offset="5" class="marketplace_cardname sans">${allName}</h5>
                    <div data-atropos-offset="5" class="more_card_artistcard">
                      <img class="img-artist-cardrow" src="https://localhost:7018${allArtistsImages}" alt="${allArtistsName}" />
                      <p class="marketplace_cardartist base-sans">${allArtistsName}</p>
                    </div>
                    <div data-atropos-offset="5" class="more_addinfo">
                      <div class="more_addinfo_price">
                        <p style="color: #858584" class="caption-mono">Price</p>
                        <p style="color: #fff" class="${allForSale ? 'base-mono' : ''}">${allPriceToShow}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      detail.innerHTML = `
        <div class="nftartistinfo_inner">
          <article class="nftartistinfo_headline">
            <h4 class="sans">${nftNaming}</h4>
            <p style="color: #858584" class="base-sans">
              Minted on Sep 30, 2022
            </p>
          </article>
          <div class="nftbuy_window">
            <p class="base-sans">Price:</p>
            <div class="nftbuy_cont">
              <div class="nftbuy_item">
                <h3 style="color: #fff; ${forSale ? 'font-family: "Space-Mono-Bold";' : 'font-family: inherit;'}" class="nftartistinfo_hourtime ${forSale ? 'mono' : ''}">${priceToShow}</h3>
              </div>
            </div>
            <button id="buyButton" class="nftartistinfo_button btn hvr-shrink">Buy NFT</button>
            <button id="saleButton-${nftId}" class="nftartistinfo_button btn hvr-shrink" style="display: none;">Sell NFT</button>
          </div>
          <div class="nftartistinfo_artistcard">
            <p class="base-mono">Created By</p>
            <div class="nftartistinfo_card">
              <a href="artistpage.html?artistId=${nftArtistId}" class="nftartistinfo_card hvr-shrink">
                <img class="img-artist-cardrow" src="https://localhost:7018${artistImage}" alt="${artistName}">
                <p class="base-sans">${artistName}</p>
              </a>
            </div>
          </div>
          <div class="nftownerinfo_artistcard">
            <p class="base-mono">Owner</p>
            <div class="nftownerinfo_artistcard">
              <a href="ownerpage.html?ownerId=${ownerId}">
                <p class="base-sans">${ownerUsername}</p>
              </a>
            </div>
          </div>
          <div class="nftartistinfo_description">
            <p class="base-mono">Description</p>
            <p class="base-sans">${nftDescription}</p>
          </div>
        </div>
      `;

      container.appendChild(divItem);

      const modal = document.getElementById("modal-sell");
      const buyButton = document.getElementById("buyButton");
      const saleButton = document.getElementById(`saleButton-${nftId}`);

      if (currentUser.userId === nftOwnerId) {
        saleButton.style.display = "block";
        sellButtonPresent = true; // Set flag indicating "Sell NFT" button is present

        saleButton.addEventListener("click", () => {
          nftIdForSale = nftId; // Store the ID of the NFT to be sold
          openSaleModal();
        });
      }

      if (currentUser.userId === nftOwnerId) {
        buyButton.disabled = true; // Disable "Buy NFT" button if current user is the owner
        buyButton.classList.add("disabled");
      } else if (!currentUser.userId || !forSale) {
        buyButton.disabled = true; // Disable "Buy NFT" button if user is not logged in or NFT is not for sale
        buyButton.classList.add("disabled");
      }

      if (sellButtonPresent) {
        const nftbuyWindow = document.querySelector('.nftbuy_window');
        nftbuyWindow.style.height = '300px';
      }

      buyButton.addEventListener("click", async () => {
        try {
          const currentUser = await getCurrentUserInfo();
          buyerId = currentUser.userId;

          const response = await fetch(`https://localhost:7018/api/NFT/buy/${nftId}?paymentTokenSymbol=${tokenSymbol}&buyerId=${buyerId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${getToken()}`
            }
          });

          if (response.ok) {
            displaySuccessMessage("NFT purchased successfully!");
          } else {
            displayErrorMessage("Error purchasing NFT: " + response.statusText);
          }
        } catch (error) {
          displayErrorMessage("Error purchasing NFT: " + error.message);
        }
      });

      function openSaleModal() {
        const modal = document.getElementById("modal-sell");
        const sellPriceInput = document.getElementById("sellPrice");
        const sellTokenInput = document.getElementById("sellToken");
        const sellButton = document.getElementById("sellButton");

        sellPriceInput.value = "";
        sellTokenInput.innerHTML = "";
        fetchTokenSymbols();

        modal.style.display = "block";

        const closeBtn = modal.querySelector(".close");
        closeBtn.addEventListener("click", () => {
          modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        });

        sellButton.addEventListener("click", async () => {
          const sellPrice = sellPriceInput.value.trim();
          const sellToken = sellTokenInput.value.trim();

          if (!sellPrice || !sellToken) {
            displayErrorMessage("Please enter both price and token symbol.");
            return;
          }

          try {
            const response = await fetch(`https://localhost:7018/api/NFT/${nftIdForSale}/forsale?price=${sellPrice}&ownerId=${nftOwnerId}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${getToken()}`,
              }
            });

            if (response.ok) {
              alert("NFT listed for sale successfully!");
              modal.style.display = "none";
            } else {
              displayErrorMessage("Error listing NFT for sale.");
            }
          } catch (error) {
            displayErrorMessage("Error listing NFT for sale: " + error.message);
          }
        });
      }
    }

    if (!sellButtonPresent) {
      const saleButton = document.getElementById(`saleButton-${nftIdForSale}`);
      if (saleButton) {
        saleButton.style.display = "block";
        saleButton.addEventListener("click", () => {
          openSaleModal();
        });
      }
    }

  } catch (error) {
    console.error('Error loading NFT data:', error);
  }

  async function fetchTokenSymbols() {
    try {
      const response = await fetch('https://localhost:7018/api/Tokens');
      const tokenData = await response.json();
      const select = document.getElementById('sellToken');

      tokenData.forEach(token => {
        const opt = document.createElement('option');
        opt.value = token.symbol;
        opt.text = token.symbol;
        select.add(opt);
      });

      if (tokenData.length > 0) {
        const defaultTokenSymbol = tokenData[0].symbol;
        select.value = defaultTokenSymbol;
      }

    } catch (error) {
      console.error('Error fetching token symbols:', error);
    }
  }

});
