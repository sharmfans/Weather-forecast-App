const API_KEY = "e5b5226e6bb84ebfd5a6782489e623fc ";

document.getElementById('weather-form').addEventListener('submit', async function(e){
    e.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        showError('Please enter a city or town name.');
        return;
    }
    showLoading();

    try {
        const current = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
        const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);

        const currentData = await current.json();
        const forecastData = await forecast.json();

        if (currentData.cod !== 200) {
            if (currentData.cod === "401") {
                showError('Invalid API key. Please check your API key and update app.js.');
            } else if (currentData.cod === "404") {
                showError('City or town not found. Please check your spelling and try again.');
            } else {
                showError(`Error: ${currentData.message}`);
            }
            return;
        }

        renderWeather(currentData, forecastData);
    } catch (err) {
        showError('Failed to fetch weather data. Please check your internet connection or try again later.');
    }
});

function showLoading() {
    document.getElementById("weather-result").innerHTML = '<p>Loading...</p>';
}

function showError(msg) {
    document.getElementById("weather-result").innerHTML = `<p class="error" style="color:red;">${msg}</p>`;
}

function renderWeather(current, forecast) {
    let html = `
        <h2>${current.name}, ${current.sys.country}</h2>
        <p><strong>Current:</strong> ${current.weather[0].description}, ${current.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${current.main.humidity}%</p>
        <p><strong>Wind:</strong> ${current.wind.speed} m/s</p>
        <h3>Forecast:</h3>
        <ul>
    `;

    // Show next 5 forecasts
    let nextForecasts = forecast.list.slice(0, 5);
    for (let f of nextForecasts) {
        html += `
            <li>
                <strong>${(new Date(f.dt*1000)).toLocaleString()}</strong>:
                ${f.weather[0].description}, ${f.main.temp}°C
            </li>
        `;
    }
    html += "</ul>";
    document.getElementById("weather-result").innerHTML = html;
}
