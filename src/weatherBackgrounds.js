import rain from './images/background/rain.jpg';
import day from './images/background/day.jpg';
import cloudy from './images/background/cloudy.jpg';
import fog from './images/background/fog.jpg';
import night from './images/background/night.jpg';
import snow from './images/background/snow.jpg';

function getWeatherBackground(weatherId, isNight) {
  let backgroundImage;

  switch (true) {
    case (weatherId >= 200 && weatherId < 600): {
      backgroundImage = rain;
      break;
    }
    case (weatherId >= 600 && weatherId < 700): {
      backgroundImage = snow;
      break;
    }
    case (weatherId >= 700 && weatherId < 800): {
      backgroundImage = fog;
      break;
    }
    case (weatherId === 800 || weatherId === 801 || weatherId === 802): {
      backgroundImage = isNight ? night : day;
      break;
    }
    case (weatherId === 803 || weatherId === 804): {
      backgroundImage = cloudy;
      break;
    }
    default: {
      backgroundImage = day;
    }
  }

  return backgroundImage;
}

export default getWeatherBackground;
