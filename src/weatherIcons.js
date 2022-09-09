import clearDay from './images/icons/clear.png';
import clearNight from './images/icons/night-clear.png';
import cloudy from './images/icons/cloudy.png';
import fogDay from './images/icons/fog.png';
import partlyCloudyNight from './images/icons/night-partly-cloudy.png';
import fogNight from './images/icons/night-fog.png';
import partlyCloudyDay from './images/icons/partly-cloudy.png';
import rain from './images/icons/rain.png';
import snow from './images/icons/snow.png';
import storm from './images/icons/storm.png';

function getWeatherIcon(weatherId, isNight) {
  let icon;

  switch (true) {
    case (weatherId >= 200 && weatherId < 300): {
      icon = storm;
      break;
    }
    case (weatherId >= 300 && weatherId < 600): {
      icon = rain;
      break;
    }
    case (weatherId >= 600 && weatherId < 700): {
      icon = snow;
      break;
    }
    case (weatherId >= 700 && weatherId < 800): {
      icon = isNight ? fogNight : fogDay;
      break;
    }
    case (weatherId === 800): {
      icon = isNight ? clearNight : clearDay;
      break;
    }
    case (weatherId === 801 || weatherId === 802): {
      icon = isNight ? partlyCloudyNight : partlyCloudyDay;
      break;
    }
    case (weatherId === 803 || weatherId === 804): {
      icon = cloudy;
      break;
    }
    default: {
      icon = clearDay;
    }
  }

  return icon;
}

export default getWeatherIcon;
