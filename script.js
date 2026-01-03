let input = document.querySelector('.input');
let button = document.querySelector('button');
let weatherIcon = document.querySelector(".sky");

let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=brussels';
const apiKey = '34d088fc115311a2878c7176704d5f9a';


async function checkWeather() {
    const response = await fetch(apiUrl + `&appid=${apiKey}`);
    
    const data = await response.json();
      if (!response.ok) {
    document.querySelector('.city').innerHTML =
      "Ce pays ou cette ville n'existe pas";
      document.querySelector('.city').style.width = '500px';
      document.querySelector('.city').style.lineHeight = '60px';
      document.querySelector('.app').style.height = '300px';
    input.value = '';
    document.querySelector(".sky-weather").style.display = 'none';
    document.querySelector(".temp").style.display = 'none';
    
    document.querySelector(".perturbation").style.display = 'none';
    return;
  }
    document.querySelector('.app').style.height = '700px';
    document.querySelector(".sky-weather").style.display = 'block';
    document.querySelector(".temp").style.display = 'flex';
    document.querySelector(".perturbation").style.display = 'flex';
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.humidityTaux').innerHTML = data.main.humidity + ' %';
    document.querySelector('.windTaux').innerHTML = Math.round(data.wind.speed) + ' km/h';
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp)  + ' °C';

    const countryCode = data.sys.country ;
    const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryName = regionName.of(countryCode);

    document.querySelector('.country').innerHTML = countryName;
    input.value = '';
   
    

    if(data.weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png"
    }
    else if(data.weather[0].main == "Clear") {
        weatherIcon.src = "images/clear.png"
    }
    else if(data.weather[0].main == "Rain") {
        weatherIcon.src = "images/rain.png"
    }
    else if(data.weather[0].main == "Drizzle") {
        weatherIcon.src = "images/drizzle.png"
    }
    else if(data.weather[0].main == "Mist") {
        weatherIcon.src = "images/mist.png"
    }
    else if(data.weather[0].main == "Snow") {
        weatherIcon.src = "images/snow.png"
    };

    
}
checkWeather();

button.addEventListener("click", function(){
let inputResult = input.value;
apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric' + `&q=${inputResult}`;
checkWeather();

})


const MAPBOX_PUBLIC_TOKEN = "pk.eyJ1Ijoid2lza2UiLCJhIjoiY21qd3A2N3R5MncxdTNmc2Q2bm9ubTg3MiJ9.Fgd-bpB9lPpFCUyt25bc-A"; // <-- TON TOKEN PUBLIC


const suggestions = document.getElementById("suggestions");

let debounceTimeout;


input.addEventListener("input", () => {
  const query = input.value.trim();

  clearTimeout(debounceTimeout);

  if (query.length < 2) {
    suggestions.innerHTML = "";
    return;
  }

  debounceTimeout = setTimeout(() => {
    fetchCities(query);
  }, 200);
});

async function fetchCities(query) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?types=place&access_token=${MAPBOX_PUBLIC_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();
     console.log(data)

    suggestions.innerHTML = "";

    data.features.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city.place_name;

      li.addEventListener("click", () => {
        input.value = city.place_name;
        suggestions.innerHTML = "";
       
  
      });

      suggestions.appendChild(li);
    });

  } catch (error) {
    console.error("Erreur Mapbox :", error);
  }
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    suggestions.innerHTML = "";
  }
});
