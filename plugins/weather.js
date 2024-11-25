const axios = require("axios");

module.exports = {
  name: "weather",
  description: "Get current weather information",
  async function(conn, mek, m, { args, reply }) {
    if (!args.length) {
      reply("Please provide a location. Example: .weather Colombo");
      return;
    }

    const location = args.join(" ");
    const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      const { main, weather, wind, name, sys } = response.data;

      const weatherInfo = `
🌍 *Location*: ${name}, ${sys.country}
🌡️ *Temperature*: ${main.temp}°C
☁️ *Condition*: ${weather[0].description}
💧 *Humidity*: ${main.humidity}%
🌬️ *Wind Speed*: ${wind.speed} m/s
      `;

      reply(weatherInfo);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        reply("Location not found. Please try another location.");
      } else {
        reply("Failed to fetch weather information. Please try again later.");
        console.error("[WEATHER ERROR]", error);
      }
    }
  },
};
