const apikey = "27a8304287e889942b3391e4c1fd290f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".Weather");
const errorDiv = document.querySelector(".error");

async function checkWeather(city) {
    if (!city) {
        errorDiv.style.display = "block";
        errorDiv.textContent = "Please enter a city name.";
        weatherDiv.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apikey}`);

        if (!response.ok) {
            throw new Error("Invalid City Name");
        }

        const data = await response.json();

        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " km/h";

        const weatherCondition = data.weather[0].main.toLowerCase();
        const iconMap = {
            clouds: "",
            clear: "http://localhost:8000/images/clear.png",
            rain: "http://localhost:8000/images/rain.png",
            drizzle: "http://localhost:8000/images/drizzle.png",
            mist: "http://localhost:8000/images/mist.png"
        };
        
        // Assigning the image src directly
        weatherIcon.src = iconMap[weatherCondition] || "file:///C:/Users/YourUsername/Desktop/WeatherApp/images/default.png";
        
        weatherIcon.style.display = "block";

        weatherDiv.style.display = "block";
        errorDiv.style.display = "none";

    } catch (error) {
        errorDiv.style.display = "block";
        errorDiv.textContent = error.message;
        weatherDiv.style.display = "none";
    }
}

// Event Listeners for button click and "Enter" key
searchBtn.addEventListener("click", () => checkWeather(searchBox.value.trim()));
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") checkWeather(searchBox.value.trim());
});

// Hide weather and error messages initially
document.addEventListener("DOMContentLoaded", () => {
    weatherDiv.style.display = "none";
    errorDiv.style.display = "none";
});
