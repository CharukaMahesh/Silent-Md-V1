const { cmd } = require('../command');
const axios = require('axios');

// 🌤️--------WEATHER-PLUGIN-------//

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
            return reply("Please provide a location to get the weather forecast. 🌍\nExample: `.weather Colombo`");
        }

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply(`*Fetching weather data for "${q}"... 🌤️*`);

        // Fetch weather data
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(q)}?format=%l:+%C+%t\n🌡️:+%f+%w\n🌧️:+%p`);
        if (!res || !res.data) {
            return reply("Could not retrieve weather data. Please try another location or check the spelling.");
        }

        // Reply with weather information
        reply(`*Weather Report for ${q}:*\n\n${res.data}`);

    } catch (e) {
        console.error("Error fetching weather data:", e);
        reply("An error occurred while fetching the weather. Please try again later.");
    }
});
