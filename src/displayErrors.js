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

export default displayLoadingError;
