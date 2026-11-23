/* Filtre du menu par catégorie + recherche */
(function () {
  "use strict";

  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".menu-item");
  const search = document.getElementById("menu-search");
  const count = document.getElementById("menu-count");
  let category = "all";

  function update() {
    const q = search ? search.value.trim().toLowerCase() : "";
    let visible = 0;
    items.forEach(function (item) {
      const matchCat = category === "all" || item.dataset.category === category;
      const matchText = item.textContent.toLowerCase().includes(q);
      item.hidden = !(matchCat && matchText);
      if (!item.hidden) visible++;
    });
    if (count) {
      count.textContent = visible === 0
        ? "Aucun plat ne correspond à votre recherche."
        : visible + (visible > 1 ? " plats affichés" : " plat affiché");
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      category = btn.dataset.filter;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      update();
    });
  });

  if (search) search.addEventListener("input", update);
  update();
})();
