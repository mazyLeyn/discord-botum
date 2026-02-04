const { Client, GatewayIntentBits } = require('discord.js');
const Groq = require("groq-sdk");
const http = require('http');

// Render canlı tutucu
http.createServer((req, res) => { res.write("Bot Online!"); res.end(); }).listen(process.env.PORT || 3000);

const groq = new Groq({ apiKey: process.env.GROQ_KEY });
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.on('ready', () => console.log(`🚀 Groq Bot ${client.user.tag} olarak hazır!`));

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!soru ')) return;

    const prompt = message.content.replace('!soru ', '');
    
    try {
        await message.channel.sendTyping();
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // En güçlü ve hızlı Llama modeli
        });

        const reply = chatCompletion.choices[0]?.message?.content || "Cevap alınamadı.";
        message.reply(reply.length > 2000 ? reply.substring(0, 1990) + "..." : reply);

    } catch (error) {
        console.error("Groq Hatası:", error);
        message.reply("❌ Bir hata oluştu, Groq servisi şu an meşgul olabilir.");
    }
});

client.login(process.env.TOKEN);
