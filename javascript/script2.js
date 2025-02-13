const apiKey = "27a8304287e889942b3391e4c1fd290f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

async function fetchWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    try {
        const response = await fetch(`${apiUrl}&q=${encodeURIComponent(city)}&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".Weather").style.display = "none";
        console.error('Error:', error);
    }
}

function displayWeather(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

    const weatherIcon = document.querySelector(".weather-icon");
    const temp = data.main.temp;  // Get temperature

    let iconPath = "assets/icon/default.png";  // Default icon

    // Set different icons based on temperature
    if (temp <= 0) {
        iconPath = "assest/icon/cold.png"; // Cold
    } else if (temp > 0 && temp <= 15) {
        iconPath = "assets/icon/chilly.png"; // Chilly weather
    } else if (temp > 15 && temp <= 25) {
        iconPath = "assets/icon/clouds.png"; // Mild temperature
    } else if (temp > 25 && temp <= 35) {
        iconPath = "assets/icon/clear.png"; // Warm weather
    } else {
        iconPath = "assets/icon/hot.png"; // Hot weather
    }

    // Ensure image loads properly
    weatherIcon.src = iconPath;
    weatherIcon.onerror = function() {
        console.error(`Image not found: ${iconPath}`);
        weatherIcon.src = "assets/icon/default.png"; // Fallback
    };

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}


// Add event listener for Enter key
document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeather();
    }
});

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Correct API URL construction
                    const response = await fetch(
                        `${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`
                    );
                    
                    if (!response.ok) throw new Error('Weather data not found');
                    
                    const data = await response.json();
                    displayWeather(data);
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to fetch weather for your location');
                }
            },
            (error) => {
                // Enhanced error handling
                console.error('Geolocation Error:', error);
                alert(`Location access denied. Error: ${error.message}`);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}