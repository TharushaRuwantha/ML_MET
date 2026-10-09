# Sri Lanka Drought Watch - Website

A simple 3-page website: **Home**, **Predict Drought**, **About**.

All site text, the list of meteorological stations, the forecast date
range, and the prediction server address are defined directly in the
site's HTML/JavaScript files (`predict.js`, `script.js`), so the site
works the same way whether it's opened directly or served, with no setup
files to edit.

## How to run the website

The easiest way: double-click one of these files in this folder, and it
will start the website and open it in your browser automatically.

- **Windows:** `Start Website (Windows).bat`
- **Mac / Linux:** `start_website.sh`

(These need Python installed, which is already required for the
prediction server.)

You can also open `index.html` directly in a browser - the site works
either way.

## Prediction server

The "Predict Drought" page sends a request to the prediction server
address set in `predict.js` (`API_URL`, default
`http://localhost:5001/predict`). Make sure that server is running
before using the Predict page.

## Changing the station list or forecast window

The station list and the forecast date range (currently January 2024
through March 2026) are defined as constants near the top of
`predict.js` (`STATIONS`, `FORECAST_START_YEAR`, `FORECAST_END_YEAR`,
`FORECAST_END_MONTH`). Edit those values and refresh the page to change
them.
