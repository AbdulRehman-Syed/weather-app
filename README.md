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

## Quick Start
```bash
git clone https://github.com/yourusername/weather-app.git
```
Get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and create:
```
src/js/config.js
```
with:
```javascript
const CONFIG = {
    API_KEY: 'your-real-api-key-here'
};
export default CONFIG;
```

Run locally:
```bash
python -m http.server 8000
```
Or use VS Code Live Server, then open:
```
http://localhost:8000
```

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

**Note:** Files listed in `.gitignore` (such as `config.js`) will not be uploaded to GitHub.
