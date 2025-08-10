class WeatherService {
    constructor() {
        this.API_KEY = 'aa652eca8dd68809cbb320a05f80d13f';
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
    }

    async getCurrentWeather(city) {
        try {
            const url = `${this.BASE_URL}/weather?q=${city}&appid=${this.API_KEY}&units=metric`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Weather data not found for ${city}`);
            }
            
            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }

    async getCurrentWeatherByCoords(lat, lon) {
        try {
            const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Unable to fetch weather data for your location');
            }
            
            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }

    async getForecast(city) {
        try {
            const url = `${this.BASE_URL}/forecast?q=${city}&appid=${this.API_KEY}&units=metric`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Forecast data not available');
            }
            
            const data = await response.json();
            return this.processForecastData(data);
        } catch (error) {
            throw new Error(`Failed to fetch forecast data: ${error.message}`);
        }
    }

    processWeatherData(data) {
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            windSpeed: data.wind.speed,
            icon: this.getWeatherIcon(data.weather[0].icon),
            timestamp: new Date(data.dt * 1000)
        };
    }

    processForecastData(data) {
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            
            const hour = date.getHours();
            if (hour >= 11 && hour <= 14) {
                dailyForecasts[dateKey] = {
                    date: date,
                    temperature: Math.round(item.main.temp),
                    description: item.weather[0].description,
                    icon: this.getWeatherIcon(item.weather[0].icon)
                };
            } else if (!dailyForecasts[dateKey]) {
                dailyForecasts[dateKey] = {
                    date: date,
                    temperature: Math.round(item.main.temp),
                    description: item.weather[0].description,
                    icon: this.getWeatherIcon(item.weather[0].icon)
                };
            }
        });

        return Object.values(dailyForecasts).slice(0, 5);
    }

    getWeatherIcon(iconCode) {
        const icons = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return icons[iconCode] || '🌤️';
    }

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                error => {
                    let errorMessage = 'Unable to get your location';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location services.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'The request to get user location timed out.';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );
        });
    }
}

export default new WeatherService();