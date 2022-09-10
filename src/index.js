import displayLoadingError from './displayErrors';
import {
  setBackgroundImage,
  populateCurrentWeather,
  populate24HourForecast,
  populate5DayForecast,
  populateLocationHeader,
} from './pageLoad';
import {
  getCurrentWeather,
  getFiveDayForecast,
  parseWeatherData,
  parseForecastData,
} from './openWeather';

const searchBtn = document.getElementById('search-button');
const searchInput = document.getElementById('search');

searchBtn.addEventListener('click', () => {
  const searchValue = searchInput.value;

  getCurrentWeather(searchValue).then((data) => parseWeatherData(data))
    .then((obj) => {
      setBackgroundImage(obj);
      populateCurrentWeather(obj);
      populateLocationHeader(obj.location);
    })
    .catch(() => { displayLoadingError('current'); });

  getFiveDayForecast(searchValue).then((data) => parseForecastData(data))
    .then((arr) => {
      const forecast24Hour = arr.slice(0, 9);
      const forecast5Day = [];
      for (let i = 7; i < arr.length; i += 8) { forecast5Day.push(arr[i]); }

      populate24HourForecast(forecast24Hour);
      populate5DayForecast(forecast5Day);
    })
    .catch(() => { displayLoadingError('forecast'); });
});

// By default load weather for Ottawa
getCurrentWeather('Ottawa').then((data) => parseWeatherData(data))
  .then((obj) => {
    setBackgroundImage(obj);
    populateCurrentWeather(obj);
    populateLocationHeader(obj.location);
  })
  .catch(() => { displayLoadingError('forecast'); });

getFiveDayForecast('Ottawa').then((data) => parseForecastData(data))
  .then((arr) => {
    const forecast24Hour = arr.slice(0, 9);
    const forecast5Day = [];
    for (let i = 7; i < arr.length; i += 8) { forecast5Day.push(arr[i]); }

    populate24HourForecast(forecast24Hour);
    populate5DayForecast(forecast5Day);
  })
  .catch(() => { displayLoadingError('forecast'); });
