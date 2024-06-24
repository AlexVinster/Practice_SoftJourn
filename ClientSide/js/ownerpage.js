document.addEventListener("DOMContentLoaded", async function () {
  const numberOfItems = 9;
  const container = document.getElementById('created-tab-content');
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('ownerId');

  async function getUserInfoById(userId) {
      try {
          const response = await fetch(`https://localhost:7018/api/Users/getUserById/${userId}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
          });
          if (!response.ok) {
              throw new Error('Failed to fetch user data.');
          }
          const data = await response.json();
          console.log('User data:', data);
          return data;
      } catch (error) {
          console.error('Error getting user data:', error);
          return null;
      }
  }

  try {
      // Fetch user information
      const user = await getUserInfoById(userId);
      if (!user) {
          console.error('Failed to get user info.');
          return;
      }

      // Display user information
      const detail = document.querySelector(".artistinfo");
      const {
          userName: ownerUsername,
      } = user;

      detail.innerHTML = `
          <div style="gap: 0px;" class="artistinfo_inner">
              <h4 class="sans">${ownerUsername}</h4>
              <article class="artistinfo_bio">
                  <p style="color: #858584" class="base-mono">Owner</p>
                  <p class="base-sans"></p>
              </article>
          </div>
      `;

      // Fetch all NFTs
      const responseAllNFTs = await fetch('https://localhost:7018/api/NFT');
      if (!responseAllNFTs.ok) {
          throw new Error('Failed to fetch NFTs.');
      }
      const allNFTsData = await responseAllNFTs.json();

      // Filter NFTs by ownerId
      const userNFTs = allNFTsData.filter(nft => String(nft.ownerId) === String(userId));

      if (userNFTs.length === 0) {
          console.log('No NFTs found for this user.');
          return;
      }

      // Display user's NFTs
      for (let i = 0; i < Math.min(numberOfItems, userNFTs.length); i++) {
          const {
              id: nftId,
              imageUrl: nftImageUrl,
              name: nftName,
              artistId: nftArtistId,
              price: nftPrice,
              tokenSymbol
          } = userNFTs[i];

          const responseArtist = await fetch(`https://localhost:7018/api/Artist/${nftArtistId}`, {
              headers: { 'Content-Type': 'application/json' }
          });
          if (!responseArtist.ok) {
              throw new Error('Failed to fetch artist data.');
          }
          const artistData = await responseArtist.json();

          const {
              imageUrl: artistImageUrl,
              name: artistName
          } = artistData;

          const divItem = document.createElement("div");
          divItem.classList.add("more_cardrow_item");

          if (i > 1 && i < 6) {
              divItem.classList.add("secondrow");
          }
          if (i >= 5) {
              divItem.classList.add("thirdrow");
          }

          divItem.innerHTML = `
              <div class="atropos my-atropos-${i}">
                  <div class="atropos-scale">
                      <div class="atropos-rotate">
                          <div class="atropos-inner">
                              <a href="nftpage.html?id=${nftId}&artist=${nftArtistId}&ownerId=${userId}" class="more_card" onclick="passNftId(${nftId})">
                                  <img class="cardrow_img" src="https://localhost:7018${nftImageUrl}" />
                                  <div class="marketplace_card_placeholder">
                                      <h5 data-atropos-offset="5" class="marketplace_cardname sans">${nftName}</h5>
                                      <div data-atropos-offset="5" class="more_card_artistcard">
                                          <img class="img-artist-cardrow" src="https://localhost:7018${artistImageUrl}" alt="${artistName}" />
                                          <p class="marketplace_cardartist base-sans">${artistName}</p>
                                      </div>
                                      <div data-atropos-offset="5" class="more_addinfo">
                                          <div class="more_addinfo_price">
                                              <p style="color: #858584" class="caption-mono">Price</p>
                                              <p style="color: #fff" class="base-mono">${nftPrice} ${tokenSymbol}</p>
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
      console.log('Error fetching data:', error);
  }
});
