const { cmd } = require('../command');
const fg = require('nayan-media-downloader');

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
        if (!data || !data.video || !data.video.url) {
            return reply("No results found for the given TikTok URL.");
        }

        let desc = `
🎬 *TikTok Video Found!*

*Author* ✨: ${data.author}
*Description* 📝: ${data.description || "No description available."}
*Duration* ⏰: ${data.duration || "Unknown"}
*Views* 📊: ${data.stats?.playCount || "Unknown"}

Click "Download" below to save this video.
`;

        await conn.sendMessage(from, { image: { url: data.video.cover }, caption: desc }, { quoted: mek });

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`Downloading your TikTok video... 📥`*");

        // Download Video
        const videoUrl = data.video.url;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`Uploading your TikTok video... 📤`*");

        // Send Video File
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `🎬 TikTok Video - Enjoy!`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`TikTok video uploaded successfully! ✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your TikTok video. Please try again later.");
    }
});
