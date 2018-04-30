# Restaurant Reviews Project

This is a mobile-ready web application that provides restaurant reviews to users. The whole site is fully responsive on different sized displays and accessible for screen reader use. It also uses Cache API and a ServiceWorker so that any page (including images) that has been visited is accessible offline.

## Table of Contents

* [Instructions](#instructions)
* [Dependencies](#dependencies)

## Instructions

1. Clone the GitHub repository.

2. Update Google Map URL with your Google API key in index.html and restaurant.html.

3. Start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

3. With your server running, visit the site: `http://localhost:8000`, and look around to see what the experience looks like.

## Dependencies

This project uses [Google Fonts](https://fonts.google.com/) and [normalize.css](https://github.com/necolas/normalize.css).


