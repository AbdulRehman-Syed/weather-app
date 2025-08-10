class UIManager {
    constructor() {
        this.elements = {
            searchInput: document.getElementById('search-input'),
            searchBtn: document.getElementById('search-btn'),
            currentLocationBtn: document.getElementById('current-location-btn'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            retryBtn: document.getElementById('retry-btn'),
            weatherDisplay: document.getElementById('weather-display'),
            cityNameContainer: document.getElementById('city-name-container'),
            dateTime: document.getElementById('date-time'),
            temperature: document.getElementById('temperature'),
            weatherIcon: document.getElementById('weather-icon'),
            weatherDescription: document.getElementById('weather-description'),
            feelsLike: document.getElementById('feels-like'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('wind-speed'),
            forecastContainer: document.getElementById('forecast-container')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.elements.searchBtn && this.elements.searchInput) {
            this.elements.searchBtn.addEventListener('click', () => {
                const city = this.elements.searchInput.value.trim();
                if (city) {
                    this.triggerSearch(city);
                }
            });

            this.elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const city = this.elements.searchInput.value.trim();
                    if (city) {
                        this.triggerSearch(city);
                    }
                }
            });
        }

        if (this.elements.currentLocationBtn) {
            this.elements.currentLocationBtn.addEventListener('click', () => {
                this.triggerCurrentLocation();
            });
        }

        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', () => {
                this.hideError();
                this.showLoading();
            });
        }

        if (this.elements.searchInput) {
            this.elements.searchInput.focus();
        }
    }

    triggerSearch(city) {
        const searchEvent = new CustomEvent('weatherSearch', { detail: { city } });
        document.dispatchEvent(searchEvent);
    }

    triggerCurrentLocation() {
        const locationEvent = new CustomEvent('currentLocationRequested');
        document.dispatchEvent(locationEvent);
    }

    showLoading() {
        this.hideAllSections();
        if (this.elements.loading) {
            this.elements.loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.classList.add('hidden');
        }
    }

    showError(message) {
        this.hideAllSections();
        if (this.elements.errorText) {
            this.elements.errorText.textContent = message;
        }
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.remove('hidden');
        }
    }

    hideError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.add('hidden');
        }
    }

    hideAllSections() {
        if (this.elements.loading) {
            this.elements.loading.classList.add('hidden');
        }
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.add('hidden');
        }
        if (this.elements.weatherDisplay) {
            this.elements.weatherDisplay.classList.add('hidden');
        }
    }

    displayWeather(weatherData, forecastData) {
        this.hideAllSections();
        this.updateCurrentWeather(weatherData);
        this.updateForecast(forecastData);
        if (this.elements.weatherDisplay) {
            this.elements.weatherDisplay.classList.remove('hidden');
        }
    }

    updateCurrentWeather(data) {
        if (this.elements.cityNameContainer) {
            this.elements.cityNameContainer.innerHTML = '';
            const cityNameHeading = document.createElement('h2');
            cityNameHeading.id = 'city-name';
            cityNameHeading.setAttribute('aria-live', 'polite');
            cityNameHeading.textContent = `${data.city}, ${data.country}`;
            this.elements.cityNameContainer.appendChild(cityNameHeading);
        }
        
        if (this.elements.dateTime) {
            this.elements.dateTime.textContent = this.formatDateTime(data.timestamp);
        }
        if (this.elements.temperature) {
            this.elements.temperature.textContent = `${data.temperature}°C`;
        }
        if (this.elements.weatherIcon) {
            this.elements.weatherIcon.textContent = data.icon;
        }
        if (this.elements.weatherDescription) {
            this.elements.weatherDescription.textContent = data.description;
        }
        if (this.elements.feelsLike) {
            this.elements.feelsLike.textContent = `${data.feelsLike}°C`;
        }
        if (this.elements.humidity) {
            this.elements.humidity.textContent = `${data.humidity}%`;
        }
        if (this.elements.windSpeed) {
            this.elements.windSpeed.textContent = `${data.windSpeed} m/s`;
        }
    }

    updateForecast(forecastData) {
        if (!this.elements.forecastContainer) return;
        
        this.elements.forecastContainer.innerHTML = '';
        
        forecastData.forEach(day => {
            const forecastElement = this.createForecastElement(day);
            this.elements.forecastContainer.appendChild(forecastElement);
        });
    }

    createForecastElement(dayData) {
        const element = document.createElement('div');
        element.className = 'forecast-item';
        
        element.innerHTML = `
            <div class="forecast-date">${this.formatForecastDate(dayData.date)}</div>
            <div class="forecast-icon">${dayData.icon}</div>
            <div class="forecast-temp">${dayData.temperature}°C</div>
            <div class="forecast-desc">${dayData.description}</div>
        `;
        
        return element;
    }

    formatDateTime(date) {
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatForecastDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    clearSearchInput() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
    }

    getSearchInputValue() {
        return this.elements.searchInput ? this.elements.searchInput.value.trim() : '';
    }
}

export default new UIManager();