const apiKey = "27a8304287e889942b3391e4c1fd290f"; // Replace with your weather API key

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data); // Check what response you are getting

        if (data.cod === 200) {
            displayWeather(data);
        } else {
            document.getElementById("weatherResult").innerHTML = `Error: ${data.message}`;
        }
    } catch (error) {
        console.log("Fetch Error:", error);
        document.getElementById("weatherResult").innerHTML = "Error fetching data!";
    }
}
function displayWeather(data) {
    const { name, main, weather } = data;
    document.getElementById("weatherResult").innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp}°C</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}

function getWeather() {
    const location = document.getElementById("locationInput").value;
    if (location) {
        fetchWeather(location);
    } else {
        document.getElementById("weatherResult").innerHTML = "Please enter a city name!";
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    displayWeather(data);
                } catch (error) {
                    document.getElementById("weatherResult").innerHTML = "Error fetching data!";
                }
            },
            () => {
                document.getElementById("weatherResult").innerHTML = "Location access denied!";
            }
        );
    } else {
        document.getElementById("weatherResult").innerHTML = "Geolocation not supported!";
    }
}
