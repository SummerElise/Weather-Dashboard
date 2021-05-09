let cities = [];


let cityFormEl = document.querySelector("#city-form");
let searchInputEl = document.querySelector("#search-City");
let weatherContainerEl = document.querySelector("#todays-weather-Container");
let cityHistoryEl = document.querySelector("#searched-Input");
let forecastHeader = document.querySelector("#forecast");
let fiveDayContainerEl = document.querySelector("#fiveDay-container");
let searchHistoryButtonEl = document.querySelector("#search-history-buttons");

let formSubmitHandler = function(event){
    event.preventDefault();
    let city = searchInputEl.value.trim();
    if(city){
        getCityWeather(city);              
        cities.unshift({city});
        searchInputEl.value = "";
    } else{
        alert("Error. City name must be entered.");
    }
    saveSearch();
    searchHistory(city);
    //working
    console.log(searchHistory);
}


let saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
    //working
    console.log(saveSearch);
};


let getCityWeather = function(city){
    let currentWeather = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=555a662aebacc0eabe7f6ef8fca6d35d'
    console.log(currentWeather);
    fetch(currentWeather)
    .then(function(response){
       return response.json();
    })
        .then(function(data){
        displayWeather(data, city);        
        });
    }


let displayWeather = function(weather, searchCity) {

    weatherContainerEl.textContent="";
    searchInputEl.textContent=searchCity;
   
 let currentDate = document.createElement("span")
currentDate.textContent=" (" + moment(weather.value).format("MMM Do, YYYY") + ") ";
searchInputEl.appendChild(currentDate);

let temperatureEl = document.createElement("span");
temperatureEl.textContent = "Temperature: " + weather.main.temperature + " F";
temperatureEl.classList= "list-group-item"

let windSpeedEl = document.createElement("span");
windSpeedEl.textContent = "Wind Speed: " + weather.wind.Speed + " mph";
windSpeedEl.classList = "list-group-item"

let humidityEl = document.createElement("span");
humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
humidityEl.classList = "list-group-item"

let weatherImg = document.createElement("img")

searchInputEl.appendChild(weatherImg)

weatherContainerEl.appendChild(temperatureEl);
weatherContainerEl.appendChild(windSpeedEl);
weatherContainerEl.appendChild(humidityEl);

let lat = weather.coord.lat;
let lon = weather.coord.lon;
getUvIndex(lat,lon)
}

let getUvIndex = function(lat,lon){
    const onecallAPI ='https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=hourly,daily,minutely&appid=555a662aebacc0eabe7f6ef8fca6d35d'
    fetch(onecallAPI)
    .then(function(response) {
        response.json()
        .then(function(data){
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

  let getfiveDay= function(){       
    const fiveDays = 'http://api.openweathermap.org/data/2.5/onecall?lat=35.787743&lon=-78.644257&&units=imperial&exclude=current,minutely,hourlyappid=555a662aebacc0eabe7f6ef8fca6d35d'

    fetch(fiveDays)
    .then(function(response){
        response.json().then(function(data){
            displayfiveDay(data[1]);
        });
    });
};

let displayfiveDay = function(weather){
    fiveDayContainerEl.textContent = ""
    forecastHeader.textContent = "5-Day Forecast: ";

    let forecast = weather.list;
    for(var i=5; i < forecast.length; i=i+8){
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

let searchHistory = function(searchHistory){

    console.log(searchHistory);

    searchHistoryEl = document.createElement("button");
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.classList = "d-flex w-100 btn-light border p-2";
    searchHistoryEl.setAttribute("data-city",searchHistory)
    searchHistoryEl.setAttribute("type", "submit");

    searchHistoryButtonEl.prepend(searchHistoryEl);
}

let searchHistoryHandler = function(event) {
    let city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        getfiveDay(city);
    }
}
//searchHistory();
cityFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryButtonEl.addEventListener("click", searchHistoryHandler);