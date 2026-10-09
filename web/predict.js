// ---------------------------------------------------------------------
// Predict page logic: fills the station/month/year dropdowns, calls the
// prediction API, and renders the result in a friendly way.
// Everything the page needs is hardcoded below - no config files.
// ---------------------------------------------------------------------

// Prediction server endpoint.
const API_URL = "http://localhost:5001/predict";

// Meteorological stations available for prediction.
const STATIONS = ["ANURADHAPURA", "BATTICALOA", "HAMBANTOTA", "POLONNARUWA", "VAVUNIYA"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Forecast window: January 2024 through March 2026 (fixed).
const FORECAST_START_YEAR = 2024;
const FORECAST_END_YEAR = 2026;
const FORECAST_END_MONTH = 3;

function populateYearSelect(selectEl) {
  selectEl.innerHTML = "";
  for (let year = FORECAST_START_YEAR; year <= FORECAST_END_YEAR; year++) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    selectEl.appendChild(option);
  }
}

function populateMonthSelect(selectEl, year) {
  const previousValue = selectEl.value;
  selectEl.innerHTML = "";
  const lastMonth = year === FORECAST_END_YEAR ? FORECAST_END_MONTH : 12;
  for (let month = 1; month <= lastMonth; month++) {
    const option = document.createElement("option");
    option.value = String(month).padStart(2, "0");
    option.textContent = MONTH_NAMES[month - 1];
    selectEl.appendChild(option);
  }
  if (Array.from(selectEl.options).some((opt) => opt.value === previousValue)) {
    selectEl.value = previousValue;
  }
}

function populateStationSelect(selectEl) {
  selectEl.innerHTML = "";
  STATIONS.forEach((station) => {
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
    showStatus("Please select a station.", true);
    return;
  }

  predictBtn.disabled = true;
  predictBtn.classList.add("loading");
  document.getElementById("result-section").classList.add("hidden");
  showStatus("Fetching prediction, please wait...", false);

  try {
    const response = await fetch(API_URL, {
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
    showStatus("Could not get a prediction. Please make sure the prediction server is running, then try again.", true);
  } finally {
    predictBtn.disabled = false;
    predictBtn.classList.remove("loading");
  }
}

function initPredictPage() {
  const stationSelect = document.getElementById("station-select");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");

  populateStationSelect(stationSelect);
  populateYearSelect(yearSelect);
  populateMonthSelect(monthSelect, Number(yearSelect.value));

  yearSelect.addEventListener("change", () => {
    populateMonthSelect(monthSelect, Number(yearSelect.value));
  });

  document.getElementById("predict-form").addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", initPredictPage);
