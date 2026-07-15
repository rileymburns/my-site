document.addEventListener("DOMContentLoaded", () => {
  const year = new Date().getFullYear();
  const footer = document.querySelector("footer");

  if (footer) {
    footer.textContent = `© ${year} Riley — Photography`;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      document.documentElement.style.scrollBehavior = "smooth";
    });
  });

  const weatherIcon = document.getElementById("weather-icon");
  const weatherTemp = document.getElementById("weather-temp");
  const weatherCondition = document.getElementById("weather-condition");
  const weatherStatus = document.getElementById("weather-status");

  const mapWeatherCode = (code) => {
    const weatherMap = {
      0: { icon: "☀️", label: "Clear sky" },
      1: { icon: "🌤️", label: "Mainly clear" },
      2: { icon: "⛅", label: "Partly cloudy" },
      3: { icon: "☁️", label: "Overcast" },
      45: { icon: "🌫️", label: "Fog" },
      48: { icon: "🌫️", label: "Rime fog" },
      51: { icon: "🌦️", label: "Light drizzle" },
      53: { icon: "🌦️", label: "Drizzle" },
      55: { icon: "🌧️", label: "Dense drizzle" },
      61: { icon: "🌧️", label: "Light rain" },
      63: { icon: "🌧️", label: "Rain" },
      65: { icon: "🌧️", label: "Heavy rain" },
      71: { icon: "❄️", label: "Light snow" },
      73: { icon: "❄️", label: "Snow" },
      75: { icon: "❄️", label: "Heavy snow" },
      80: { icon: "🌦️", label: "Showers" },
      81: { icon: "🌧️", label: "Heavy showers" },
      82: { icon: "🌧️", label: "Violent showers" },
      85: { icon: "❄️", label: "Snow showers" },
      86: { icon: "❄️", label: "Heavy snow showers" },
      95: { icon: "⛈️", label: "Thunderstorm" },
      96: { icon: "⛈️", label: "Thunderstorm with hail" },
      99: { icon: "⛈️", label: "Severe thunderstorm" },
    };

    return weatherMap[code] || { icon: "🌤️", label: "Weather update" };
  };

  const setWeatherState = (icon, label, status) => {
    if (weatherIcon) weatherIcon.textContent = icon;
    if (weatherTemp) weatherTemp.textContent = "--°F";
    if (weatherCondition) weatherCondition.textContent = label;
    if (weatherStatus) weatherStatus.textContent = status;
  };

  if (!navigator.geolocation) {
    setWeatherState("🌤️", "Location unavailable", "Your browser does not support live location weather.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = await response.json();
        const current = data.current;
        const { icon, label } = mapWeatherCode(current.weather_code);
        const temp = Math.round(current.temperature_2m);

        if (weatherIcon) weatherIcon.textContent = icon;
        if (weatherTemp) weatherTemp.textContent = `${temp}°F`;
        if (weatherCondition) weatherCondition.textContent = label;
        if (weatherStatus) weatherStatus.textContent = "Live conditions based on your current location.";
      } catch (error) {
        setWeatherState("🌤️", "Weather unavailable", "Live weather could not be loaded right now.");
      }
    },
    () => {
      setWeatherState("🌤️", "Enable location", "Enable location to see your weather.");
    }
  );
});
