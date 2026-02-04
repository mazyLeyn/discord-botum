const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// Render Uyku Engelleyici
http.createServer((req, res) => {
    res.write("Bot Aktif!");
    res.end();
}).listen(process.env.PORT || 3000);

// --- KURULUMLAR ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} aktif!`);
    client.user.setActivity('Soruları Bekliyorum', { type: ActivityType.Listening });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!start') {
        return message.reply('🚀 Bot ve YZ hazır! Sorularını bekliyorum.');
    }

    if (message.content.startsWith('!soru ')) {
        const prompt = message.content.replace('!soru ', '');
        
        try {
            await message.channel.sendTyping(); 
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            if (text.length > 2000) {
                return message.reply("🤖 Cevap çok uzun (2000+ karakter).");
            }
            message.reply(text);

        } catch (error) {
            console.error("YZ Hatası:", error);
            message.reply(`🤖 **Hata:** \`\`\`${error.message.substring(0, 100)}...\`\`\``);
        }
    }
});

client.login(process.env.TOKEN);

