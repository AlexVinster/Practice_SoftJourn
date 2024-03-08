document.addEventListener("DOMContentLoaded", function () {
  const splide = new Splide(".splide", {
    perPage: 4,
    rewind: true,
    breakpoints: {
      1280: {
        perPage: 4,
        width: "1050px",
      },
      834: {
        perPage: 2,
        width: "325px",
      },
    },
  });
  splide.mount();
});

document.addEventListener("DOMContentLoaded", async function () {
  const numberOfItems = 3;

  try {
    const responseNFT = await fetch('https://localhost:7018/api/NFT');
    const nftsData = await responseNFT.json();

    const responseArtist = await fetch('https://localhost:7018/api/Artist');
    const artistsData = await responseArtist.json();

  const container = document.querySelector(".more_cardrow");

  for (let i = 0; i < numberOfItems; i++) {
    const divItem = document.createElement("div");
    divItem.classList.add("more_cardrow_item");

    const posNFT = Math.floor(Math.random() * nftsData.length);
    const {
      id: nftId,
      imageUrl: nftImageUrl,
      price,
      name: nftNaming,
      artistId: nftArtistId,
    } = nftsData[posNFT];
    nftsData.splice(posNFT, 1);
  
    const artistData = artistsData.find(artist => artist.id === nftArtistId);
  
    const {
      imageUrl: artistImage,
      name: artistName,
    } = artistData;

    divItem.innerHTML = `
      <div class="atropos my-atropos-${i}">
          <div class="atropos-scale">
            <div class="atropos-rotate">
              <div class="atropos-inner"> 
              <a href="nftpage.html?id=${nftId}&artist=${nftArtistId}" id="more_card" onclick="passNftId(${nftId})">
              <img class="cardrow_img" src="https://localhost:7018${nftImageUrl}" />
                <div class="more_card_placeholder">
                  <h5 data-atropos-offset="5" class="sans">${nftNaming}</h5>
                  <div data-atropos-offset="5" class="more_card_artistcard">
                    <img class="img-artist-cardrow" src="https://localhost:7018${artistImage}" alt="" />
                  <p class="base-sans">${artistName}</p>
                  </div>
                  <div data-atropos-offset="5" class="more_addinfo">
                    <div class="more_addinfo_price">
                      <p class="caption-mono grey" data-lang="price">Price</p>
                      <p style="color: #fff" class="base-mono">${price} ETH</p>
                    </div>
                    <div class="more_addinfo_bid">
                      <p class="caption-mono grey" data-lang="highestbid">Highest Bid</p>
                      <p style="color: #fff" class="base-mono">0.33 wETH</p>
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
} catch (error) {console.log('Error');}
});

document.addEventListener("DOMContentLoaded", async function () {
  const numberOfItems = 12;

  try {
    const responseArtist = await fetch('https://localhost:7018/api/Artist');
    const artistData = await responseArtist.json();

    const responseNFTs = await fetch('https://localhost:7018/api/NFT');
    const nftData = await responseNFTs.json();

    const artistNFTCount = {};

    // Заповнення artistNFTCount кількістю NFT
    nftData.forEach((nft) => {
      const artistId = nft.artistId;
      artistNFTCount[artistId] = (artistNFTCount[artistId] || 0) + 1;
    });

    artistData.sort((a, b) => {
      const countA = artistNFTCount[a.id] || 0;
      const countB = artistNFTCount[b.id] || 0;
      return countB - countA; // Сортування від більшого до меншого
    });

  const container = document.querySelector(".toprated_cardrow_list");

  for (let i = 0; i < numberOfItems; i++) {
    const ulItem = document.createElement("div");
    ulItem.classList.add("toprated_cardrow");
    if (i == 5) {
      ulItem.classList.add("lastitem");
    }
    if (i > 4) {
      ulItem.classList.add("third");
    }

    const {
      imageUrl: artistImage,
      name: artistName,
      // ADD TOTAL SALES !!!
    } = artistData[i];

    const artistId = artistData[i].id;
    ulItem.setAttribute("href", `artistpage.html?artistId=${artistId}`);

    ulItem.innerHTML = `
      
      <a href="artistpage.html" class="toprated_cardrow_item hvr-shrink">
      
        <img src="https://localhost:7018${artistImage}" alt="" class="artist_avatar"/>
        <p class="ranking_number">${i + 1}</p>
        <article class="toprated_info">
          <h5 class="sans">${artistName}</h5>
          <div class="toprated_info_sales">
            <p class="toprated_info_salestext grey" data-lang="total_sales">Total: </p>
            <p class="toprated_info_price">${artistNFTCount[artistData[i].id] || 0} NFTs</p>
          </div>
        </article>
        
      </a>
      `;
    container.appendChild(ulItem);
  }
} catch (error) {
    console.log('Error fetching Artists:', error);
  }
});
