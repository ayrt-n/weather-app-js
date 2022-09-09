import getWeatherIcon from './weatherIcons';
import getWeatherBackground from './weatherBackgrounds';

const mainContainer = document.getElementById('main');

function setBackgroundImage(weatherObj) {
  const backgroundImage = getWeatherBackground(weatherObj.weatherId, weatherObj.isNight);
  mainContainer.style.backgroundImage = `url(${backgroundImage})`;
}

function createWeatherCard(weatherObj) {
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

function populateCurrentWeather(weatherObj) {
  const currentWeatherDiv = document.getElementById('current-weather');
  const currentWeatherCard = createWeatherCard(weatherObj);

  currentWeatherDiv.appendChild(currentWeatherCard);
}

function populate24HourForecast(forecastArray) {
  const currentWeatherDiv = document.getElementById('24-hour-forecast');
  forecastArray.forEach((forecast) => {
    const weatherCard = createWeatherCard(forecast);
    currentWeatherDiv.appendChild(weatherCard);
  });
}

export {
  setBackgroundImage,
  populateCurrentWeather,
  populate24HourForecast,
};
