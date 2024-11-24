const { cmd } = require('../command');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const canvacord = require('canvacord');

// 🎨--------TEXT-TO-STICKER (TTP)-------//

cmd({
    pattern: "ttp",
    alias: ["textsticker", "text2sticker"],
    desc: "Generate a text sticker",
    category: "sticker",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide some text to generate a sticker... 🖌️");

        // React with 🖌️ and show generating text
        await conn.sendMessage(from, { react: { text: "🖌️", key: mek.key } });
        reply("*`Generating your sticker... 🖌️`*");

        // Generate the image with text using Canvacord
        const canvas = await canvacord.Canvacord.text(q, {
            color: "#FFFFFF", // Text color
            background: "#1E1E1E", // Background color
            padding: 20, // Padding around text
            fontSize: 70, // Font size
            width: 512, // Image width
            height: 512 // Image height
        });

        // Create a sticker from the generated image
        const stickerBuffer = await createSticker(canvas, {
            type: StickerTypes.DEFAULT,
            pack: "ꜱɪʟᴇɴᴛ ᴍᴅ", // Sticker pack name
            author: "Text Sticker Generator" // Author name
        });

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`Uploading your sticker... 📤`*");

        // Send the sticker
        await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Sticker sent successfully! ✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your sticker request. Please try again later.");
    }
});
