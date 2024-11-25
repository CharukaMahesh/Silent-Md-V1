const { cmd } = require('../command');
const axios = require('axios');

// 🤝--------PAIR-CODE-PLUGIN-------//

cmd({
    pattern: "pair",
    alias: ["getpair", "paircode"],
    desc: "Get a pairing code for a phone number",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { react: { text: "❓", key: mek.key } });
            return reply("Please provide a valid phone number with the country code. 📱\nExample: `.pair +94784745155`");
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^\+\d{10,15}$/;
        if (!phoneRegex.test(q)) {
            await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
            return reply("Invalid phone number format. Ensure it includes the country code (e.g., +94784745155).");
        }

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply(`*Fetching pairing code for ${q}... 🤝*`);

        // Fetch pairing code from the API
        const apiUrl = `https://black-alpha-web-pair-4df414fa1954.herokuapp.com/?phone=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);

        if (res && res.data && res.data.code) {
            const pairingCode = res.data.code;

            // React with ☁️ and send pairing code
            await conn.sendMessage(from, { react: { text: "☁️", key: mek.key } });
            reply(`🤝 *Pairing Code Found!*\n\n*Phone*: ${q}\n*Code*: ${pairingCode}`);
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            reply("Could not retrieve pairing code. Please ensure the phone number is correct and try again.");
        }
    } catch (e) {
        console.error("Error fetching pairing code:", e);
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        reply("An error occurred while retrieving the pairing code. Please try again later.");
    }
});
