document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".marketplace_search")
    .addEventListener("input", function () {
      let val = this.value.trim().toLowerCase();
      let allItems = document.querySelectorAll(".more_cardrow_item");

      allItems.forEach(function (item) {
        let cardName = item
          .querySelector(".marketplace_cardname")
          .innerText.trim()
          .toLowerCase();
        let artistName = item
          .querySelector(".marketplace_cardartist")
          .innerText.trim()
          .toLowerCase();
        let isVisible = cardName.includes(val) || artistName.includes(val);

        if (!isVisible) {
          item.style.display = "none";
        } else {
          item.style.display = "block";
        }
      });
    });
});
