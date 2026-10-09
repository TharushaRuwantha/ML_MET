# Sri Lanka Drought Watch - Website

A simple 3-page website: **Home**, **Predict Drought**, **About**.

## How to change the text on the site

You do **not** need to touch any `.html` file.

- `content.txt` — all the text shown on every page (titles, buttons, messages).
- `stations.txt` — the list of meteorological stations shown in the dropdown (one per line).
- `config.txt` — the web address of the prediction server, and how many years ahead to show in the Year dropdown.

Open any of these with Notepad (or any text editor), change the text after the `=` sign, save the file, and refresh the website in your browser. Lines starting with `#` are just notes and are ignored.

## How to run the website

The easiest way: double-click one of these files in this folder, and it will start the website and open it in your browser automatically.

- **Windows:** `Start Website (Windows).bat`
- **Mac / Linux:** `start_website.sh`

(These need Python installed, which is already required for the prediction server.)

If you just double-click `index.html` instead, the site still works and the station dropdown is still filled in, but your edits to `content.txt` / `stations.txt` will **not** show up — browsers block a page from reading `.txt` files directly when it isn't opened through a web server. Use the start scripts above (or run `python -m http.server 8080` from this folder and open `http://localhost:8080`) whenever you want your text/station edits to appear.

## Prediction server

The "Predict Drought" page sends a request to the address set in `config.txt` (`api.url`, default `http://localhost:5001/predict`). Make sure that server is running before using the Predict page.
