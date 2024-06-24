document.addEventListener("DOMContentLoaded", async function () {
  const numberOfItems = 9;
  const artistImagePlaceholder = document.getElementById('artistImagePlaceholder');

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const artistIdParam = urlParams.get('artistId');

    if (!artistIdParam) {
      console.error('Artist ID not found in URL parameters.');
      return;
    }

    const artistResponse = await fetch(`https://localhost:7018/api/Artist/${artistIdParam}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!artistResponse.ok) {
      console.error('Error fetching artist data.');
      return;
    }

    const artistData = await artistResponse.json();

    const container = document.querySelector("#created-tab-content");
    const detail = document.querySelector(".artistinfo");

    const responseAllNFTs = await fetch('https://localhost:7018/api/NFT');
    if (!responseAllNFTs.ok) {
      console.error('Error fetching NFTs data.');
      return;
    }
    const allNFTsData = await responseAllNFTs.json();

    const responseAllArtists = await fetch('https://localhost:7018/api/Artist');
    if (!responseAllArtists.ok) {
      console.error('Error fetching artists data.');
      return;
    }
    const allArtistsData = await responseAllArtists.json();

    console.log('All NFTs Data:', allNFTsData);
    console.log('All Artists Data:', allArtistsData);

    // Переконаємось, що artistIdParam є рядком для коректного порівняння
    const artistNFTs = allNFTsData.filter(nft => String(nft.artistId) === artistIdParam);

    if (artistNFTs.length === 0) {
      console.log('No NFTs found for this artist.');
      return;
    }

    for (let i = 0; i < Math.min(numberOfItems, artistNFTs.length); i++) {
      const divItem = document.createElement("div");
      divItem.classList.add("more_cardrow_item");

      if (i > 1 && i < 6) {
        divItem.classList.add("secondrow");
      }
      if (i >= 5) {
        divItem.classList.add("thirdrow");
      }

      const {
        id: allId,
        imageUrl: allImageUrl,
        price: allPrice,
        forSale,
        tokenSymbol,
        name: allName,
        artistId: allArtistId,
      } = artistNFTs[i];

      const artistDataForNFT = allArtistsData.find(artist => String(artist.id) === String(allArtistId));
      const {
        imageUrl: allArtistsImages,
        name: allArtistsName,
      } = artistDataForNFT;

      const {
        imageUrl: artistImage,
        name: artistName,
        bio: biography,
      } = artistData;

      artistImagePlaceholder.src = `https://localhost:7018${artistImage}`;

      divItem.innerHTML = `
      <div class="atropos my-atropos-${i}">
        <div class="atropos-scale">
          <div class="atropos-rotate">
            <div class="atropos-inner">
              <a href="nftpage.html?id=${allId}&artist=${allArtistId}" class="more_card" onclick="passNftId(${allId})">
                <img class="cardrow_img" src="https://localhost:7018${allImageUrl}" />
                <div class="marketplace_card_placeholder">
                  <h5 data-atropos-offset="5" class="marketplace_cardname sans">${allName}</h5>
                  <div data-atropos-offset="5" class="more_card_artistcard">
                    <img class="img-artist-cardrow" src="https://localhost:7018${allArtistsImages}" alt="${allArtistsName}" />
                    <p class="marketplace_cardartist base-sans">${allArtistsName}</p>
                  </div>
                                          <div data-atropos-offset="5" class="more_addinfo">
                                              <div class="more_addinfo_price">
                                                  <p style="color: #858584" class="caption-mono">Price</p>
                                                  <p style="color: #fff" class="base-mono">${forSale ? `${allPrice} ${tokenSymbol}` : "Not For Sale"}</p>
                                              </div>
                   <!-- <div class="more_addinfo_bid">
                      <p style="color: #858584" class="caption-mono grey">Highest Bid</p>
                      <p style="color: #fff" class="base-mono">${allPrice} ETH</p>
                    </div> -->
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      `;

      detail.innerHTML = `
      <div class="artistinfo_inner">
        <h4 class="sans">${artistName}</h4>
        <div class="artistinfo_buttons">
          <a href="#" style="background-color: #a259ff" class="artistinfo_button btn hvr-shrink">
            <img src="images/copy.svg" alt="Copy">0xc0E3...B79C</a>
          <a href="" class="artistinfo_button btn hvr-shrink">
            <img src="images/plus.svg" alt="Plus">Follow</a>
        </div>
        <article class="artistinfo_bio">
          <p style="color: #858584" class="base-mono">Bio</p>
          <p class="base-sans">${biography}</p>
        </article>
        <div class="artistinfo_links">
          <p style="color: #858584" class="base-mono">Links</p>
          <div class="artistinfo_socials">
            <a href="https://www.google.com/" class="hvr-shrink">
              <img src="images/globe.svg" alt="Globe">
            </a>
            <a href="https://discord.com/" class="hvr-shrink">
              <img src="images/discord.svg" alt="Discord">
            </a>
            <a href="https://www.youtube.com/" class="hvr-shrink">
              <img src="images/youtube.svg" alt="Youtube">
            </a>
            <a href="https://twitter.com/" class="hvr-shrink">
              <img src="images/twitter.svg" alt="Twitter">
            </a>
            <a href="https://www.instagram.com/" class="hvr-shrink">
              <img src="images/instagram.svg" alt="Instagram">
            </a>
          </div>
        </div>
      </div>
      `;
      container.appendChild(divItem);
      atroposFunc(i);
    }
  } catch (error) {
    console.log('Error fetching artist:', error);
  }
});
