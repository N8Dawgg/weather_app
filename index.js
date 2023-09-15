// API KEY == 02c65d766baa4ef5a16154328231409

const goButton = document.querySelector("#go_button");
const searchBar = document.querySelector("#search_querry");

function querryWeatherAPI() {
  let querry = searchBar.value;
  let fullAPIString =
    "http://api.weatherapi.com/v1/forecast.json?key=02c65d766baa4ef5a16154328231409&days=3&q=" +
    querry;
  fetch(fullAPIString).then((response) => {
    response.json().then((output) => {
      console.log(output);
      parseData(output);
    });
  });
}

goButton.addEventListener("click", querryWeatherAPI);

function parseData(data) {
  let forecastData = data.forecast.corecastday;
  let testDiv = document.createElement("div");
  testDiv.textContent = forecastData;
  document.body.append(testDiv);
}
