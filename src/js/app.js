import weatherService from './weather.js';
import uiManager from './ui.js';

class WeatherApp {
    constructor() {
        this.currentCity = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('weatherSearch', (event) => {
            this.handleSearch(event.detail.city);
        });

        document.addEventListener('currentLocationRequested', () => {
            this.getCurrentLocationWeather();
        });
    }

    async handleSearch(city) {
        try {
            uiManager.showLoading();
            uiManager.clearSearchInput();
            
            const [weatherData, forecastData] = await Promise.all([
                weatherService.getCurrentWeather(city),
                weatherService.getForecast(city)
            ]);

            this.currentCity = city;
            uiManager.displayWeather(weatherData, forecastData);
        } catch (error) {
            uiManager.showError(error.message);
        }
    }

    async getCurrentLocationWeather() {
        try {
            uiManager.showLoading();
            
            const location = await weatherService.getCurrentLocation();
            const weatherData = await weatherService.getCurrentWeatherByCoords(location.lat, location.lon);
            const forecastData = await weatherService.getForecast(weatherData.city);

            this.currentCity = weatherData.city;
            uiManager.displayWeather(weatherData, forecastData);
        } catch (error) {
            uiManager.showError(error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});