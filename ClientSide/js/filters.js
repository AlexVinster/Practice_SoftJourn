// File: js/filters.js

async function applyFilters() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const artistName = document.getElementById('artistName').value;
    const forSale = document.getElementById('forSale').checked;

    const queryParams = new URLSearchParams({
        minPrice: minPrice ? parseFloat(minPrice) : '',
        maxPrice: maxPrice ? parseFloat(maxPrice) : '',
        artistName: artistName || '',
        forSale: forSale ? 'true' : 'false',
    });

    const response = await fetch(`https://localhost:7018/api/NFT/filter?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const artworks = await response.json();
    updateArtworksContainer(artworks);
}

function updateArtworksContainer(artworks) {
    const container = document.getElementById('marketplace_cardrow');
    container.innerHTML = '';
    artworks.forEach(artwork => {
      const artworkElement = document.createElement('div');
      artworkElement.className = 'artwork-card';
      artworkElement.innerHTML = `
        <img src="${artwork.imageUrl}" alt="${artwork.title}">
        <h3>${artwork.title}</h3>
        <p>${artwork.artist.name}</p>
        <p>$${artwork.price}</p>
        <p>${artwork.forSale ? 'For Sale' : 'Not For Sale'}</p>
      `;
      container.appendChild(artworkElement);
    });
  }

document.addEventListener("DOMContentLoaded", async function () {
    const numberOfItems = 12;
    const container = document.querySelector(".marketplace_cardrow");

    try {
        const responseNFT = await fetch('https://localhost:7018/api/NFT');
        const nftsData = await responseNFT.json();

        const responseArtist = await fetch('https://localhost:7018/api/Artist');
        const artistsData = await responseArtist.json();

        const nftsCount = nftsData.length;

        document.getElementById("NFTsCount").textContent = nftsCount;

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
                forSale: forSale,
                tokenSymbol: tokenSymbol,
                artistId: nftArtistId,
            } = nftsData[posNFT];
            nftsData.splice(posNFT, 1);

            const artistData = artistsData.find(artist => artist.id === nftArtistId);

            const {
                imageUrl: artistImage,
                name: artistName,
            } = artistData;

            const priceToShow = forSale ? `${price} ${tokenSymbol}` : "NotForSale";

            divItem.innerHTML = `
                <div class="atropos my-atropos-${i}">
                    <div class="atropos-scale">
                        <div class="atropos-rotate">
                            <div class="atropos-inner">
                                <a href="nftpage.html?id=${nftId}&artist=${nftArtistId}" id="more_card" onclick="passNftId(${nftId})">
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
                                                <p style="color: #fff" class="base-mono">${priceToShow}</p>
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
        }
    } catch (error) {
        console.log('Error fetching NFTs:', error);
    }

    window.applyFilters = applyFilters;
});
