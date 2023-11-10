export default async function (location) {
  function wintdeg(deg) {
    let arr = [0, 45, 90, 135, 180, 225, 270, 315];
    return arr[Math.round(((deg + 180) % 360) / 45)];
  }
  try {
    const { data } = await useFetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location[1]}&lon=${location[0]}&appid=704e6c6ad29a17b1a787bd035c725346&units=metric`
    );

    // Update the infoAirballon object properties

    return {
      temp: data.value.main.temp,
      humidity: data.value.main.humidity,
      speed: data.value.wind.speed * 3.6,
      wind: wintdeg(data.value.wind.deg),
      rain: data.value.rain,
    };
  } catch (error) {
    console.log(error);
    return {};
  }
}
