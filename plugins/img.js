const { cmd } = require('../command');
const axios = require('axios');

// 🖼️--------MULTIPLE-IMAGE-DOWNLOAD-------//

cmd({
    pattern: "image",
    alias: ["img", "pic"],
    desc: "Download random or specific images (up to 5)",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("Please provide a keyword for the image search. 🖼️\nExample: `.image sunset`");
        }

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply(`*Searching for images related to "${q}"... 🖼️*`);

        // Prepare to fetch 5 images
        const imageUrls = [];
        for (let i = 0; i < 5; i++) {
            const res = await axios.get(`https://source.unsplash.com/random/800x600/?${encodeURIComponent(q)}`, {
                responseType: "arraybuffer"
            });
            if (res.status === 200) {
                imageUrls.push(Buffer.from(res.data));
            } else {
                break;
            }
        }

        if (imageUrls.length === 0) {
            return reply("Could not retrieve images. Please try another keyword.");
        }

        // Send all images
        for (let i = 0; i < imageUrls.length; i++) {
            await conn.sendMessage(from, {
                image: imageUrls[i],
                caption: `Image ${i + 1} of "${q}" 🖼️`
            }, { quoted: mek });
        }

        // React with ✅
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*All images sent successfully! ✅*");

    } catch (e) {
        console.error("Error fetching images:", e);
        reply("An error occurred while fetching the images. Please try again later.");
    }
});
