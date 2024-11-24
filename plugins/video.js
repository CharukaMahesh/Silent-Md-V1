const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

// 🎬--------VIDEO-DOWNLOAD-------//

cmd({
    pattern: "video",
    alias: ["ytmp4", "vplay"],
    desc: "Download YouTube videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid video name or URL... 🎬");

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply("*`Searching for your video... 🎥`*");

        // Search video
        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🎬 *YouTube Video Found!*

*Title* 🔍: ${data.title}
*Description* 📝: ${data.description}
*Duration* ⏰: ${data.timestamp}
*Uploaded* 🚀: ${data.ago}
*Views* 📊: ${data.views}

Click "Download" below if this is your desired video.
`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`Downloading your video... 📥`*");

        // Download Video
        let downVideo = await fg.ytv(url);
        if (!downVideo || !downVideo.dl_url) {
            return reply("Failed to download video. Please try again later.");
        }
        let downloadVideoUrl = downVideo.dl_url;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`Uploading your video... 📤`*");

        // Send Video File
        await conn.sendMessage(from, {
            video: { url: downloadVideoUrl },
            mimetype: "video/mp4",
            caption: `🎥 ${data.title} - Enjoy your video!`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Video uploaded successfully! ✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
