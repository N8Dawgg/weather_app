// API KEY == 02c65d766baa4ef5a16154328231409

const changeDelay = 330;

const goButton = document.querySelector("#go_button");
const searchBar = document.querySelector("#search_querry");
const dayPanelCenterer = document.querySelector("#day_panel_centerer");

let dayPanels = [];

function init() {
  dayPanels = [createDayPanel(), createDayPanel(), createDayPanel()];
  dayPanelCenterer.append(dayPanels[0].container);
  dayPanelCenterer.append(dayPanels[1].container);
  dayPanelCenterer.append(dayPanels[2].container);
}

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
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      dayPanels[i].updateDayPanel(data.forecast.forecastday[i]);
    }, i * changeDelay);
  }
}

const createDayPanel = () => {
  let container = document.createElement("div");
  container.classList.add("day_panel");
  container.classList.add("hidden");

  let dateLabel = document.createElement("div");
  dateLabel.classList.add("date_label");
  container.append(dateLabel);

  let weekDayLable = document.createElement("div");
  weekDayLable.classList.add("week_day_label");
  container.append(weekDayLable);

  let curTempLabel = document.createElement("div");
  curTempLabel.classList.add("cur_temp_label");
  container.append(curTempLabel);

  let avgTempLabel = document.createElement("div");
  avgTempLabel.classList.add("avg_temp_label");
  container.append(avgTempLabel);

  let conditionIcon = document.createElement("img");
  conditionIcon.classList.add("condition_icon");
  container.append(conditionIcon);

  let conditionLabel = document.createElement("div");
  conditionLabel.classList.add("condition_label");
  container.append(conditionLabel);

  function updateDayPanel(dayData, currentTime = -1) {
    //dayDate = data.forecast.forecastday[#]
    dateLabel.textContent = dayData.date;
    weekDayLable.textContent = "Today";
    //curTempLabel...
    avgTempLabel.textContent = dayData.day.avgtemp_f.toString() + "F\u00B0";
    conditionIcon.setAttribute("src", dayData.day.condition.icon);
    conditionLabel.textContent = dayData.day.condition.text;
    container.classList.remove("hidden"); //THIS WILL CHANGE
  }

  return { container, updateDayPanel };
};

init();

/*
data.current...
  condition...
    icon
    text
  temp_c
  temp_f
  last_updated (DATE STRING and current time)

data.forecast.forecastday[0]...
  astro...
    moon_phase
  date
  day...
    avgtemp_c
    avgtemp_f
    condition...
      code
      icon
      text

*/
