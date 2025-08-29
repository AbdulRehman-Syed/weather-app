
import CONFIG from './config';

class WeatherService {
    constructor() {
        this.DEMO_API_KEY = 'aa652eca8dd68809cbb320a05f80d13f'; 
        this.USER_API_KEY = CONFIG?.API_KEY;
        
        this.API_KEY = this.USER_API_KEY || this.DEMO_API_KEY;
        
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
        
        this.weatherIcons = {
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
        
        this.logApiKeyUsage();
    }
    
    logApiKeyUsage() {
        if (this.USER_API_KEY) {
            console.log('✅ Using user API key');
        } else {
            console.log('⚠️ Using demo API key - for full functionality, add your own API key');
        }
    }
    
    validateApiKey() {
        if (!this.API_KEY) {
            throw new Error('No API key configured. Please set up your OpenWeatherMap API key.');
        }
        
        if (this.API_KEY === this.DEMO_API_KEY) {
            console.warn('ℹ️ Using demo API key (1,000 calls/day limit). For unlimited usage, add your own API key.');
        }
    }
    
    async getCurrentWeather(city) {
        try {
            this.validateApiKey();
            
            const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
            console.log('Fetching current weather:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.message || `Weather data not found for ${city}`;
                
                if (response.status === 401) {
                    errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
                } else if (response.status === 429) {
                    errorMessage = 'API rate limit exceeded. Please try again later or use your own API key.';
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('Current weather data received:', data);
            return this.processWeatherData(data);
        } catch (error) {
            console.error('Current weather fetch error:', error);
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }
    
    async getCurrentWeatherByCoords(lat, lon) {
        try {
            this.validateApiKey();
            
            const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
            console.log('Fetching weather by coordinates:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.message || 'Unable to fetch weather data for your location';
                
                if (response.status === 401) {
                    errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
                } else if (response.status === 429) {
                    errorMessage = 'API rate limit exceeded. Please try again later or use your own API key.';
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('Weather by coordinates data received:', data);
            return this.processWeatherData(data);
        } catch (error) {
            console.error('Weather by coordinates fetch error:', error);
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }
    
    async getForecast(city) {
        try {
            this.validateApiKey();
            
            const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
            console.log('Fetching forecast:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.message || 'Forecast data not available';
                
                if (response.status === 401) {
                    errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
                } else if (response.status === 429) {
                    errorMessage = 'API rate limit exceeded. Please try again later or use your own API key.';
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('Forecast data received:', data);
            return this.processForecastData(data);
        } catch (error) {
            console.error('Forecast fetch error:', error);
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
        return this.weatherIcons[iconCode] || '🌤️';
    }
    
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            console.log('Requesting user location...');
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log('Location received:', position.coords);
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                error => {
                    console.error('Geolocation error:', error);
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
                    timeout: 15000,
                    enableHighAccuracy: false,
                    maximumAge: 300000
                }
            );
        });
    }
    
    isUsingDemoKey() {
        return this.API_KEY === this.DEMO_API_KEY;
    }
    
    getApiKeyStatus() {
        if (this.USER_API_KEY) {
            return 'user'; 
        } else if (this.DEMO_API_KEY) {
            return 'demo';
        } else {
            return 'none';
        }
    }
}

export default new WeatherService();