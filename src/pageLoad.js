import { formatHour, formatDayMonth } from './datetime';
import getWeatherIcon from './weatherIcons';
import getWeatherBackground from './weatherBackgrounds';

const mainContainer = document.getElementById('main');

// Set the background image based on weather object
function setBackgroundImage(weatherObj) {
  const backgroundImage = getWeatherBackground(weatherObj.weatherId, weatherObj.isNight);
  mainContainer.style.backgroundImage = `url(${backgroundImage})`;
}

// Return weather-card div with current weather information, given weather object
function createCurrentWeatherCard(weatherObj) {
  const card = document.createElement('div');
  const icon = document.createElement('img');
  const temp = document.createElement('h1');
  const feelsLike = document.createElement('p');
  const description = document.createElement('p');

  card.classList.add('weather-card');
  icon.src = getWeatherIcon(weatherObj.weatherId, weatherObj.isNight);
  temp.classList.add('title');
  temp.textContent = `${weatherObj.temp} ° C`;
  feelsLike.classList.add('subtitle');
  feelsLike.textContent = `Feels like ${weatherObj.tempFeelsLike}`;
  description.classList.add('title');
  description.textContent = weatherObj.weather;

  card.appendChild(icon);
  card.appendChild(temp);
  card.appendChild(feelsLike);
  card.appendChild(description);

  return card;
}

// Return weather-card div with forecast weather information, given weather object
function createHourlyForecastWeatherCard(weatherObj) {
  const card = document.createElement('div');
  const datetime = document.createElement('div');
  const icon = document.createElement('img');
  const temp = document.createElement('h1');
  const feelsLike = document.createElement('p');
  const description = document.createElement('p');

  card.classList.add('weather-card');
  datetime.classList.add('title');
  datetime.textContent = formatHour(weatherObj.time.hour);
  icon.src = getWeatherIcon(weatherObj.weatherId, weatherObj.isNight);
  temp.classList.add('title');
  temp.textContent = `${weatherObj.temp} ° C`;
  feelsLike.classList.add('subtitle');
  feelsLike.textContent = `Feels like ${weatherObj.tempFeelsLike}`;
  description.classList.add('title');
  description.textContent = weatherObj.weather;

  card.appendChild(datetime);
  card.appendChild(icon);
  card.appendChild(temp);
  card.appendChild(feelsLike);
  card.appendChild(description);

  return card;
}

// Return weather-card div with forecast weather information, given weather object
function createDailyForecastWeatherCard(weatherObj) {
  const card = document.createElement('div');
  const datetime = document.createElement('div');
  const icon = document.createElement('img');
  const temp = document.createElement('h1');
  const feelsLike = document.createElement('p');
  const description = document.createElement('p');

  card.classList.add('weather-card');
  datetime.classList.add('title');
  datetime.textContent = formatDayMonth(weatherObj.time.day, weatherObj.time.month);
  icon.src = getWeatherIcon(weatherObj.weatherId, weatherObj.isNight);
  temp.classList.add('title');
  temp.textContent = `${weatherObj.temp} ° C`;
  feelsLike.classList.add('subtitle');
  feelsLike.textContent = `Feels like ${weatherObj.tempFeelsLike}`;
  description.classList.add('title');
  description.textContent = weatherObj.weather;

  card.appendChild(datetime);
  card.appendChild(icon);
  card.appendChild(temp);
  card.appendChild(feelsLike);
  card.appendChild(description);

  return card;
}

// Populate the current weather div with weather card based on weather object
function populateCurrentWeather(weatherObj) {
  const currentWeatherDiv = document.getElementById('current-weather');
  const currentWeatherCard = createCurrentWeatherCard(weatherObj);

  currentWeatherDiv.appendChild(currentWeatherCard);
}

// Populate the 24-hour forecast div with weather cards based on forecast array
function populate24HourForecast(forecastArray) {
  const forecastWeatherDiv = document.getElementById('24-hour-forecast');
  forecastArray.forEach((forecast) => {
    const weatherCard = createHourlyForecastWeatherCard(forecast);
    forecastWeatherDiv.appendChild(weatherCard);
  });
}

// Populate the 5-day forecast div with weather cards based on forecast array
function populate5DayForecast(forecastArray) {
  const forecastWeatherDiv = document.getElementById('5-day-forecast');
  forecastArray.forEach((forecast) => {
    const weatherCard = createDailyForecastWeatherCard(forecast);
    forecastWeatherDiv.appendChild(weatherCard);
  });
}

// Set the location header
function populateLocationHeader(location) {
  const locationHeader = document.getElementById('location');
  locationHeader.textContent = location;
}

export {
  setBackgroundImage,
  populateCurrentWeather,
  populate24HourForecast,
  populate5DayForecast,
  populateLocationHeader,
};
