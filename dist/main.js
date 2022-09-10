/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/datetime.js":
/*!*************************!*\
  !*** ./src/datetime.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatDayMonth": () => (/* binding */ formatDayMonth),
/* harmony export */   "formatHour": () => (/* binding */ formatHour)
/* harmony export */ });
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Input hour in military time, return string in am/pm format
function formatHour(hour) {
  if (hour < 12) {
    return `${hour} am`;
  }

  if (hour === 12) {
    return '12 pm';
  }

  return `${hour - 12} pm`;
}

function formatDayMonth(day, month) {
  return `${months[month]} ${day}`;
}




/***/ }),

/***/ "./src/displayErrors.js":
/*!******************************!*\
  !*** ./src/displayErrors.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const currentWeather = document.getElementById('current-weather');
const forecast24Hour = document.getElementById('24-hour-forecast');
const forecast5Day = document.getElementById('5-day-forecast');

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('error');
  errorDiv.textContent = 'Unable to fetch weather data - Check network connection or spelling!';

  return errorDiv;
}

function displayLoadingError(weatherDiv) {
  if (weatherDiv === 'current') {
    currentWeather.innerHTML = '';
    currentWeather.appendChild(createErrorMessage());
  } else if (weatherDiv === 'forecast') {
    forecast24Hour.innerHTML = '';
    forecast5Day.innerHTML = '';
    forecast24Hour.appendChild(createErrorMessage());
    forecast5Day.appendChild(createErrorMessage());
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (displayLoadingError);


/***/ }),

/***/ "./src/openWeather.js":
/*!****************************!*\
  !*** ./src/openWeather.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCurrentWeather": () => (/* binding */ getCurrentWeather),
/* harmony export */   "getFiveDayForecast": () => (/* binding */ getFiveDayForecast),
/* harmony export */   "parseForecastData": () => (/* binding */ parseForecastData),
/* harmony export */   "parseWeatherData": () => (/* binding */ parseWeatherData)
/* harmony export */ });
const apiKey = 'b9a8867dc7111cf01cd9943847a614f7';

// Fetches and returns current weather data in JSON format
async function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url, { mode: 'cors' });

  if (!response.ok) {
    throw new Error('Network response was not OK');
  }

  const data = await response.json();

  return data;
}

// Fetches and returns 3-hour/5-day weather forecast data in JSON format
async function getFiveDayForecast(city) {
  const current = await getCurrentWeather(city);

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url, { mode: 'cors' });

  if (!response.ok) {
    throw new Error('Network response was not OK');
  }

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




/***/ }),

/***/ "./src/pageLoad.js":
/*!*************************!*\
  !*** ./src/pageLoad.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "populate24HourForecast": () => (/* binding */ populate24HourForecast),
/* harmony export */   "populate5DayForecast": () => (/* binding */ populate5DayForecast),
/* harmony export */   "populateCurrentWeather": () => (/* binding */ populateCurrentWeather),
/* harmony export */   "populateLocationHeader": () => (/* binding */ populateLocationHeader),
/* harmony export */   "setBackgroundImage": () => (/* binding */ setBackgroundImage)
/* harmony export */ });
/* harmony import */ var _datetime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./datetime */ "./src/datetime.js");
/* harmony import */ var _weatherIcons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./weatherIcons */ "./src/weatherIcons.js");
/* harmony import */ var _weatherBackgrounds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./weatherBackgrounds */ "./src/weatherBackgrounds.js");




const mainContainer = document.getElementById('main');

// Set the background image based on weather object
function setBackgroundImage(weatherObj) {
  const backgroundImage = (0,_weatherBackgrounds__WEBPACK_IMPORTED_MODULE_2__["default"])(weatherObj.weatherId, weatherObj.isNight);
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
  icon.src = (0,_weatherIcons__WEBPACK_IMPORTED_MODULE_1__["default"])(weatherObj.weatherId, weatherObj.isNight);
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
  datetime.textContent = (0,_datetime__WEBPACK_IMPORTED_MODULE_0__.formatHour)(weatherObj.time.hour);
  icon.src = (0,_weatherIcons__WEBPACK_IMPORTED_MODULE_1__["default"])(weatherObj.weatherId, weatherObj.isNight);
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
  datetime.textContent = (0,_datetime__WEBPACK_IMPORTED_MODULE_0__.formatDayMonth)(weatherObj.time.day, weatherObj.time.month);
  icon.src = (0,_weatherIcons__WEBPACK_IMPORTED_MODULE_1__["default"])(weatherObj.weatherId, weatherObj.isNight);
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
  currentWeatherDiv.innerHTML = '';

  const currentWeatherCard = createCurrentWeatherCard(weatherObj);

  currentWeatherDiv.appendChild(currentWeatherCard);
}

// Populate the 24-hour forecast div with weather cards based on forecast array
function populate24HourForecast(forecastArray) {
  const forecastWeatherDiv = document.getElementById('24-hour-forecast');
  forecastWeatherDiv.innerHTML = '';

  forecastArray.forEach((forecast) => {
    const weatherCard = createHourlyForecastWeatherCard(forecast);
    forecastWeatherDiv.appendChild(weatherCard);
  });
}

// Populate the 5-day forecast div with weather cards based on forecast array
function populate5DayForecast(forecastArray) {
  const forecastWeatherDiv = document.getElementById('5-day-forecast');
  forecastWeatherDiv.innerHTML = '';

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




/***/ }),

/***/ "./src/weatherBackgrounds.js":
/*!***********************************!*\
  !*** ./src/weatherBackgrounds.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _images_background_rain_jpg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./images/background/rain.jpg */ "./src/images/background/rain.jpg");
/* harmony import */ var _images_background_day_jpg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/background/day.jpg */ "./src/images/background/day.jpg");
/* harmony import */ var _images_background_cloudy_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/background/cloudy.jpg */ "./src/images/background/cloudy.jpg");
/* harmony import */ var _images_background_fog_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./images/background/fog.jpg */ "./src/images/background/fog.jpg");
/* harmony import */ var _images_background_night_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./images/background/night.jpg */ "./src/images/background/night.jpg");
/* harmony import */ var _images_background_snow_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./images/background/snow.jpg */ "./src/images/background/snow.jpg");







function getWeatherBackground(weatherId, isNight) {
  let backgroundImage;

  switch (true) {
    case (weatherId >= 200 && weatherId < 600): {
      backgroundImage = _images_background_rain_jpg__WEBPACK_IMPORTED_MODULE_0__;
      break;
    }
    case (weatherId >= 600 && weatherId < 700): {
      backgroundImage = _images_background_snow_jpg__WEBPACK_IMPORTED_MODULE_5__;
      break;
    }
    case (weatherId >= 700 && weatherId < 800): {
      backgroundImage = _images_background_fog_jpg__WEBPACK_IMPORTED_MODULE_3__;
      break;
    }
    case (weatherId === 800 || weatherId === 801 || weatherId === 802): {
      backgroundImage = isNight ? _images_background_night_jpg__WEBPACK_IMPORTED_MODULE_4__ : _images_background_day_jpg__WEBPACK_IMPORTED_MODULE_1__;
      break;
    }
    case (weatherId === 803 || weatherId === 804): {
      backgroundImage = _images_background_cloudy_jpg__WEBPACK_IMPORTED_MODULE_2__;
      break;
    }
    default: {
      backgroundImage = _images_background_day_jpg__WEBPACK_IMPORTED_MODULE_1__;
    }
  }

  return backgroundImage;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getWeatherBackground);


/***/ }),

/***/ "./src/weatherIcons.js":
/*!*****************************!*\
  !*** ./src/weatherIcons.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _images_icons_clear_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./images/icons/clear.png */ "./src/images/icons/clear.png");
/* harmony import */ var _images_icons_night_clear_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/icons/night-clear.png */ "./src/images/icons/night-clear.png");
/* harmony import */ var _images_icons_cloudy_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/icons/cloudy.png */ "./src/images/icons/cloudy.png");
/* harmony import */ var _images_icons_fog_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./images/icons/fog.png */ "./src/images/icons/fog.png");
/* harmony import */ var _images_icons_night_partly_cloudy_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./images/icons/night-partly-cloudy.png */ "./src/images/icons/night-partly-cloudy.png");
/* harmony import */ var _images_icons_night_fog_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./images/icons/night-fog.png */ "./src/images/icons/night-fog.png");
/* harmony import */ var _images_icons_partly_cloudy_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./images/icons/partly-cloudy.png */ "./src/images/icons/partly-cloudy.png");
/* harmony import */ var _images_icons_rain_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./images/icons/rain.png */ "./src/images/icons/rain.png");
/* harmony import */ var _images_icons_snow_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./images/icons/snow.png */ "./src/images/icons/snow.png");
/* harmony import */ var _images_icons_storm_png__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./images/icons/storm.png */ "./src/images/icons/storm.png");











function getWeatherIcon(weatherId, isNight) {
  let icon;

  switch (true) {
    case (weatherId >= 200 && weatherId < 300): {
      icon = _images_icons_storm_png__WEBPACK_IMPORTED_MODULE_9__;
      break;
    }
    case (weatherId >= 300 && weatherId < 600): {
      icon = _images_icons_rain_png__WEBPACK_IMPORTED_MODULE_7__;
      break;
    }
    case (weatherId >= 600 && weatherId < 700): {
      icon = _images_icons_snow_png__WEBPACK_IMPORTED_MODULE_8__;
      break;
    }
    case (weatherId >= 700 && weatherId < 800): {
      icon = isNight ? _images_icons_night_fog_png__WEBPACK_IMPORTED_MODULE_5__ : _images_icons_fog_png__WEBPACK_IMPORTED_MODULE_3__;
      break;
    }
    case (weatherId === 800): {
      icon = isNight ? _images_icons_night_clear_png__WEBPACK_IMPORTED_MODULE_1__ : _images_icons_clear_png__WEBPACK_IMPORTED_MODULE_0__;
      break;
    }
    case (weatherId === 801 || weatherId === 802): {
      icon = isNight ? _images_icons_night_partly_cloudy_png__WEBPACK_IMPORTED_MODULE_4__ : _images_icons_partly_cloudy_png__WEBPACK_IMPORTED_MODULE_6__;
      break;
    }
    case (weatherId === 803 || weatherId === 804): {
      icon = _images_icons_cloudy_png__WEBPACK_IMPORTED_MODULE_2__;
      break;
    }
    default: {
      icon = _images_icons_clear_png__WEBPACK_IMPORTED_MODULE_0__;
    }
  }

  return icon;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getWeatherIcon);


/***/ }),

/***/ "./src/images/background/cloudy.jpg":
/*!******************************************!*\
  !*** ./src/images/background/cloudy.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "d76ae2e846689c60e43c.jpg";

/***/ }),

/***/ "./src/images/background/day.jpg":
/*!***************************************!*\
  !*** ./src/images/background/day.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "477d081c363cbf0e581d.jpg";

/***/ }),

/***/ "./src/images/background/fog.jpg":
/*!***************************************!*\
  !*** ./src/images/background/fog.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "52549602423cfcdf7c88.jpg";

/***/ }),

/***/ "./src/images/background/night.jpg":
/*!*****************************************!*\
  !*** ./src/images/background/night.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "b215f4fd003d395450af.jpg";

/***/ }),

/***/ "./src/images/background/rain.jpg":
/*!****************************************!*\
  !*** ./src/images/background/rain.jpg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "78de501afa2c8dbbb2b8.jpg";

/***/ }),

/***/ "./src/images/background/snow.jpg":
/*!****************************************!*\
  !*** ./src/images/background/snow.jpg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "9ccb0decd049af44806a.jpg";

/***/ }),

/***/ "./src/images/icons/clear.png":
/*!************************************!*\
  !*** ./src/images/icons/clear.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "6ee6e0aed6236cc9385e.png";

/***/ }),

/***/ "./src/images/icons/cloudy.png":
/*!*************************************!*\
  !*** ./src/images/icons/cloudy.png ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "afac0a7f11de4ba00dd2.png";

/***/ }),

/***/ "./src/images/icons/fog.png":
/*!**********************************!*\
  !*** ./src/images/icons/fog.png ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f96cacc79ac499326118.png";

/***/ }),

/***/ "./src/images/icons/night-clear.png":
/*!******************************************!*\
  !*** ./src/images/icons/night-clear.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "2f77e6f6fea7c1c76b53.png";

/***/ }),

/***/ "./src/images/icons/night-fog.png":
/*!****************************************!*\
  !*** ./src/images/icons/night-fog.png ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "b24a39488e7d0163ab4f.png";

/***/ }),

/***/ "./src/images/icons/night-partly-cloudy.png":
/*!**************************************************!*\
  !*** ./src/images/icons/night-partly-cloudy.png ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "92851d3be2d3d2253a87.png";

/***/ }),

/***/ "./src/images/icons/partly-cloudy.png":
/*!********************************************!*\
  !*** ./src/images/icons/partly-cloudy.png ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f4c5deddc256cf2d3296.png";

/***/ }),

/***/ "./src/images/icons/rain.png":
/*!***********************************!*\
  !*** ./src/images/icons/rain.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "0ffb0449c200d5d404b8.png";

/***/ }),

/***/ "./src/images/icons/snow.png":
/*!***********************************!*\
  !*** ./src/images/icons/snow.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "66584baa9171cd3c1cf7.png";

/***/ }),

/***/ "./src/images/icons/storm.png":
/*!************************************!*\
  !*** ./src/images/icons/storm.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "3b6a5537c8fe0b2e7103.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _displayErrors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./displayErrors */ "./src/displayErrors.js");
/* harmony import */ var _pageLoad__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pageLoad */ "./src/pageLoad.js");
/* harmony import */ var _openWeather__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./openWeather */ "./src/openWeather.js");




const searchBtn = document.getElementById('search-button');
const searchInput = document.getElementById('search');

searchBtn.addEventListener('click', () => {
  const searchValue = searchInput.value;

  (0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.getCurrentWeather)(searchValue).then((data) => (0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.parseWeatherData)(data))
    .then((obj) => {
      (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.setBackgroundImage)(obj);
      (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populateCurrentWeather)(obj);
      (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populateLocationHeader)(obj.location);
    })
    .catch(() => { (0,_displayErrors__WEBPACK_IMPORTED_MODULE_0__["default"])('current'); });

  (0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.getFiveDayForecast)(searchValue).then((data) => (0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.parseForecastData)(data))
    .then((arr) => {
      const forecast24Hour = arr.slice(0, 9);
      const forecast5Day = [];
      for (let i = 7; i < arr.length; i += 8) { forecast5Day.push(arr[i]); }

      (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populate24HourForecast)(forecast24Hour);
      (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populate5DayForecast)(forecast5Day);
    })
    .catch(() => { (0,_displayErrors__WEBPACK_IMPORTED_MODULE_0__["default"])('forecast'); });
});

// By default load weather for Ottawa
(0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.getCurrentWeather)('Ottawa').then((data) => (0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.parseWeatherData)(data))
  .then((obj) => {
    (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.setBackgroundImage)(obj);
    (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populateCurrentWeather)(obj);
    (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populateLocationHeader)(obj.location);
  })
  .catch(() => { (0,_displayErrors__WEBPACK_IMPORTED_MODULE_0__["default"])('forecast'); });

(0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.getFiveDayForecast)('Ottawa').then((data) => (0,_openWeather__WEBPACK_IMPORTED_MODULE_2__.parseForecastData)(data))
  .then((arr) => {
    const forecast24Hour = arr.slice(0, 9);
    const forecast5Day = [];
    for (let i = 7; i < arr.length; i += 8) { forecast5Day.push(arr[i]); }

    (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populate24HourForecast)(forecast24Hour);
    (0,_pageLoad__WEBPACK_IMPORTED_MODULE_1__.populate5DayForecast)(forecast5Day);
  })
  .catch(() => { (0,_displayErrors__WEBPACK_IMPORTED_MODULE_0__["default"])('forecast'); });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFtQixlQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvZGF0ZXRpbWUuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvZGlzcGxheUVycm9ycy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9vcGVuV2VhdGhlci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9wYWdlTG9hZC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy93ZWF0aGVyQmFja2dyb3VuZHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvd2VhdGhlckljb25zLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBtb250aHMgPSBbXG4gICdKYW51YXJ5JyxcbiAgJ0ZlYnJ1YXJ5JyxcbiAgJ01hcmNoJyxcbiAgJ0FwcmlsJyxcbiAgJ01heScsXG4gICdKdW5lJyxcbiAgJ0p1bHknLFxuICAnQXVndXN0JyxcbiAgJ1NlcHRlbWJlcicsXG4gICdPY3RvYmVyJyxcbiAgJ05vdmVtYmVyJyxcbiAgJ0RlY2VtYmVyJyxcbl07XG5cbi8vIElucHV0IGhvdXIgaW4gbWlsaXRhcnkgdGltZSwgcmV0dXJuIHN0cmluZyBpbiBhbS9wbSBmb3JtYXRcbmZ1bmN0aW9uIGZvcm1hdEhvdXIoaG91cikge1xuICBpZiAoaG91ciA8IDEyKSB7XG4gICAgcmV0dXJuIGAke2hvdXJ9IGFtYDtcbiAgfVxuXG4gIGlmIChob3VyID09PSAxMikge1xuICAgIHJldHVybiAnMTIgcG0nO1xuICB9XG5cbiAgcmV0dXJuIGAke2hvdXIgLSAxMn0gcG1gO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREYXlNb250aChkYXksIG1vbnRoKSB7XG4gIHJldHVybiBgJHttb250aHNbbW9udGhdfSAke2RheX1gO1xufVxuXG5leHBvcnQge1xuICBmb3JtYXRIb3VyLFxuICBmb3JtYXREYXlNb250aCxcbn07XG4iLCJjb25zdCBjdXJyZW50V2VhdGhlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyZW50LXdlYXRoZXInKTtcbmNvbnN0IGZvcmVjYXN0MjRIb3VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJzI0LWhvdXItZm9yZWNhc3QnKTtcbmNvbnN0IGZvcmVjYXN0NURheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCc1LWRheS1mb3JlY2FzdCcpO1xuXG5mdW5jdGlvbiBjcmVhdGVFcnJvck1lc3NhZ2UoKSB7XG4gIGNvbnN0IGVycm9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGVycm9yRGl2LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gIGVycm9yRGl2LnRleHRDb250ZW50ID0gJ1VuYWJsZSB0byBmZXRjaCB3ZWF0aGVyIGRhdGEgLSBDaGVjayBuZXR3b3JrIGNvbm5lY3Rpb24gb3Igc3BlbGxpbmchJztcblxuICByZXR1cm4gZXJyb3JEaXY7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlMb2FkaW5nRXJyb3Iod2VhdGhlckRpdikge1xuICBpZiAod2VhdGhlckRpdiA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgY3VycmVudFdlYXRoZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgY3VycmVudFdlYXRoZXIuYXBwZW5kQ2hpbGQoY3JlYXRlRXJyb3JNZXNzYWdlKCkpO1xuICB9IGVsc2UgaWYgKHdlYXRoZXJEaXYgPT09ICdmb3JlY2FzdCcpIHtcbiAgICBmb3JlY2FzdDI0SG91ci5pbm5lckhUTUwgPSAnJztcbiAgICBmb3JlY2FzdDVEYXkuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yZWNhc3QyNEhvdXIuYXBwZW5kQ2hpbGQoY3JlYXRlRXJyb3JNZXNzYWdlKCkpO1xuICAgIGZvcmVjYXN0NURheS5hcHBlbmRDaGlsZChjcmVhdGVFcnJvck1lc3NhZ2UoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheUxvYWRpbmdFcnJvcjtcbiIsImNvbnN0IGFwaUtleSA9ICdiOWE4ODY3ZGM3MTExY2YwMWNkOTk0Mzg0N2E2MTRmNyc7XG5cbi8vIEZldGNoZXMgYW5kIHJldHVybnMgY3VycmVudCB3ZWF0aGVyIGRhdGEgaW4gSlNPTiBmb3JtYXRcbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRXZWF0aGVyKGNpdHkpIHtcbiAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3E9JHtjaXR5fSZhcHBpZD0ke2FwaUtleX0mdW5pdHM9bWV0cmljYDtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogJ2NvcnMnIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBPSycpO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLy8gRmV0Y2hlcyBhbmQgcmV0dXJucyAzLWhvdXIvNS1kYXkgd2VhdGhlciBmb3JlY2FzdCBkYXRhIGluIEpTT04gZm9ybWF0XG5hc3luYyBmdW5jdGlvbiBnZXRGaXZlRGF5Rm9yZWNhc3QoY2l0eSkge1xuICBjb25zdCBjdXJyZW50ID0gYXdhaXQgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSk7XG5cbiAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9xPSR7Y2l0eX0mYXBwaWQ9JHthcGlLZXl9JnVuaXRzPW1ldHJpY2A7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6ICdjb3JzJyB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3QgT0snKTtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgLy8gU2V0IHN1bnJpc2UgYW5kIHN1bnNldCB2YXJpYWJsZSwgbm90IGF2YWlsYWJsZSBpbiBmb3JlY2FzdCBBUEkgY2FsbFxuICBkYXRhLnN5cyA9IHtcbiAgICBzdW5yaXNlOiBjdXJyZW50LnN5cy5zdW5yaXNlLFxuICAgIHN1bnNldDogY3VycmVudC5zeXMuc3Vuc2V0LFxuICB9O1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGl0IGlzIGRheSBvciBuaWdodCBiYXNlZCBvbiBjdXJyZW50IHRpbWUgYW5kIHN1bnJpc2Uvc3Vuc2V0IHRpbWUgYW5kIHJldHVybiBib29sXG5mdW5jdGlvbiBpc05pZ2h0VGltZShjdXJyZW50LCBzdW5yaXNlLCBzdW5zZXQpIHtcbiAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShjdXJyZW50ICogMTAwMCk7XG4gIGNvbnN0IHN1bnJpc2VEYXRlID0gbmV3IERhdGUoc3VucmlzZSAqIDEwMDApO1xuICBjb25zdCBzdW5zZXREYXRlID0gbmV3IERhdGUoc3Vuc2V0ICogMTAwMCk7XG4gIGNvbnN0IGN1cnJlbnRIb3VyID0gY3VycmVudERhdGUuZ2V0SG91cnMoKTtcbiAgY29uc3Qgc3VucmlzZUhvdXIgPSBzdW5yaXNlRGF0ZS5nZXRIb3VycygpO1xuICBjb25zdCBzdW5zZXRIb3VyID0gc3Vuc2V0RGF0ZS5nZXRIb3VycygpO1xuXG4gIGlmIChjdXJyZW50SG91ciA+PSBzdW5yaXNlSG91ciAmJiBjdXJyZW50SG91ciA8IHN1bnNldEhvdXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gUGFyc2VzIE9wZW4gV2VhdGhlciByZXR1cm4gZGF0YSBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCBpbXBvcnRhbnQgdmFyaWFibGVzXG5mdW5jdGlvbiBwYXJzZVdlYXRoZXJEYXRhKGRhdGEpIHtcbiAgY29uc3QgdGltZU9iaiA9IHt9O1xuICB0aW1lT2JqLmZ1bGwgPSBuZXcgRGF0ZShkYXRhLmR0ICogMTAwMCk7XG4gIHRpbWVPYmouaG91ciA9IHRpbWVPYmouZnVsbC5nZXRIb3VycygpO1xuICB0aW1lT2JqLm1pbnV0ZSA9IHRpbWVPYmouZnVsbC5nZXRNaW51dGVzKCk7XG4gIHRpbWVPYmoubW9udGggPSB0aW1lT2JqLmZ1bGwuZ2V0TW9udGgoKTtcbiAgdGltZU9iai5kYXkgPSB0aW1lT2JqLmZ1bGwuZ2V0VVRDRGF0ZSgpO1xuXG4gIGNvbnN0IGxvY2F0aW9uID0gKGRhdGEuY2l0eSlcbiAgICA/IGAke2RhdGEuY2l0eS5uYW1lfSwgJHtkYXRhLmNpdHkuY291bnRyeX1gXG4gICAgOiBgJHtkYXRhLm5hbWV9LCAke2RhdGEuc3lzLmNvdW50cnl9YDtcblxuICByZXR1cm4ge1xuICAgIGxvY2F0aW9uLFxuICAgIHRpbWU6IHRpbWVPYmosXG4gICAgdGVtcDogTWF0aC5yb3VuZChkYXRhLm1haW4udGVtcCksXG4gICAgdGVtcEZlZWxzTGlrZTogTWF0aC5yb3VuZChkYXRhLm1haW4uZmVlbHNfbGlrZSksXG4gICAgaGlnaDogTWF0aC5yb3VuZChkYXRhLm1haW4udGVtcF9tYXgpLFxuICAgIG1pbjogTWF0aC5yb3VuZChkYXRhLm1haW4udGVtcF9taW4pLFxuICAgIHdlYXRoZXI6IGRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbixcbiAgICB3ZWF0aGVySWQ6IGRhdGEud2VhdGhlclswXS5pZCxcbiAgICBpc05pZ2h0OiBpc05pZ2h0VGltZShkYXRhLmR0LCBkYXRhLnN5cy5zdW5yaXNlLCBkYXRhLnN5cy5zdW5zZXQpLFxuICB9O1xufVxuXG4vLyBQYXJzZXMgYXJyYXkgb2YgT3BlbiBXZWF0aGVyIHJldHVybiBkYXRhIGFuZCByZXR1cm5zIGFycmF5IG9mIG9iamVjdHMgd2l0aCBpbXBvcnRhbnQgdmFyaWFibGVzXG5mdW5jdGlvbiBwYXJzZUZvcmVjYXN0RGF0YShmb3JlY2FzdERhdGEpIHtcbiAgLy8gSW5lZmZpY2llbnQgYnV0IGNhbGwgYW5kIGFkZCBzdW5yaXNlL3N1bnNldCBhdHRyIHRvIGVhY2ggZWxlbWVudCBpbiBmb3JlY2FzdCBhcnJheVxuICBjb25zdCBmb3JlY2FzdEFycmF5ID0gZm9yZWNhc3REYXRhLmxpc3QubWFwKChkYXRhKSA9PiAoeyAuLi5kYXRhLCBzeXM6IGZvcmVjYXN0RGF0YS5zeXMgfSkpO1xuXG4gIC8vIE1hcCBmb3JlY2FzdCBhcnJheSB0cmFuc2Zvcm1pbmcgaW50byBhcnJheSBvZiB3ZWF0aGVyIG9iamVjdHNcbiAgY29uc3QgZm9yZWNhc3QgPSBmb3JlY2FzdEFycmF5Lm1hcCgoZGF0YSkgPT4gcGFyc2VXZWF0aGVyRGF0YShkYXRhKSk7XG4gIHJldHVybiBmb3JlY2FzdDtcbn1cblxuZXhwb3J0IHtcbiAgZ2V0Q3VycmVudFdlYXRoZXIsXG4gIGdldEZpdmVEYXlGb3JlY2FzdCxcbiAgcGFyc2VXZWF0aGVyRGF0YSxcbiAgcGFyc2VGb3JlY2FzdERhdGEsXG59O1xuIiwiaW1wb3J0IHsgZm9ybWF0SG91ciwgZm9ybWF0RGF5TW9udGggfSBmcm9tICcuL2RhdGV0aW1lJztcbmltcG9ydCBnZXRXZWF0aGVySWNvbiBmcm9tICcuL3dlYXRoZXJJY29ucyc7XG5pbXBvcnQgZ2V0V2VhdGhlckJhY2tncm91bmQgZnJvbSAnLi93ZWF0aGVyQmFja2dyb3VuZHMnO1xuXG5jb25zdCBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcblxuLy8gU2V0IHRoZSBiYWNrZ3JvdW5kIGltYWdlIGJhc2VkIG9uIHdlYXRoZXIgb2JqZWN0XG5mdW5jdGlvbiBzZXRCYWNrZ3JvdW5kSW1hZ2Uod2VhdGhlck9iaikge1xuICBjb25zdCBiYWNrZ3JvdW5kSW1hZ2UgPSBnZXRXZWF0aGVyQmFja2dyb3VuZCh3ZWF0aGVyT2JqLndlYXRoZXJJZCwgd2VhdGhlck9iai5pc05pZ2h0KTtcbiAgbWFpbkNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7YmFja2dyb3VuZEltYWdlfSlgO1xufVxuXG4vLyBSZXR1cm4gd2VhdGhlci1jYXJkIGRpdiB3aXRoIGN1cnJlbnQgd2VhdGhlciBpbmZvcm1hdGlvbiwgZ2l2ZW4gd2VhdGhlciBvYmplY3RcbmZ1bmN0aW9uIGNyZWF0ZUN1cnJlbnRXZWF0aGVyQ2FyZCh3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgY29uc3QgZmVlbHNMaWtlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3dlYXRoZXItY2FyZCcpO1xuICBpY29uLnNyYyA9IGdldFdlYXRoZXJJY29uKHdlYXRoZXJPYmoud2VhdGhlcklkLCB3ZWF0aGVyT2JqLmlzTmlnaHQpO1xuICB0ZW1wLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLnRlbXB9IMKwIENgO1xuICBmZWVsc0xpa2UuY2xhc3NMaXN0LmFkZCgnc3VidGl0bGUnKTtcbiAgZmVlbHNMaWtlLnRleHRDb250ZW50ID0gYEZlZWxzIGxpa2UgJHt3ZWF0aGVyT2JqLnRlbXBGZWVsc0xpa2V9YDtcbiAgZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG5cbiAgY2FyZC5hcHBlbmRDaGlsZChpY29uKTtcbiAgY2FyZC5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgY2FyZC5hcHBlbmRDaGlsZChmZWVsc0xpa2UpO1xuICBjYXJkLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcblxuICByZXR1cm4gY2FyZDtcbn1cblxuLy8gUmV0dXJuIHdlYXRoZXItY2FyZCBkaXYgd2l0aCBmb3JlY2FzdCB3ZWF0aGVyIGluZm9ybWF0aW9uLCBnaXZlbiB3ZWF0aGVyIG9iamVjdFxuZnVuY3Rpb24gY3JlYXRlSG91cmx5Rm9yZWNhc3RXZWF0aGVyQ2FyZCh3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgZGF0ZXRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgY29uc3QgZmVlbHNMaWtlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3dlYXRoZXItY2FyZCcpO1xuICBkYXRldGltZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpO1xuICBkYXRldGltZS50ZXh0Q29udGVudCA9IGZvcm1hdEhvdXIod2VhdGhlck9iai50aW1lLmhvdXIpO1xuICBpY29uLnNyYyA9IGdldFdlYXRoZXJJY29uKHdlYXRoZXJPYmoud2VhdGhlcklkLCB3ZWF0aGVyT2JqLmlzTmlnaHQpO1xuICB0ZW1wLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyT2JqLnRlbXB9IMKwIENgO1xuICBmZWVsc0xpa2UuY2xhc3NMaXN0LmFkZCgnc3VidGl0bGUnKTtcbiAgZmVlbHNMaWtlLnRleHRDb250ZW50ID0gYEZlZWxzIGxpa2UgJHt3ZWF0aGVyT2JqLnRlbXBGZWVsc0xpa2V9YDtcbiAgZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB3ZWF0aGVyT2JqLndlYXRoZXI7XG5cbiAgY2FyZC5hcHBlbmRDaGlsZChkYXRldGltZSk7XG4gIGNhcmQuYXBwZW5kQ2hpbGQoaWNvbik7XG4gIGNhcmQuYXBwZW5kQ2hpbGQodGVtcCk7XG4gIGNhcmQuYXBwZW5kQ2hpbGQoZmVlbHNMaWtlKTtcbiAgY2FyZC5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG5cbiAgcmV0dXJuIGNhcmQ7XG59XG5cbi8vIFJldHVybiB3ZWF0aGVyLWNhcmQgZGl2IHdpdGggZm9yZWNhc3Qgd2VhdGhlciBpbmZvcm1hdGlvbiwgZ2l2ZW4gd2VhdGhlciBvYmplY3RcbmZ1bmN0aW9uIGNyZWF0ZURhaWx5Rm9yZWNhc3RXZWF0aGVyQ2FyZCh3ZWF0aGVyT2JqKSB7XG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgZGF0ZXRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgY29uc3QgZmVlbHNMaWtlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3dlYXRoZXItY2FyZCcpO1xuICBkYXRldGltZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpO1xuICBkYXRldGltZS50ZXh0Q29udGVudCA9IGZvcm1hdERheU1vbnRoKHdlYXRoZXJPYmoudGltZS5kYXksIHdlYXRoZXJPYmoudGltZS5tb250aCk7XG4gIGljb24uc3JjID0gZ2V0V2VhdGhlckljb24od2VhdGhlck9iai53ZWF0aGVySWQsIHdlYXRoZXJPYmouaXNOaWdodCk7XG4gIHRlbXAuY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgdGVtcC50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJPYmoudGVtcH0gwrAgQ2A7XG4gIGZlZWxzTGlrZS5jbGFzc0xpc3QuYWRkKCdzdWJ0aXRsZScpO1xuICBmZWVsc0xpa2UudGV4dENvbnRlbnQgPSBgRmVlbHMgbGlrZSAke3dlYXRoZXJPYmoudGVtcEZlZWxzTGlrZX1gO1xuICBkZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCd0aXRsZScpO1xuICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHdlYXRoZXJPYmoud2VhdGhlcjtcblxuICBjYXJkLmFwcGVuZENoaWxkKGRhdGV0aW1lKTtcbiAgY2FyZC5hcHBlbmRDaGlsZChpY29uKTtcbiAgY2FyZC5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgY2FyZC5hcHBlbmRDaGlsZChmZWVsc0xpa2UpO1xuICBjYXJkLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcblxuICByZXR1cm4gY2FyZDtcbn1cblxuLy8gUG9wdWxhdGUgdGhlIGN1cnJlbnQgd2VhdGhlciBkaXYgd2l0aCB3ZWF0aGVyIGNhcmQgYmFzZWQgb24gd2VhdGhlciBvYmplY3RcbmZ1bmN0aW9uIHBvcHVsYXRlQ3VycmVudFdlYXRoZXIod2VhdGhlck9iaikge1xuICBjb25zdCBjdXJyZW50V2VhdGhlckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyZW50LXdlYXRoZXInKTtcbiAgY3VycmVudFdlYXRoZXJEaXYuaW5uZXJIVE1MID0gJyc7XG5cbiAgY29uc3QgY3VycmVudFdlYXRoZXJDYXJkID0gY3JlYXRlQ3VycmVudFdlYXRoZXJDYXJkKHdlYXRoZXJPYmopO1xuXG4gIGN1cnJlbnRXZWF0aGVyRGl2LmFwcGVuZENoaWxkKGN1cnJlbnRXZWF0aGVyQ2FyZCk7XG59XG5cbi8vIFBvcHVsYXRlIHRoZSAyNC1ob3VyIGZvcmVjYXN0IGRpdiB3aXRoIHdlYXRoZXIgY2FyZHMgYmFzZWQgb24gZm9yZWNhc3QgYXJyYXlcbmZ1bmN0aW9uIHBvcHVsYXRlMjRIb3VyRm9yZWNhc3QoZm9yZWNhc3RBcnJheSkge1xuICBjb25zdCBmb3JlY2FzdFdlYXRoZXJEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnMjQtaG91ci1mb3JlY2FzdCcpO1xuICBmb3JlY2FzdFdlYXRoZXJEaXYuaW5uZXJIVE1MID0gJyc7XG5cbiAgZm9yZWNhc3RBcnJheS5mb3JFYWNoKChmb3JlY2FzdCkgPT4ge1xuICAgIGNvbnN0IHdlYXRoZXJDYXJkID0gY3JlYXRlSG91cmx5Rm9yZWNhc3RXZWF0aGVyQ2FyZChmb3JlY2FzdCk7XG4gICAgZm9yZWNhc3RXZWF0aGVyRGl2LmFwcGVuZENoaWxkKHdlYXRoZXJDYXJkKTtcbiAgfSk7XG59XG5cbi8vIFBvcHVsYXRlIHRoZSA1LWRheSBmb3JlY2FzdCBkaXYgd2l0aCB3ZWF0aGVyIGNhcmRzIGJhc2VkIG9uIGZvcmVjYXN0IGFycmF5XG5mdW5jdGlvbiBwb3B1bGF0ZTVEYXlGb3JlY2FzdChmb3JlY2FzdEFycmF5KSB7XG4gIGNvbnN0IGZvcmVjYXN0V2VhdGhlckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCc1LWRheS1mb3JlY2FzdCcpO1xuICBmb3JlY2FzdFdlYXRoZXJEaXYuaW5uZXJIVE1MID0gJyc7XG5cbiAgZm9yZWNhc3RBcnJheS5mb3JFYWNoKChmb3JlY2FzdCkgPT4ge1xuICAgIGNvbnN0IHdlYXRoZXJDYXJkID0gY3JlYXRlRGFpbHlGb3JlY2FzdFdlYXRoZXJDYXJkKGZvcmVjYXN0KTtcbiAgICBmb3JlY2FzdFdlYXRoZXJEaXYuYXBwZW5kQ2hpbGQod2VhdGhlckNhcmQpO1xuICB9KTtcbn1cblxuLy8gU2V0IHRoZSBsb2NhdGlvbiBoZWFkZXJcbmZ1bmN0aW9uIHBvcHVsYXRlTG9jYXRpb25IZWFkZXIobG9jYXRpb24pIHtcbiAgY29uc3QgbG9jYXRpb25IZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24nKTtcbiAgbG9jYXRpb25IZWFkZXIudGV4dENvbnRlbnQgPSBsb2NhdGlvbjtcbn1cblxuZXhwb3J0IHtcbiAgc2V0QmFja2dyb3VuZEltYWdlLFxuICBwb3B1bGF0ZUN1cnJlbnRXZWF0aGVyLFxuICBwb3B1bGF0ZTI0SG91ckZvcmVjYXN0LFxuICBwb3B1bGF0ZTVEYXlGb3JlY2FzdCxcbiAgcG9wdWxhdGVMb2NhdGlvbkhlYWRlcixcbn07XG4iLCJpbXBvcnQgcmFpbiBmcm9tICcuL2ltYWdlcy9iYWNrZ3JvdW5kL3JhaW4uanBnJztcbmltcG9ydCBkYXkgZnJvbSAnLi9pbWFnZXMvYmFja2dyb3VuZC9kYXkuanBnJztcbmltcG9ydCBjbG91ZHkgZnJvbSAnLi9pbWFnZXMvYmFja2dyb3VuZC9jbG91ZHkuanBnJztcbmltcG9ydCBmb2cgZnJvbSAnLi9pbWFnZXMvYmFja2dyb3VuZC9mb2cuanBnJztcbmltcG9ydCBuaWdodCBmcm9tICcuL2ltYWdlcy9iYWNrZ3JvdW5kL25pZ2h0LmpwZyc7XG5pbXBvcnQgc25vdyBmcm9tICcuL2ltYWdlcy9iYWNrZ3JvdW5kL3Nub3cuanBnJztcblxuZnVuY3Rpb24gZ2V0V2VhdGhlckJhY2tncm91bmQod2VhdGhlcklkLCBpc05pZ2h0KSB7XG4gIGxldCBiYWNrZ3JvdW5kSW1hZ2U7XG5cbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSAod2VhdGhlcklkID49IDIwMCAmJiB3ZWF0aGVySWQgPCA2MDApOiB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2UgPSByYWluO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgKHdlYXRoZXJJZCA+PSA2MDAgJiYgd2VhdGhlcklkIDwgNzAwKToge1xuICAgICAgYmFja2dyb3VuZEltYWdlID0gc25vdztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICh3ZWF0aGVySWQgPj0gNzAwICYmIHdlYXRoZXJJZCA8IDgwMCk6IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZSA9IGZvZztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICh3ZWF0aGVySWQgPT09IDgwMCB8fCB3ZWF0aGVySWQgPT09IDgwMSB8fCB3ZWF0aGVySWQgPT09IDgwMik6IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZSA9IGlzTmlnaHQgPyBuaWdodCA6IGRheTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICh3ZWF0aGVySWQgPT09IDgwMyB8fCB3ZWF0aGVySWQgPT09IDgwNCk6IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZSA9IGNsb3VkeTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2UgPSBkYXk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJhY2tncm91bmRJbWFnZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0V2VhdGhlckJhY2tncm91bmQ7XG4iLCJpbXBvcnQgY2xlYXJEYXkgZnJvbSAnLi9pbWFnZXMvaWNvbnMvY2xlYXIucG5nJztcbmltcG9ydCBjbGVhck5pZ2h0IGZyb20gJy4vaW1hZ2VzL2ljb25zL25pZ2h0LWNsZWFyLnBuZyc7XG5pbXBvcnQgY2xvdWR5IGZyb20gJy4vaW1hZ2VzL2ljb25zL2Nsb3VkeS5wbmcnO1xuaW1wb3J0IGZvZ0RheSBmcm9tICcuL2ltYWdlcy9pY29ucy9mb2cucG5nJztcbmltcG9ydCBwYXJ0bHlDbG91ZHlOaWdodCBmcm9tICcuL2ltYWdlcy9pY29ucy9uaWdodC1wYXJ0bHktY2xvdWR5LnBuZyc7XG5pbXBvcnQgZm9nTmlnaHQgZnJvbSAnLi9pbWFnZXMvaWNvbnMvbmlnaHQtZm9nLnBuZyc7XG5pbXBvcnQgcGFydGx5Q2xvdWR5RGF5IGZyb20gJy4vaW1hZ2VzL2ljb25zL3BhcnRseS1jbG91ZHkucG5nJztcbmltcG9ydCByYWluIGZyb20gJy4vaW1hZ2VzL2ljb25zL3JhaW4ucG5nJztcbmltcG9ydCBzbm93IGZyb20gJy4vaW1hZ2VzL2ljb25zL3Nub3cucG5nJztcbmltcG9ydCBzdG9ybSBmcm9tICcuL2ltYWdlcy9pY29ucy9zdG9ybS5wbmcnO1xuXG5mdW5jdGlvbiBnZXRXZWF0aGVySWNvbih3ZWF0aGVySWQsIGlzTmlnaHQpIHtcbiAgbGV0IGljb247XG5cbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSAod2VhdGhlcklkID49IDIwMCAmJiB3ZWF0aGVySWQgPCAzMDApOiB7XG4gICAgICBpY29uID0gc3Rvcm07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAod2VhdGhlcklkID49IDMwMCAmJiB3ZWF0aGVySWQgPCA2MDApOiB7XG4gICAgICBpY29uID0gcmFpbjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICh3ZWF0aGVySWQgPj0gNjAwICYmIHdlYXRoZXJJZCA8IDcwMCk6IHtcbiAgICAgIGljb24gPSBzbm93O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgKHdlYXRoZXJJZCA+PSA3MDAgJiYgd2VhdGhlcklkIDwgODAwKToge1xuICAgICAgaWNvbiA9IGlzTmlnaHQgPyBmb2dOaWdodCA6IGZvZ0RheTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICh3ZWF0aGVySWQgPT09IDgwMCk6IHtcbiAgICAgIGljb24gPSBpc05pZ2h0ID8gY2xlYXJOaWdodCA6IGNsZWFyRGF5O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgKHdlYXRoZXJJZCA9PT0gODAxIHx8IHdlYXRoZXJJZCA9PT0gODAyKToge1xuICAgICAgaWNvbiA9IGlzTmlnaHQgPyBwYXJ0bHlDbG91ZHlOaWdodCA6IHBhcnRseUNsb3VkeURheTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICh3ZWF0aGVySWQgPT09IDgwMyB8fCB3ZWF0aGVySWQgPT09IDgwNCk6IHtcbiAgICAgIGljb24gPSBjbG91ZHk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgaWNvbiA9IGNsZWFyRGF5O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpY29uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRXZWF0aGVySWNvbjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsImltcG9ydCBkaXNwbGF5TG9hZGluZ0Vycm9yIGZyb20gJy4vZGlzcGxheUVycm9ycyc7XG5pbXBvcnQge1xuICBzZXRCYWNrZ3JvdW5kSW1hZ2UsXG4gIHBvcHVsYXRlQ3VycmVudFdlYXRoZXIsXG4gIHBvcHVsYXRlMjRIb3VyRm9yZWNhc3QsXG4gIHBvcHVsYXRlNURheUZvcmVjYXN0LFxuICBwb3B1bGF0ZUxvY2F0aW9uSGVhZGVyLFxufSBmcm9tICcuL3BhZ2VMb2FkJztcbmltcG9ydCB7XG4gIGdldEN1cnJlbnRXZWF0aGVyLFxuICBnZXRGaXZlRGF5Rm9yZWNhc3QsXG4gIHBhcnNlV2VhdGhlckRhdGEsXG4gIHBhcnNlRm9yZWNhc3REYXRhLFxufSBmcm9tICcuL29wZW5XZWF0aGVyJztcblxuY29uc3Qgc2VhcmNoQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1idXR0b24nKTtcbmNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaCcpO1xuXG5zZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IHNlYXJjaFZhbHVlID0gc2VhcmNoSW5wdXQudmFsdWU7XG5cbiAgZ2V0Q3VycmVudFdlYXRoZXIoc2VhcmNoVmFsdWUpLnRoZW4oKGRhdGEpID0+IHBhcnNlV2VhdGhlckRhdGEoZGF0YSkpXG4gICAgLnRoZW4oKG9iaikgPT4ge1xuICAgICAgc2V0QmFja2dyb3VuZEltYWdlKG9iaik7XG4gICAgICBwb3B1bGF0ZUN1cnJlbnRXZWF0aGVyKG9iaik7XG4gICAgICBwb3B1bGF0ZUxvY2F0aW9uSGVhZGVyKG9iai5sb2NhdGlvbik7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4geyBkaXNwbGF5TG9hZGluZ0Vycm9yKCdjdXJyZW50Jyk7IH0pO1xuXG4gIGdldEZpdmVEYXlGb3JlY2FzdChzZWFyY2hWYWx1ZSkudGhlbigoZGF0YSkgPT4gcGFyc2VGb3JlY2FzdERhdGEoZGF0YSkpXG4gICAgLnRoZW4oKGFycikgPT4ge1xuICAgICAgY29uc3QgZm9yZWNhc3QyNEhvdXIgPSBhcnIuc2xpY2UoMCwgOSk7XG4gICAgICBjb25zdCBmb3JlY2FzdDVEYXkgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSA3OyBpIDwgYXJyLmxlbmd0aDsgaSArPSA4KSB7IGZvcmVjYXN0NURheS5wdXNoKGFycltpXSk7IH1cblxuICAgICAgcG9wdWxhdGUyNEhvdXJGb3JlY2FzdChmb3JlY2FzdDI0SG91cik7XG4gICAgICBwb3B1bGF0ZTVEYXlGb3JlY2FzdChmb3JlY2FzdDVEYXkpO1xuICAgIH0pXG4gICAgLmNhdGNoKCgpID0+IHsgZGlzcGxheUxvYWRpbmdFcnJvcignZm9yZWNhc3QnKTsgfSk7XG59KTtcblxuLy8gQnkgZGVmYXVsdCBsb2FkIHdlYXRoZXIgZm9yIE90dGF3YVxuZ2V0Q3VycmVudFdlYXRoZXIoJ090dGF3YScpLnRoZW4oKGRhdGEpID0+IHBhcnNlV2VhdGhlckRhdGEoZGF0YSkpXG4gIC50aGVuKChvYmopID0+IHtcbiAgICBzZXRCYWNrZ3JvdW5kSW1hZ2Uob2JqKTtcbiAgICBwb3B1bGF0ZUN1cnJlbnRXZWF0aGVyKG9iaik7XG4gICAgcG9wdWxhdGVMb2NhdGlvbkhlYWRlcihvYmoubG9jYXRpb24pO1xuICB9KVxuICAuY2F0Y2goKCkgPT4geyBkaXNwbGF5TG9hZGluZ0Vycm9yKCdmb3JlY2FzdCcpOyB9KTtcblxuZ2V0Rml2ZURheUZvcmVjYXN0KCdPdHRhd2EnKS50aGVuKChkYXRhKSA9PiBwYXJzZUZvcmVjYXN0RGF0YShkYXRhKSlcbiAgLnRoZW4oKGFycikgPT4ge1xuICAgIGNvbnN0IGZvcmVjYXN0MjRIb3VyID0gYXJyLnNsaWNlKDAsIDkpO1xuICAgIGNvbnN0IGZvcmVjYXN0NURheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSA3OyBpIDwgYXJyLmxlbmd0aDsgaSArPSA4KSB7IGZvcmVjYXN0NURheS5wdXNoKGFycltpXSk7IH1cblxuICAgIHBvcHVsYXRlMjRIb3VyRm9yZWNhc3QoZm9yZWNhc3QyNEhvdXIpO1xuICAgIHBvcHVsYXRlNURheUZvcmVjYXN0KGZvcmVjYXN0NURheSk7XG4gIH0pXG4gIC5jYXRjaCgoKSA9PiB7IGRpc3BsYXlMb2FkaW5nRXJyb3IoJ2ZvcmVjYXN0Jyk7IH0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9