// Date
function updateDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let listDays = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[listDays];

  return `${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let currentDate = document.querySelector("#date");
let currentTime = new Date();
currentDate.innerHTML = updateDate(currentTime);

// Forecast Preview
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
        <div class="forecast-preview">
          <div class="forecast-time">${formatDay(forecastDay.dt)}</div>
            <img
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt=""
              width="36"
            >
          <div class="preview-temperature">
            <span class="preview-temperature-min">${Math.round(
              forecastDay.temp.min
            )}°</span>
            <span class="preview-temperature-max">${Math.round(
              forecastDay.temp.max
            )}°</span>
          </div>
        </div>
      </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Search Functionality
function getForecast(coordinates) {
  let apiKey = "1249c7a87e8430d0f8a521161ee4206a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#current-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#current-wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#current-description").innerHTML =
    response.data.weather[0].main;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "1249c7a87e8430d0f8a521161ee4206a";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city").value;
  search(city);
}

let searchFunction = document.querySelector("#search-form");
searchFunction.addEventListener("submit", searchCity);

// Current Location
function searchCurrentLocation(position) {
  let apiKey = "1249c7a87e8430d0f8a521161ee4206a";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}
// Temperature Conversion
function convertF(event) {
  event.preventDefault();
  let temperatureConversion = document.querySelector("#temperature");
  temperatureConversion.innerHTML = 48;
}

function convertC(event) {
  event.preventDefault();
  let temperatureConversion = document.querySelector("#temperature");
  temperatureConversion.innerHTML = 9;
}

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertF);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertC);

let currentLocationButton = document.querySelector("#btn-current");
currentLocationButton.addEventListener("click", getCurrentLocation);

search("London");
