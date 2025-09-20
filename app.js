// Selecting all required elements

let locationInp = document.getElementById("locationInp");
let searchBtn = document.getElementById("searchBtn");
let weatherImg = document.querySelector(".weather img");

let weatherInfo = document.querySelector(".weather-Info");
let tempEl = document.getElementById("temperature");
let changeTempBtn = document.getElementById("changeTempBtn");
let cityName = document.getElementById("location");
let description = document.getElementById("description");

let humidity = document.querySelector(".humidity");
let windSpeed = document.querySelector(".wind-Speed");

let errorMsgEl = document.querySelector(".error-msg");

let currentUnit = "°C"; // Default unit is Celsius
let isLoading = false;
let latestWeatherData = null; // To store the latest fetched weather data

let apiKey = "401229e72a474fe9acc122302251709";


function updateWeatherUI(data) {
    // If api response is not valid then return
    if (!data || !data.current || !data.location) return;

    // Update weather icon
    weatherImg.src = data.current.condition.icon.startsWith('//') ? 'https:' + data.current.condition.icon : data.current.condition.icon;
    weatherImg.alt = data.current.condition.text || "weather-icon";

    // Update temperature based on the current unit
    tempEl.innerText = currentUnit === "°C" ? `${Math.round(data.current.temp_c)} °C` : `${Math.round(data.current.temp_f)} °F`;

    cityName.innerText = `${data.location.name}, ${data.location.country}`;

    description.innerText = data.current.condition.text;

    humidity.innerText = `${data.current.humidity} %`;

    windSpeed.innerText = currentUnit === "°C" ? `${data.current.wind_kph} km/h` : `${data.current.wind_mph} mph`;
}

async function handleSearch() {
    let userInput = locationInp.value.trim();
    if (!userInput) return;

    isLoading = true;
    searchBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    searchBtn.disabled = true;
    locationInp.disabled = true;

    // Small delay to ensure loading spinner is visible
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch weather data
    let weatherData = await fetchWeatherData(userInput);

    isLoading = false;
    searchBtn.innerHTML = `<i class="fas fa-search"></i>`;
    searchBtn.disabled = false;
    locationInp.disabled = false;

    if (weatherData) {
        latestWeatherData = weatherData; // Store the latest fetched data
        updateWeatherUI(weatherData);
        weatherInfo.style.display = "block"; // Show weather info
    } else {
        errorMsgEl.innerText = "Could not fetch weather data. Please try again.";
        errorMsgEl.style.display = "block"; // Show error message
        weatherInfo.style.display = "none"; // Hide weather info

        setTimeout(() => {
            errorMsgEl.style.display = "none"; // Hide error message after 2 seconds
        }, 2000);
    }
    locationInp.value = "";
}

async function fetchWeatherData(userInput) {
    let weatherApi = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(userInput)}`;

    try {
        let response = await fetch(weatherApi);
        if (!response.ok) throw new Error("Network response was not ok");

        let data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Error fetching weather data:", error);
        return null;
    }
}

// Event listener for search button
searchBtn.addEventListener("click", handleSearch);

// Event listener for Enter key in input field
locationInp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// Event listener for changing temperature unit
changeTempBtn.addEventListener("click", () => {
    if (currentUnit === "°C") {
        currentUnit = "°F";
        changeTempBtn.innerText = "To °C";
    } else {
        currentUnit = "°C";
        changeTempBtn.innerText = "To °F";
    }

    // Update the temperature display after changing unit
    // Use the latest fetched data to update the UI
    if (latestWeatherData) {
        updateWeatherUI(latestWeatherData);
    }
});