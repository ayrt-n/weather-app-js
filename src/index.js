import {
  setBackgroundImage,
  populateCurrentWeather,
  populate24HourForecast,
} from './pageLoad';
import {
  getCurrentWeather,
  getFiveDayForecast,
  parseWeatherData,
  parseForecastData,
} from './openWeather';

// getCurrentWeather('Ottawa').then((data) => console.log(data));
// getCurrentWeather('Ottawa').then((data) => console.log(parseWeatherData(data)));
// getFiveDayForecast('Ottawa').then((data) => console.log(data));
// getFiveDayForecast('Ottawa').then((data) => console.log(parseForecastData(data)));

getCurrentWeather('Ottawa').then((data) => parseWeatherData(data))
  .then((obj) => {
    setBackgroundImage(obj);
    populateCurrentWeather(obj);
  });

getFiveDayForecast('Ottawa').then((data) => parseForecastData(data))
  .then((arr) => {
    populate24HourForecast(arr.slice(0, 10));
  });
