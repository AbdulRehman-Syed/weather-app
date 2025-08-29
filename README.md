# LiveWeather App

A clean, responsive weather app that delivers real-time conditions and a 5-day forecast. Built with HTML, CSS, and JavaScript, using the OpenWeatherMap API.

## Features
- Current weather for any city
- 5-day forecast
- One-click location-based weather
- Fully responsive for mobile, tablet, and desktop

## Tech Stack
- HTML5, CSS3 (Flexbox, Grid)
- JavaScript ES6+ modules
- OpenWeatherMap API

## API Key Information
This app uses a built-in demo API key for immediate functionality. No configuration needed - works out of the box!

For unlimited usage, you can replace the demo API key in `src/js/weather.js` with your own OpenWeatherMap API key.

## Setup
1. Simply open `index.html` in a browser
2. Or serve with any local server
3. No API key setup required

## Usage
1. Enter a city name in the search box
2. Click the search button or press Enter
3. View current weather and 5-day forecast
4. Click the location icon (📍) for current location weather

## Project Structure
```
weather-app/
├── index.html
├── src/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── weather.js
│       ├── ui.js
│       └── config.js   # contains API key (ignored by Git)
├── .gitignore
└── README.md
```
## License

This project is open source and available under the MIT License.

**Note:** Files listed in `.gitignore` (such as `config.js`) will not be uploaded to GitHub.
