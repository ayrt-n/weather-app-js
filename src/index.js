import {
  getCurrentWeather,
  getFiveDayForecast,
  parseWeatherData,
  parseForecastData,
} from './openWeather';

getCurrentWeather('Ottawa').then((data) => console.log(data));
getCurrentWeather('Ottawa').then((data) => console.log(parseWeatherData(data)));
getFiveDayForecast('Ottawa').then((data) => console.log(data));
getFiveDayForecast('Ottawa').then((data) => console.log(parseForecastData(data)));
