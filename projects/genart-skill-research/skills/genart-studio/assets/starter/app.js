import { normalizeHash, randomHash, renderArtwork } from "./genart-core.js";

const query = new URLSearchParams(location.search);
const canvas = document.querySelector("#artwork");
const input = document.querySelector("#hash");
const features = document.querySelector("#features");
const size = Number(query.get("width") ?? query.get("height") ?? 800);

window.render = async function render(hash) {
  const result = renderArtwork(canvas, {
    hash: normalizeHash(hash),
    mode: "deterministic",
    size,
  });
  window.$features = result.features;
  window.rendered = canvas;
  input.value = result.hash;
  features.replaceChildren(
    ...Object.entries(result.features).map(([label, value]) => {
      const row = document.createElement("div");
      row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
      return row;
    }),
  );
  document.dispatchEvent(new CustomEvent("genart:done"));
  return canvas;
};

function setUrlHash(hash) {
  const url = new URL(location.href);
  url.searchParams.set("hash", hash);
  history.replaceState(null, "", url);
}

document.querySelector("#rerender").addEventListener("click", () => {
  const hash = normalizeHash(input.value);
  setUrlHash(hash);
  window.render(hash);
});

document.querySelector("#new-seed").addEventListener("click", () => {
  const hash = randomHash();
  setUrlHash(hash);
  window.render(hash);
});

document.querySelector("#download").addEventListener("click", () => {
  const anchor = document.createElement("a");
  anchor.download = `genart_${input.value.slice(2, 12)}.png`;
  anchor.href = canvas.toDataURL("image/png");
  anchor.click();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") document.querySelector("#rerender").click();
});

await window.render(normalizeHash(query.get("hash") ?? `0x${"c0de".repeat(16)}`));
