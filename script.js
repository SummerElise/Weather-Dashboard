let cityFormEl = document.getElementById("city-form")
let searchInputEl = document.getElementById("search-city")
let weatherContainerEl = document.getElementById("todayWeatherContainer")
let cityHistoryEl = document.getElementById("searchInput")
let forecastEl = document.getElementById("forecast")
let fiveDayContainerEl = document.getElementById("fiveDay-container")
let searchHistoryButtonEl = document.getElementById("search-history-button")

const cities = [];


let formSubmitHandler = function(event){
    event.preventDefault();
    let city = searchInputEl.value.trim();
    if(city){
        getCurrentWeather(city);
        get5Day();
        cities.unshift({city});
        searchInputEl.value = "";
    }  
    saveSearch();
    searchHistory(city);
 }

let saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};


let getCurrentWeather = function(city){
    const currentAPI = 'https://api.openweathermap.org/data/2.5/weather?q=Raleigh,US&appid=555a662aebacc0eabe7f6ef8fca6d35d';

    fetch(currentAPI)
    .then(function(response){
        response.json().then(function(data){
            displayCurrentWeather(data, city);
        });
    });
};

let displayCurrentWeather = function(weather, searchCity){
   
   weatherContainerEl.textContent= "";  
   searchInputEl.textContent=searchCity;


let currentDate = document.createElement("span")
currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
searchInputEl.appendChild(currentDate);

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
weatherImg.setAttribute("src", 'https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png');
searchInputEl.appendChild(weatherImg)

weatherContainer.appendChild(temperatureEl);
weatherContainer.appendChild(windSpeedEl);
weatherContainer.appendChild(humidityEl);

let lat = weather.coord.lat;
let lon = weather.coord.lon;
getUvIndex(lat,lon)


let getUvIndex = function(_lat, _lon){
    const uvAPI ='http://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=555a662aebacc0eabe7f6ef8fca6d35d';
    fetch(uvAPI)
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

    if(index.value <=2){
        uvIndexValue.classList = "low"
    }else if(index.value >2 && index.value<=6){
        uvIndexValue.classList = "medium"
    }else if(index.value >6){
        uvIndexValue.classList = "high"
    };

    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);
}

  let get5Day= function(){       
    const fiveDayAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=Raleigh,US&appid=555a662aebacc0eabe7f6ef8fca6d35d';

    fetch(fiveDayAPI)
    .then(function(response){
        response.json().then(function(data){
            display5Day(data[1]);
        });
    });
};

let display5Day = function(weather){
    fiveDayContainerEl.textContent = ""
    forecastEl.textContent = "5-Day Forecast: ";

    let forecast = weather.list;
    for(let i=5; i < forecast.length; i=i+8){
        let dailyForecast = forecast[i];

    let forecastEl=document.createElement('div');
    forecastEl.classList = "card bg-primary text-light m-2";


    let forecastDate = document.createElement("h5")
    forecastDate.textContent=moment.unix(dailyForecast.dt).format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center"
    fiveDayContainerEl.appendChild(forecastDate);
    
    let weatherImg = document.createElement("img")
    weatherImg.setAttribute("src", "https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png");
    weatherImg.classList = "card-body text-center";

    forecastEl.appendChild(weatherImg);

    let forecastTemperatureEl = document.createElement("span");
    forecastTemperatureEl.textContent = dailyForecast.main.temp + " F";
    forecastTemperatureEl.classList = "card-body text-center";

    forecastEl.appendChild(forecastTemperatureEl);

    let forecastHumidityEl=document.createElement("span");
    forecastHumidityEl.textContent = dailyForecast.main.humidity + " %";
    forecastHumidityEl.classList = "card-body text-center";

    forecastEl.appendChild(forecastHumidityEl);

    fiveDayContainerEl.appendChild(forecastEl);
    }
}


let searchHistoryButtonEl = function(searchHistory){

    searchHistoryEl = document.createElement("button");
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.classList = "d-flex w-100 btn-light border p-2";
    searchHistoryEl.setAttribute("data-city", searchHistory)
    searchHistoryEl.setAttribute("type", "submit");

    searchHistoryButtonEl.prepend(searchHistoryButtonEl);
}

let searchHistoryHandler = function(event) {
    let city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        get5day(city);
    }
}
}

cityFormEl.addEventListener("submit", formSubmitHandler);