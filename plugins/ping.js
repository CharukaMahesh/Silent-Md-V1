const { cmd } = require('../command');

cmd({
    pattern: "ping",
    desc: "Check bot response speed",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        // React with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📡", key: mek.key }
        });

        // Record the time when the command is received
        const startTime = Date.now();
        
        // Send a message to check the response time
        await conn.sendMessage(from, { text: "*𝐒𝐈𝐋𝐄𝐍𝐓 𝐌𝐃 𝐈𝐒 𝐏𝐈𝐍𝐆𝐈𝐍𝐆...📡" });

        // Calculate the time difference and send the ping result with a 📡 emoji
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        await conn.sendMessage(from, { text: `
        ʙᴏᴛ ʀᴇꜱᴘᴏɴꜱᴇ ꜱᴘᴇᴇꜱ ɪꜱ ${responseTime} Ms..📡
│© *ꜱɪʟᴇɴᴛ-ʙᴏᴛ-ᴍᴅ-2024*
└*─────────────────*` }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
