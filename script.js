const cities = [];

const cityFormEl = document.getElementById("city-form");
const searchInputEl = document.getElementById("search-city");
const weatherContainerEl = document.getElementById("todayWeatherContainer");
const cityHistoryEl = document.getElementById("searchHistory");
const forecastEl = document.getElementById("forecast");
const fiveDayContainerEl = document.getElementById("fiveDay-container");
const historyButtonsEl = document.getElementById("search-history-buttons");

let formSubmitHandler = function(event){
    event.preventDefault();
    let city = searchInputEl.value.trim();
    if(city){
        getCityWeather(city);
        getfiveDay(city);
        cities.unshift({city});
        searchInputEl.value = "";
    }
    saveSearch();
    searchHistory(city);
    }
 

  
let saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};


let getCityWeather = function(city){
    var apiKey = "555a662aebacc0eabe7f6ef8fca6d35d"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q={city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

let displayWeather = function(weather, searchCity){
   
   weatherContainerEl.textContent= "";  
   cityHistoryEl.textContent=searchCity;


let currentDate = document.createElement("span")
currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
cityHistoryEl.appendChild(currentDate);

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
cityHistoryEl.appendChild(weatherImg)

weatherContainer.appendChild(temperatureEl);
weatherContainer.appendChild(windSpeedEl);
weatherContainer.appendChild(humidityEl);

let lat = weather.coord.lat;
let lon = weather.coord.lon;
getUvIndex(lat,lon)


let getUvIndex = function(lat, lon){
    let apiKey = "555a662aebacc0eabe7f6ef8fca6d35d"
    let apiURL ="https://api.openweathermap.org/data/2.5/uvi?appid={555a662aebacc0eabe7f6ef8fca6d35d}&lat=${lat}&lon=${lon}"
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}

let displayUvIndex = function(index){
    let uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value
}

let historyButtonsEl = function(searchHistory){
    historyButtonsEl = document.createElement("button");
    historyButtonsEl.textContent = searchHistory;
    historyButtonsEl.classList = "d-flex w-100 btn-dark border p-2";
    historyButtonsEl.setAttribute("data-city", searchHistory)
    historyButtonsEl.setAttribute("type", "submit");

    historyButtonsEl.prepend(searchHistoryEl);
}

let searchHistoryHandler = function(event) {
    let city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        get5day(city);
    }
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", historyButtonsHandler);