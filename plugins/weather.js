const { cmd } = require('../command');
const axios = require('axios');

// 🌤️--------WEATHER-PLUGIN (OpenWeatherMap)-------//

cmd({
    pattern: "weather",
    alias: ["wt", "forecast"],
    desc: "Get current weather information",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            // React with ❓ and send example message
            await conn.sendMessage(from, { react: { text: "❓", key: mek.key } });
            return reply("Please provide a location to get the weather forecast. 🌍\nExample: `.weather Colombo`");
        }

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply(`*Fetching weather data for "${q}"... 🌤️*`);

        // Fetch weather data from OpenWeatherMap
        const apiKey = "fdfb4f6ac1e0840c4ca89c28b2ab58f4";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`;
        const res = await axios.get(url);

        if (!res || !res.data) {
            // React with ❌ if data fetch fails
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("Could not retrieve weather data. Please try another location or check the spelling.");
        }

        const data = res.data;
        const weatherInfo = `
🌤️ *Weather Report for ${data.name}, ${data.sys.country}:*

- 🌡️ *Temperature*: ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)
- ☁ *Condition*: ${data.weather[0].description}
- 💨 *Wind*: ${data.wind.speed} m/s
- 🌧️ *Humidity*: ${data.main.humidity}%
- 📊 *Pressure*: ${data.main.pressure} hPa

*Enjoy your day! 🌟*
`;

        // React with ☁ after fetching data
        await conn.sendMessage(from, { react: { text: "☁", key: mek.key } });

        // Send the weather report
        await conn.sendMessage(from, { text: weatherInfo }, { quoted: mek });

        // React with ✅ after sending the report
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error fetching weather data:", e);

        // React with ❌ if an error occurs
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply("An error occurred while fetching the weather. Please try again later.");
    }
});
