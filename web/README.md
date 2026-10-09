# Sri Lanka Drought Watch - Website

A simple 3-page website: **Home**, **Predict Drought**, **About**.

All site text, the list of meteorological stations, the forecast date
range, and the prediction server address are defined directly in the
site's HTML/JavaScript files (`predict.js`, `script.js`), with no setup
files to edit.

## How to run the website

The easiest way: double-click one of these files in this folder, and it
will start the website and open it in your browser automatically.

- **Windows:** `Start Website (Windows).bat`
- **Mac / Linux:** `start_website.sh`

(These need Python installed, which is already required for the
prediction server.)

**Always use one of the scripts above instead of double-clicking
`index.html` directly.** Opening the file directly loads it from
`file://`, which sends `Origin: null` on the Predict page's request to
the prediction server - most servers (and browsers) reject that origin,
so you'll see a CORS error ("Origin null is not allowed...") in the
browser console and the prediction will fail. Serving the site through
`http://localhost:8080` (via the scripts above) avoids this.

## Prediction server

The "Predict Drought" page sends a request to the prediction server
address set in `predict.js` (`API_URL`, default
`http://localhost:5001/predict`). Make sure that server is running
before using the Predict page, and make sure it sends back an
`Access-Control-Allow-Origin` header that allows `http://localhost:8080`
(or `*`) - for a Flask server, this usually means installing
`flask-cors` and calling `CORS(app)`. Without that header, the browser
will block the response even though the server itself returns it
successfully.

## Changing the station list or forecast window

The station list and the forecast date range (currently January 2024
through March 2026) are defined as constants near the top of
`predict.js` (`STATIONS`, `FORECAST_START_YEAR`, `FORECAST_END_YEAR`,
`FORECAST_END_MONTH`). Edit those values and refresh the page to change
them.
