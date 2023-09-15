// API KEY == 02c65d766baa4ef5a16154328231409

const changeDelay = 330;

const goButton = document.querySelector("#go_button");
const searchBar = document.querySelector("#search_querry");
const dayPanelCenterer = document.querySelector("#day_panel_centerer");
const graphContainer = document.querySelector("#graph_container");
const graphSVG = document.querySelector("#graph_svg");
const graphPath = document.querySelector("#graph_path");

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
  setTimeout(() => {
    updateGraph(data);
  }, changeDelay * 3);
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

    avgTempLabel.textContent = dayData.day.avgtemp_f.toString() + "F\u00B0";
    conditionIcon.setAttribute("src", dayData.day.condition.icon);
    conditionLabel.textContent = dayData.day.condition.text;
    container.classList.remove("hidden"); //THIS WILL CHANGE
  }

  return { container, updateDayPanel };
};

function updateGraph(data) {
  const GRAPH_HEIGHT = 300;
  const GRAPH_WIDTH = 500;
  const TEMP_LOW_SCALE = 32;
  const TEMP_HIGH_SCALE = 100;

  let currentHour = data.current.last_updated;
  //the last_updated string has the format "##/##/#### HR:MN".
  //we take the split after the " " and before the ":" to get the hour.
  currentHour = parseInt(currentHour.split(" ")[1].split(":")[0]);
  let remainingDayOneHours = 23 - currentHour;
  let graphPointCount = remainingDayOneHours + 24 * 2;
  let graphRightwardMarch = GRAPH_WIDTH / (graphPointCount - 1);

  //get all of the day data lined up.
  let tempByHour = [];
  for (let i = currentHour; i < 3 * 24; i++) {
    let fcdIdx = Math.floor(i / 24.0);
    let hrIdx = i % 24;
    tempByHour.push(data.forecast.forecastday[fcdIdx].hour[hrIdx].temp_f);
  }
  let minScale = Math.min(TEMP_LOW_SCALE, Math.min(...tempByHour));
  let maxScale = Math.max(TEMP_HIGH_SCALE, Math.max(...tempByHour));
  let degToYAxis = (deg) => {
    return (
      GRAPH_HEIGHT - ((deg - minScale) * GRAPH_HEIGHT) / (maxScale - minScale)
    );
  };
  let graphDStr = "M-5 " + degToYAxis(tempByHour[0]);
  for (let i = 0; i < graphPointCount; i++) {
    let x = (graphRightwardMarch * i).toString();
    let y = degToYAxis(tempByHour[i]).toString();
    graphDStr += "L" + x + " " + y;
  }

  //box up the bottom of the graph.
  let finalX = (graphRightwardMarch * graphPointCount).toString() + " ";
  let finalY = (GRAPH_HEIGHT + 5).toString();
  graphDStr += "L" + finalX;
  graphDStr += degToYAxis(tempByHour[graphPointCount - 1]).toString();
  graphDStr += "L" + finalX;
  graphDStr += finalY + "L-5 " + finalY + "z";

  graphPath.setAttribute("d", graphDStr);

  graphContainer.classList.remove("hidden");
}

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
