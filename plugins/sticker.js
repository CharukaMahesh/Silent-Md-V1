const { cmd } = require('../command');
const { Sticker } = require('wa-sticker-formatter');
const Jimp = require('jimp');

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

        // Create image with text using Jimp
        const image = new Jimp(512, 512, '#1E1E1E'); // Create a blank image with a dark background
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // Load font
        image.print(font, 10, 10, { text: q, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, 492, 492);

        // Save the generated image to a buffer
        const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

        // Create sticker from the generated image
        const sticker = new Sticker(imageBuffer, {
            pack: "ꜱɪʟᴇɴᴛ ᴍᴅ", // Sticker pack name
            author: "Text Sticker Generator", // Author name
            type: "full", // Sticker type
            categories: ["🤖"], // Optional categories
        });

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`Uploading your sticker... 📤`*");

        // Send the sticker
        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Sticker sent successfully! ✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your sticker request. Please try again later.");
    }
});
