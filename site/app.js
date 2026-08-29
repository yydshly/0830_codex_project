const searchInput = document.querySelector("#project-search");
const cards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter")];
const noResults = document.querySelector("#no-results");
let activeFilter = "all";

function applyFilters() {
  const query = searchInput?.value.trim().toLocaleLowerCase("zh-CN") ?? "";
  let visibleCount = 0;

  for (const card of cards) {
    const matchesStatus = activeFilter === "all" || card.dataset.status === activeFilter;
    const matchesQuery = !query || card.dataset.search.includes(query);
    card.hidden = !(matchesStatus && matchesQuery);
    if (!card.hidden) visibleCount += 1;
  }

  if (noResults) noResults.hidden = cards.length === 0 || visibleCount > 0;
}

searchInput?.addEventListener("input", applyFilters);

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    for (const item of filterButtons) item.classList.toggle("is-active", item === button);
    applyFilters();
  });
}

