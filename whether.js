const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherResult = document.getElementById("weatherResult");

getWeatherBtn.addEventListener("click", getWeather);

async function getWeather() {
  const city = cityInput.value.trim();
  weatherResult.innerHTML = "";

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    if (!geoResponse.ok) {
      throw new Error("Failed to fetch city data.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError("City not found.");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data.");
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      showError("Weather information unavailable.");
      return;
    }

    const { temperature, windspeed } = weatherData.current_weather;

    weatherResult.innerHTML = `
      <div class="weather-card">
        <h2>${name}, ${country}</h2>
        <p>🌡 <strong>Temperature:</strong> ${temperature} °C</p>
        <p>🌬 <strong>Windspeed:</strong> ${windspeed} km/h</p>
      </div>
    `;
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  weatherResult.innerHTML = `<p class="error">${message}</p>`;
}
