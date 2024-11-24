const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

// 🎵--------AUDIO-DOWNLOAD-------//

cmd({
    pattern: "audio",
    alias: ["ymp3", "play" , "song"],
    desc: "Download YouTube audio",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid audio name or URL... 🎵");

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply("*`Searching for your audio... 🎧`*");

        // Search audio
        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🎵 *YouTube Audio Found!*

*Title* 🎶: ${data.title}
*Description* 📝: ${data.description}
*Duration* ⏰: ${data.timestamp}
*Uploaded* 🚀: ${data.ago}
*Views* 📊: ${data.views}

Click "Download" below if this is your desired audio.
`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`Downloading your audio... 📥`*");

        // Download Audio
        let downAudio = await fg.yta(url);
        if (!downAudio || !downAudio.dl_url) {
            return reply("Failed to download audio. Please try again later.");
        }
        let downloadAudioUrl = downAudio.dl_url;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`Uploading your audio... 📤`*");

        // Send Audio File
        await conn.sendMessage(from, {
            audio: { url: downloadAudioUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            caption: `🎵 ${data.title} - Enjoy your audio!`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Audio uploaded successfully! ✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});

