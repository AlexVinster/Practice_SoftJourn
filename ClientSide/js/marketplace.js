document.addEventListener("DOMContentLoaded", async function () {
    const numberOfItems = 12;
    const container = document.querySelector(".marketplace_cardrow");
    let originalNftsData = []; // Зберігає оригінальні дані NFT

    // Функція для застосування фільтрів
    // async function applyFilters() {
    //     const minPrice = document.getElementById('minPrice').value;
    //     const maxPrice = document.getElementById('maxPrice').value;
    //     const artistName = document.getElementById('artistName').value;
    //     const forSale = document.getElementById('forSale').checked;

    //     // Формування параметрів запиту
    //     const queryParams = new URLSearchParams({
    //         minPrice: minPrice ? parseFloat(minPrice) : '',
    //         maxPrice: maxPrice ? parseFloat(maxPrice) : '',
    //         artistName: artistName || '',
    //         forSale: forSale ? 'true' : 'false',
    //     });

    //     // Запит на сервер з параметрами фільтрів
    //     const response = await fetch(`https://localhost:7018/api/NFT/filter?${queryParams}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     // Оновлення контейнера з відфільтрованими даними
    //     const artworks = await response.json();
    //     updateArtworksContainer(artworks);
    // }

    // Функція для оновлення контейнера з NFT
    function updateArtworksContainer(artworks) {
        container.innerHTML = '';
        artworks.forEach(artwork => {
            const artworkElement = createArtworkElement(artwork);
            container.appendChild(artworkElement);
        });
    }

    // Функція для створення HTML-елемента для одного NFT
    function createArtworkElement(artwork) {
        const artworkElement = document.createElement('div');
        artworkElement.className = 'artwork-card';

        const artistName = artwork.artist ? artwork.artist.name : 'Unknown Artist';
        const priceToShow = artwork.forSale ? `${artwork.price} ${artwork.tokenSymbol}` : 'Not For Sale';

        artworkElement.innerHTML = `
          <img src="${artwork.imageUrl}" alt="${artwork.title}">
          <h3>${artwork.title}</h3>
          <p>${artistName}</p>
          <p>${priceToShow}</p>
          <p>${artwork.forSale ? 'For Sale' : 'Not For Sale'}</p>
      `;

        return artworkElement;
    }

    try {
        // Отримання оригінальних даних про NFT
        const responseNFT = await fetch('https://localhost:7018/api/NFT');
        originalNftsData = await responseNFT.json(); // Зберігання оригінальних даних

        // Відображення загальної кількості NFT
        const nftsCount = originalNftsData.length;
        document.getElementById("NFTsCount").textContent = nftsCount;

        // Відображення перших 12 NFT
        displayFirstNFTs(originalNftsData);

    } catch (error) {
        console.log('Error fetching NFTs:', error);
    }

    // Відображення перших 12 NFT
    function displayFirstNFTs(nftsData) {
        for (let i = 0; i < numberOfItems; i++) {
            const divItem = document.createElement("div");
            divItem.classList.add("more_cardrow_item");

            if (i >= 5 && i <= 7) {
                divItem.classList.add("secondrow");
            }
            if (i >= 8) {
                divItem.classList.add("thirdrow");
            }

            const posNFT = Math.floor(Math.random() * nftsData.length);
            const {
                id: nftId,
                imageUrl: nftImageUrl,
                price,
                name: nftNaming,
                forSale,
                tokenSymbol,
                artistId: nftArtistId,
                ownerId: nftOwnerId
            } = nftsData[posNFT];
            nftsData.splice(posNFT, 1);

            const artistData = fetchArtistData(nftArtistId);
            artistData.then(artistData => {
                const { imageUrl: artistImage, name: artistName } = artistData;

                divItem.innerHTML = `
                  <div class="atropos my-atropos-${i}">
                      <div class="atropos-scale">
                          <div class="atropos-rotate">
                              <div class="atropos-inner">
                                  <a href="nftpage.html?id=${nftId}&artist=${nftArtistId}&ownerId=${nftOwnerId}" id="more_card" onclick="passNftId(${nftId})">
                                      <img class="cardrow_img" src="https://localhost:7018${nftImageUrl}" />
                                      <div class="marketplace_card_placeholder">
                                          <h5 data-atropos-offset="5" class="marketplace_cardname sans">${nftNaming}</h5>
                                          <div data-atropos-offset="5" class="more_card_artistcard">
                                              <img class="img-artist-cardrow" src="https://localhost:7018${artistImage}" alt="" />
                                              <p class="marketplace_cardartist base-sans">${artistName}</p>
                                          </div>
                                          <div data-atropos-offset="5" class="more_addinfo">
                                              <div class="more_addinfo_price">
                                                  <p style="color: #858584" class="caption-mono">Price</p>
                                                  <p style="color: #fff" class="base-mono">${forSale ? `${price} ${tokenSymbol}` : "Not For Sale"}</p>
                                              </div>
                                          </div>
                                      </div>
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>
              `;
                container.appendChild(divItem);
                atroposFunc(i);
            });
        }
    }

    // Функція для отримання даних про художника
    async function fetchArtistData(artistId) {
        const response = await fetch(`https://localhost:7018/api/Artist/${artistId}`);
        const artistData = await response.json();
        return artistData;
    }
});
