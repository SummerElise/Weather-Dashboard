let getCityWeather = function(city){
    let apiKey = "6f3f80712db2eea1ca8383e7b1615f82"
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}"

    fetch (apiURL)
    .then(function(response) {
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

let cities = [];

const searchInputEl = document.getElementById("search-city");
const weatherContainer = document.getElementById("todayWeatherContainer");
const cityHistory = document.getElementById("searchHistory");
const forecast = document.getElementById("forecast");
const fiveDayContainer = document.getElementById("fiveDay-container");
const historyButtons = document.getElementById("search-history-buttons");

const formSubmitHandler = function(event){
    event.preventDefault();
    let city = searchInputEl.nodeValue.trim();
    if(city){
        getCityWeather(city);
        get5day(city);
        cities.unshift({city});
        searchInputEl.value = "";
    }
    saveSearch();
    searchHistory(city);
    }
 

let saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

let displayWeather = function(weather, searchCity) {
weatherContainer.textContent="";
cityHistory.textContent=searchCity;

console.log(weather);

let currentDate = document.createElement("span")
currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
cityHistory.appendChild(currentDate);

let temperatureEl = document.createElement("span");
temperatureEl.textContent = "Temperature: " + weather.main.temp + " F";
temperatureEl.classList = "list-group-item"

let windSpeedEl = document.createElement("span");
windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " mph";
windSpeedEl.classList = "list-group-item"

let humidityEl = document.createElement("span");
humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
humidityEl.classList = "list-group-item"

let weatherImg = document.createElement("img")
weatherImg.setAttribute("src", "https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png");
cityHistory.appendChild(weatherImg)

weatherContainer.appendChild(temperatureEl);
weatherContainer.appendChild(windSpeedEl);
weatherContainer.appendChild(humidityEl);

let lat = weather.coord.lat;
let lon = weather.coord.lon;
getUvIndex(lat,lon)
}
