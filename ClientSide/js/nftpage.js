document.addEventListener("DOMContentLoaded", async function () {
  const numberOfItems = 9;
  const container = document.querySelector(".morenft_cardrow");
  const detail = document.querySelector(".nftartistinfo");

  const placeholderElement = document.getElementById('dynamicBackground');

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const nftidParam = urlParams.get('id');
    const artistIdParam = urlParams.get('artist');

    const responseNFT = await fetch(`https://localhost:7018/api/NFT/${nftidParam}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const nftData = await responseNFT.json();

    const responseArtist = await fetch(`https://localhost:7018/api/Artist/${artistIdParam}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const artistData = await responseArtist.json();

    const responseAllNFTs = await fetch('https://localhost:7018/api/NFT');
    const allNFTsData = await responseAllNFTs.json();

    const responseAllArtists = await fetch('https://localhost:7018/api/Artist');
    const allArtistsData = await responseAllArtists.json();

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
        name: allName,
        artistId: allArtistId,
      } = allNFTsData[posNFT];
      allNFTsData.splice(posNFT, 1);

      const artistDataForNFT = allArtistsData.find(artist => artist.id === allArtistId);

      const {
        imageUrl: allArtstsImages,
        name: allArtistsName,
      } = artistDataForNFT;

      const {
        id: nftId,
        name: nftNaming,
        imageUrl: nftImageUrl,
        description: nftDescription,
        artistId: nftArtistId,
        price: nftPrice
      } = nftData;

      placeholderElement.style.backgroundImage = `url(https://localhost:7018${nftData.imageUrl})`;

      const {
        imageUrl: artistImage,
        name: artistName
      } = artistData;

      divItem.innerHTML = `
        <div class="atropos my-atropos-${i}">
          <div class="atropos-scale">
            <div class="atropos-rotate">
              <div class="atropos-inner">
                <a href="nftpage.html?id=${allId}&artist=${allArtistId}" class="more_card" onclick="passNftId(${allId})">
                  <img class="cardrow_img" src="https://localhost:7018${allImageUrl}" />
                  <div class="nft_card_placeholder">
                    <h5 data-atropos-offset="5" class="marketplace_cardname sans">${allName}</h5>
                    <div data-atropos-offset="5" class="more_card_artistcard">
                      <img class="img-artist-cardrow" src="https://localhost:7018${allArtstsImages}" alt="${allArtistsName}" />
                      <p class="marketplace_cardartist base-sans">${allArtistsName}</p>
                    </div>
                    <div data-atropos-offset="5" class="more_addinfo">
                      <div class="more_addinfo_price">
                        <p style="color: #858584" class="caption-mono">Price</p>
                        <p style="color: #fff" class="base-mono">${allPrice} ETH</p>
                      </div>
                      <div class="more_addinfo_bid">
                        <p style="color: #858584" class="caption-mono grey">Highest Bid</p>
                        <p style="color: #fff" class="base-mono">${nftPrice} ETH</p>
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
          <div class="nftartistinfo_timer">
            <p class="caption-mono">Auction ends in:</p>
            <div class="nftartistinfo_timer_countdown">
              <div class="nftartistinfo_timer_item">
                <h3 class="nftartistinfo_hourtime mono">59</h3>
                <p class="nftartistinfo_hourtext caption-mono">Hours</p>
              </div>
              <h3 class="nftartistinfo_timer_divider mono">:</h3>
              <div class="nftartistinfo_timer_item">
                <h3 class="nftartistinfo_mintime mono">59</h3>
                <p class="nftartistinfo_mintext caption-mono">Minutes</p>
              </div>
              <h3 class="nftartistinfo_timer_divider mono">:</h3>
              <div class="nftartistinfo_timer_item">
                <h3 class="nftartistinfo_sectime mono">59</h3>
                <p class="nftartistinfo_sectext caption-mono">Seconds</p>
              </div>
            </div>
            <a href="#" class="nftartistinfo_button btn hvr-shrink">Place Bid</a>
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
          <div class="nftartistinfo_description">
            <p class="base-mono">Description</p>
            <p class="base-sans">${nftDescription}</p>
          </div>
          <div class="nftartistinfo_details">
            <p class="base-mono">Details</p>
            <a class="nftartistinfo_weblink">
              <img src="images/globe.svg" alt="Globe">
              <p class="base-sans">View on Etherscan</p>
            </a>
            <a class="nftartistinfo_weblink">
              <img src="images/globe.svg" alt="Globe">
              <p class="base-sans">View on Original</p>
            </a>
          </div>
          <div class="nftartistinfo_tag">
            <p class="base-mono">Tags</p>
            <div class="nftartistinfo_tags">
              <a href="marketplace.html" class="nftartistinfo_tags_item hvr-shrink">Animation</a>
              <a href="marketplace.html" class="nftartistinfo_tags_item hvr-shrink">Illustration</a>
              <a href="marketplace.html" class="nftartistinfo_tags_item hvr-shrink">Moon</a>
              <a href="marketplace.html" class="nftartistinfo_tags_item hvr-shrink">Moon</a>
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
});
