function tabText() {
  var tabs = document.querySelectorAll(".tab");

  tabs.forEach(function (tab) {
    if (window.innerWidth <= 735) {
      switch (tab.id) {
        case "today":
          tab.textContent = "1d";
          break;
        case "this-week":
          tab.textContent = "7d";
          break;
        case "this-month":
          tab.textContent = "30d";
          break;
        case "all-time":
          break;
      }
    } else {
      switch (tab.id) {
        case "today":
          tab.textContent = "Today";
          break;
        case "this-week":
          tab.textContent = "This Week";
          break;
        case "this-month":
          tab.textContent = "This Month";
          break;
        case "all-time":
          tab.textContent = "All Time";
          break;
      }
    }
  });
}

window.addEventListener("load", tabText);
window.addEventListener("resize", tabText);

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const responseArtists = await fetch('https://localhost:7018/api/Artist');
    const artistData = await responseArtists.json();

    const responseNFTs = await fetch('https://localhost:7018/api/NFT');
    const nftData = await responseNFTs.json();

    // відстеження кількості створених NFT кожним артистом
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

    const container = document.querySelector(".rankings_table");

    for (let i = 0; i < artistData.length; i++) {
      const divItem = document.createElement("a");
      divItem.classList.add("rankings_table_item");
      divItem.classList.add("hvr-shrink");
      
      const {
        imageUrl: artistImage,
        name: artistName
      } = artistData[i];

      const artistId = artistData[i].id;
      divItem.setAttribute("href", `artistpage.html?artistId=${artistId}`);

      divItem.innerHTML = `
        <p style="font-size:16px" class="table_num caption-mono">${i + 1}</p>
        <div class="table_name rankings_table_artist">
          <img src="https://localhost:7018${artistImage}" alt="" />
          <p>${artistName}</p>
        </div>
        <p style="color: #00ac4f" class="table_change base-sans">+1.41%</p>
        <p class="table_sold base-sans">${artistNFTCount[artistData[i].id] || 0} NFTs</p>
        <p class="table_price base-sans">12.4 ETH</p>
      `;
      container.appendChild(divItem);
    }
  } catch (error) {
    console.log('Error fetching artists:', error);
  }
});