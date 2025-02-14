const apiKey = "27a8304287e889942b3391e4c1fd290f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

async function fetchWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    try {
        const response = await fetch(`${apiUrl}&q=${encodeURIComponent(city)}&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none"; // ✅ Fixed class name
        console.error("Error:", error);
    }
}

function displayWeather(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

    const weatherIcon = document.querySelector(".weather-icon");
    let iconPath = "assets/icon/clear.png"; // Default icon

    if (data.weather[0].main === "Clouds") {
        iconPath = "assets/icon/cloudy.png";
    } else if (data.weather[0].main === "Clear") {
        iconPath = "assets/icon/clear.png";
    } else if (data.weather[0].main === "Rain") {
        iconPath = "assets/icon/rainy-day.png";
    } else if (data.weather[0].main === "Drizzle") {
        iconPath = "assets/icon/drizzle.png";
    } else if (data.weather[0].main === "Mist") {
        iconPath = "assets/icon/mist.png";
    }

    weatherIcon.src = iconPath;

    weatherIcon.onerror = function () {
        console.error(`Image not found: ${this.src}`);
        this.src = "assets/icon/.png"; // Fallback
    };

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

// Add event listener for Enter key
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cityInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            fetchWeather();
        }
    });
});

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    const response = await fetch(
                        `${apiUrl}&appid=${apiKey}&lat=${lat}&lon=${lon}` // ✅ Fixed URL
                    );

                    if (!response.ok) throw new Error("Weather data not found");

                    const data = await response.json();
                    displayWeather(data);
                } catch (error) {
                    console.error("Error:", error);
                    alert("Failed to fetch weather for your location");
                }
            },
            (error) => {
                console.error("Geolocation Error:", error);
                alert(`Location access denied. Error: ${error.message}`);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}
