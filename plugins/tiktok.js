const { cmd } = require('../command');
const fg = require('api-dylux');

// 🎥--------TIKTOK-DOWNLOAD-------//

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid TikTok URL... 🎵");

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply("*`Searching for your TikTok video... 🎥`*");

        // Fetch TikTok video details
        const data = await fg.tiktok(q);
        if (!data || !data.video || !data.video.nowatermark) {
            return reply("No results found or invalid TikTok URL.");
        }

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`Downloading your TikTok video... 📥`*");

        // Download Video
        const videoUrl = data.video.nowatermark;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`Uploading your TikTok video... 📤`*");

        // Send Video File
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `🎬 TikTok Video`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`TikTok video uploaded successfully! ✅`*");

    } catch (e) {
        console.error("Error:", e); // Debugging: Log error details
        reply("An error occurred while processing your TikTok video. Please try again later.");
    }
});
