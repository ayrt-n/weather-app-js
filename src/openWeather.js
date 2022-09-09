const apiKey = 'b9a8867dc7111cf01cd9943847a614f7';

// Fetches and returns current weather data in JSON format
async function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();

  return data;
}

// Fetches and returns 3-hour/5-day weather forecast data in JSON format
async function getFiveDayForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();

  return data;
}

// Check whether it is day or night based on current time and sunrise/sunset time and return bool
function isNightTime(current, sunrise, sunset) {
  if (current > sunrise && current < sunset) {
    return false;
  }

  return true;
}

// Parses Open Weather return data and returns object with important variables
function parseWeatherData(data) {
  return {
    time: new Date(data.dt * 1000),
    temp: Math.round(data.main.temp),
    tempFeelsLike: Math.round(data.main.feels_like),
    high: Math.round(data.main.temp_max),
    min: Math.round(data.main.temp_min),
    weather: data.weather[0].description,
    weatherId: data.weather[0].id,
    isNight: isNightTime(data.dt, data.sys.sunrise, data.sys.sunset),
  };
}

// Parses array of Open Weather return data and returns array of objects with important variables
function parseForecastData(forecastData) {
  const forecast = forecastData.list.map((data) => parseWeatherData(data));

  return forecast;
}

export {
  getCurrentWeather,
  getFiveDayForecast,
  parseWeatherData,
  parseForecastData,
};
