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

document.addEventListener("DOMContentLoaded", function () {
  const numberOfItems = 3;

  const images = ["1.webp", "2.webp", "3.webp"];
  const names = ["Distant Galaxy", "Life On Edena", "AstroFiction"];
  const artistpic = ["1.webp", "2.webp", "3.webp"];
  const artistname = ["MoonDancer", "NebulaKid", "Spaceone"];

  const container = document.querySelector(".more_cardrow");

  for (let i = 0; i < numberOfItems; i++) {
    const divItem = document.createElement("div");
    divItem.classList.add("more_cardrow_item");

    const pos = Math.floor(Math.random() * images.length);
    const randomImage = images.splice(pos, 1)[0];
    const randomName = names.splice(pos, 1)[0];
    const randomArtistpic = artistpic.splice(pos, 1)[0];
    const randomArtistname = artistname.splice(pos, 1)[0];

    divItem.innerHTML = `
      <div class="atropos my-atropos-${i}">
          <div class="atropos-scale">
            <div class="atropos-rotate">
              <div class="atropos-inner"> 
                <a href="marketplace.html" class="more_card ">
                <img src="images/artistpage/artist-pic${randomImage}">
                <div class="more_card_placeholder">
                  <h5 data-atropos-offset="5" class="sans">${randomName}</h5>
                  <div data-atropos-offset="5" class="more_card_artistcard">
                    <img src="images/more_avatar${randomArtistpic}" alt="" />
                    <p class="base-sans">${randomArtistname}</p>
                  </div>
                  <div data-atropos-offset="5" class="more_addinfo">
                    <div class="more_addinfo_price">
                      <p class="caption-mono grey" data-lang="price">Price</p>
                      <p style="color: #fff" class="base-mono">1.63 ETH</p>
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
});

document.addEventListener("DOMContentLoaded", function () {
  const numberOfItems = 12;

  const creators = [
    { number: "1", name: "Keepitreal" },
    { number: "2", name: "DigitLab" },
    { number: "3", name: "GravityOne" },
    { number: "4", name: "Juanie" },
    { number: "5", name: "BlueWhale" },
    { number: "6", name: "Mr Fox" },
    { number: "7", name: "Shroomie" },
    { number: "8", name: "Robotica" },
    { number: "9", name: "RustyRobot" },
    { number: "10", name: "Animakid" },
    { number: "11", name: "Dotgu" },
    { number: "12", name: "Ghiblier" },
  ];

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

    const pos = Math.floor(Math.random() * creators.length);
    const { number: randomPos, name: randomName } = creators[pos];
    creators.splice(pos, 1);

    ulItem.innerHTML = `
      
      <a href="artistpage.html" class="toprated_cardrow_item hvr-shrink">
      
        <img src="images/artist_avatar${randomPos}.webp" alt="" class="artist_avatar"/>
        <p class="ranking_number">${i + 1}</p>
        <article class="toprated_info">
          <h5 class="sans">${randomName}</h5>
          <div class="toprated_info_sales">
            <p class="toprated_info_salestext grey" data-lang="total_sales">Total Sales:</p>
            <p class="toprated_info_price">34.53 ETH</p>
          </div>
        </article>
        
      </a>
      `;
    container.appendChild(ulItem);
  }
});
