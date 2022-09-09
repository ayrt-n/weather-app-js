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
  const current = await getCurrentWeather(city);

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();

  // Set sunrise and sunset variable, not available in forecast API call
  data.sys = {
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
  };

  return data;
}

// Check whether it is day or night based on current time and sunrise/sunset time and return bool
function isNightTime(current, sunrise, sunset) {
  const currentDate = new Date(current * 1000);
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);
  const currentHour = currentDate.getHours();
  const sunriseHour = sunriseDate.getHours();
  const sunsetHour = sunsetDate.getHours();

  if (currentHour >= sunriseHour && currentHour < sunsetHour) {
    return false;
  }

  return true;
}

// Parses Open Weather return data and returns object with important variables
function parseWeatherData(data) {
  const timeObj = {};
  timeObj.full = new Date(data.dt * 1000);
  timeObj.hour = timeObj.full.getHours();
  timeObj.minute = timeObj.full.getMinutes();
  timeObj.month = timeObj.full.getMonth();
  timeObj.day = timeObj.full.getUTCDate();

  const location = (data.city)
    ? `${data.city.name}, ${data.city.country}`
    : `${data.name}, ${data.sys.country}`;

  return {
    location,
    time: timeObj,
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
  // Inefficient but call and add sunrise/sunset attr to each element in forecast array
  const forecastArray = forecastData.list.map((data) => ({ ...data, sys: forecastData.sys }));

  // Map forecast array transforming into array of weather objects
  const forecast = forecastArray.map((data) => parseWeatherData(data));
  return forecast;
}

export {
  getCurrentWeather,
  getFiveDayForecast,
  parseWeatherData,
  parseForecastData,
};
