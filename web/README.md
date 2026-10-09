# Sri Lanka Drought Watch - Website

A simple 3-page website: **Home**, **Predict Drought**, **About**.

## How to change the text on the site

You do **not** need to touch any `.html` file.

- `content.txt` — all the text shown on every page (titles, buttons, messages).
- `stations.txt` — the list of meteorological stations shown in the dropdown (one per line).
- `config.txt` — the web address of the prediction server, and how many years ahead to show in the Year dropdown.

Open any of these with Notepad (or any text editor), change the text after the `=` sign, save the file, and refresh the website in your browser. Lines starting with `#` are just notes and are ignored.

## How to run the website

Browsers block a page from reading `.txt` files directly when you just double-click `index.html`. Instead, run a tiny local web server from this folder:

```
cd web
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Prediction server

The "Predict Drought" page sends a request to the address set in `config.txt` (`api.url`, default `http://localhost:5001/predict`). Make sure that server is running before using the Predict page.
