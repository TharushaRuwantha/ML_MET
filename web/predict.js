// ---------------------------------------------------------------------
// Predict page logic: fills the station/month/year dropdowns, calls the
// local prediction API, and renders the result in a friendly way.
// ---------------------------------------------------------------------

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Used only if stations.txt cannot be loaded (e.g. the page was opened by
// double-clicking the file instead of through a local server), so the
// dropdown is never left empty. Keep this in sync with stations.txt.
const FALLBACK_STATIONS = [
  "ANURADHAPURA", "BADULLA", "BATTICALOA", "COLOMBO", "GALLE",
  "HAMBANTOTA", "JAFFNA", "KANDY", "KATUNAYAKE", "KURUNEGALA",
  "MANNAR", "MATALE", "MONARAGALA", "NUWARA ELIYA", "POLONNARUWA",
  "PUTTALAM", "RATNAPURA", "TRINCOMALEE", "VAVUNIYA",
];

let siteContent = {};
let apiUrl = "http://localhost:5001/predict";

function populateMonthSelect(selectEl) {
  selectEl.innerHTML = "";
  MONTH_NAMES.forEach((name, index) => {
    const option = document.createElement("option");
    option.value = String(index + 1).padStart(2, "0");
    option.textContent = name;
    selectEl.appendChild(option);
  });
}

function populateYearSelect(selectEl, yearsAhead) {
  selectEl.innerHTML = "";
  const currentYear = new Date().getFullYear();
  for (let i = 0; i <= yearsAhead; i++) {
    const year = currentYear + i;
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    selectEl.appendChild(option);
  }
}

function populateStationSelect(selectEl, stations) {
  selectEl.innerHTML = "";
  stations.forEach((station) => {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    selectEl.appendChild(option);
  });
}

function riskClassToCssClass(riskClassification) {
  const normalized = (riskClassification || "").trim().toLowerCase();
  if (normalized === "normal") return "normal";
  if (normalized === "moderate") return "moderate";
  if (normalized === "severe") return "severe";
  if (normalized === "extreme") return "extreme";
  return "";
}

function showStatus(message, isError) {
  const statusEl = document.getElementById("status-msg");
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
  statusEl.classList.toggle("error", !!isError);
}

function hideStatus() {
  const statusEl = document.getElementById("status-msg");
  statusEl.classList.add("hidden");
  statusEl.textContent = "";
}

function renderResult(data) {
  const resultSection = document.getElementById("result-section");

  const metrics = data.forecast_metrics || {};
  const probability = typeof metrics.drought_probability === "number" ? metrics.drought_probability : 0;
  const spiMean = typeof metrics.predicted_spi3_mean === "number" ? metrics.predicted_spi3_mean : 0;
  const riskClassification = metrics.risk_classification || "Unknown";

  document.getElementById("result-station").textContent = data.station_name || "-";
  document.getElementById("result-month").textContent = data.target_month || "-";

  const badge = document.getElementById("result-risk-badge");
  badge.textContent = riskClassification;
  badge.className = "risk-badge " + riskClassToCssClass(riskClassification);

  const probabilityPercent = Math.round(probability * 1000) / 10;
  document.getElementById("result-probability").textContent = probabilityPercent + "%";
  document.getElementById("result-probability-bar").style.width = Math.min(100, Math.max(0, probabilityPercent)) + "%";

  document.getElementById("result-spi").textContent = spiMean.toFixed(2);

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function handleSubmit(event) {
  event.preventDefault();
  hideStatus();

  const stationSelect = document.getElementById("station-select");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const predictBtn = document.getElementById("predict-btn");

  const stationName = stationSelect.value;
  const targetMonth = `${yearSelect.value}-${monthSelect.value}`;

  if (!stationName) {
    showStatus(siteContent["predict.error"] || "Please select a station.", true);
    return;
  }

  predictBtn.disabled = true;
  predictBtn.classList.add("loading");
  document.getElementById("result-section").classList.add("hidden");
  showStatus(siteContent["predict.loading"] || "Fetching prediction, please wait...", false);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        station_name: stationName,
        target_month: targetMonth,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    hideStatus();
    renderResult(data);
  } catch (err) {
    console.error(err);
    showStatus(siteContent["predict.error"] || "Could not get a prediction. Please try again.", true);
  } finally {
    predictBtn.disabled = false;
    predictBtn.classList.remove("loading");
  }
}

async function initPredictPage() {
  try {
    siteContent = await loadSiteContent();
  } catch (e) {
    console.warn("Could not load content.txt", e);
  }

  const config = await loadConfig();
  if (config["api.url"]) {
    apiUrl = config["api.url"];
  }
  const yearsAhead = parseInt(config["predict.yearsAhead"], 10);

  populateMonthSelect(document.getElementById("month-select"));
  populateYearSelect(document.getElementById("year-select"), isNaN(yearsAhead) ? 3 : yearsAhead);

  try {
    const stations = await loadStations();
    if (!stations.length) throw new Error("stations.txt had no stations in it");
    populateStationSelect(document.getElementById("station-select"), stations);
  } catch (e) {
    console.warn("Could not load stations.txt, using the built-in station list instead.", e);
    populateStationSelect(document.getElementById("station-select"), FALLBACK_STATIONS);
    if (window.location.protocol === "file:") {
      showStatus(
        "Tip: you opened this file directly, so stations.txt could not be read. Showing the built-in station list instead. Run start_website (see README) to load stations.txt and your edited text.",
        false
      );
    }
  }

  document.getElementById("predict-form").addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", initPredictPage);
