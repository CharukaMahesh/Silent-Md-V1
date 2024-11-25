const { cmd } = require('../command');
const axios = require('axios');

// 🤝--------PAIR-CODE-PLUGIN-------//

cmd({
    pattern: "pair",
    alias: [],
    desc: "Get pair code using a phone number",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("+")) {
            // React with ❓ if no phone number is provided or it doesn't start with +
            await conn.sendMessage(from, { react: { text: "❓", key: mek.key } });
            return reply("Please provide a valid phone number with a country code. 📞\nExample: `.pair +94784745155`");
        }

        // React with 🔄 to show processing
        await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });
        reply(`*Fetching pair code for ${q}... 🤝*`);

        // Send request to web service
        const res = await axios.get(`https://black-alpha-web-pair-4df414fa1954.herokuapp.com/?phone=${encodeURIComponent(q)}`);
        if (!res || !res.data || !res.data.code) {
            // If no response or invalid data, show error
            return reply("Could not retrieve pairing code. Please ensure the phone number is correct and try again.");
        }

        // Extract pairing code
        const pairingCode = res.data.code;

        // Reply with the pairing code
        reply(`🤝 *Pairing Code for ${q}:*\n\n${pairingCode}`);

        // React with ✅ to indicate success
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error fetching pair code:", e);

        // React with ❌ and send an error message
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("An error occurred while fetching the pairing code. Please try again later.");
    }
});
