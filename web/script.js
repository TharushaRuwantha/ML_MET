// ---------------------------------------------------------------------
// Loads text content from the .txt files so non-technical users can
// edit the site by editing content.txt / stations.txt / config.txt
// instead of the HTML.
// ---------------------------------------------------------------------

function parseKeyValueText(raw) {
  const data = {};
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    data[key] = value;
  });
  return data;
}

function parseListText(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

async function loadTextFile(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.text();
}

async function loadSiteContent() {
  const raw = await loadTextFile("content.txt");
  const content = parseKeyValueText(raw);

  document.querySelectorAll("[data-content]").forEach((el) => {
    const key = el.getAttribute("data-content");
    if (content[key] !== undefined) {
      el.textContent = content[key];
    }
  });

  if (content["site.name"]) {
    document.title = content["site.name"];
  }

  return content;
}

async function loadConfig() {
  try {
    const raw = await loadTextFile("config.txt");
    return parseKeyValueText(raw);
  } catch (e) {
    console.warn("Could not load config.txt, using defaults", e);
    return {};
  }
}

async function loadStations() {
  const raw = await loadTextFile("stations.txt");
  return parseListText(raw);
}

function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNavLink();
  loadSiteContent().catch((err) => {
    console.error(err);
  });
});
