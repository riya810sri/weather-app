const apiKey = "86c890508af54ab991875745252506";

function getWeather() {
  const location = document.getElementById("locationInput").value || "London";

  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`)
    .then(res => res.json())
    .then(data => {
      const weather = data.current;
      const locationData = data.location;

      document.getElementById("cityName").textContent = locationData.name;
      document.getElementById("temperature").textContent = `${weather.temp_c}°C`;
      document.getElementById("feelsLike").textContent = `Feels like: ${weather.feelslike_c}°C`;
      document.getElementById("condition").textContent = weather.condition.text;
      document.getElementById("humidity").textContent = `Humidity: ${weather.humidity}%`;
      document.getElementById("wind").textContent = `Wind: ${weather.wind_kph} km/h`;
      document.getElementById("pressure").textContent = `Pressure: ${weather.pressure_mb} hPa`;
      document.getElementById("uv").textContent = `UV: ${weather.uv}`;

      // ✅ Correct date from locationData.localtime
      const [dateStr] = locationData.localtime.split(" ");
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(dateStr).toLocaleDateString("en-US", options);
      document.getElementById("date").textContent = formattedDate;

      // ✅ Show live clock with correct timezone
      showLiveTime(locationData.tz_id);

      // Static dummy 5-day forecast
      const forecastDiv = document.getElementById("forecastDays");
      forecastDiv.innerHTML = "";
      const temps = [weather.temp_c, weather.temp_c+1, weather.temp_c-1, weather.temp_c+2, weather.temp_c-2];
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      for (let i = 0; i < 5; i++) {
        forecastDiv.innerHTML += `
          <div>
            <p>${temps[i]}°C</p>
            <p>${days[i]}</p>
          </div>`;
      }
    })
    .catch(() => alert("City not found or API error"));
}

// ✅ Show live time using timezone
function showLiveTime(timezone) {
  clearInterval(window.timeInterval); // clear previous interval if any
  window.timeInterval = setInterval(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone
    });
    document.getElementById("time").textContent = formatter.format(now);
  }, 1000);
}

// 🌙 Dark Mode Toggle
document.getElementById("modeToggle").addEventListener("change", function () {
  document.body.classList.toggle("light");
  const heading = document.getElementById("themeHeading");
  if (this.checked) {
    heading.textContent = "☀️ Weather App – Light Mode ";
  } else {
    heading.textContent = "🌙 Weather App – Dark Mode";
  }
});
