const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // YZ Paketi
const http = require('http');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
// Render 7/24 Aktif Tutma Sunucusu
http.createServer((req, res) => {
  res.write("Bot 7/24 Aktif!");
  res.end();
}).listen(process.env.PORT || 3000);

// --- KURULUMLAR ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY); // Render'a GEMINI_KEY ekleyeceğiz
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`✅ [BAŞARILI] ${client.user.tag} Aİ BOT online!`);
    client.user.setActivity('Yapay Zeka Aktif', { type: ActivityType.Listening });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Normal Komutlar
    if (message.content === '!start') {
        return message.reply('🚀 Bot ve Yapay Zeka aktif!');
    }

    // YAPAY ZEKA KOMUTU: !soru nasılsın? gibi
    if (message.content.startsWith('!soru ')) {
        const prompt = message.content.replace('!soru ', '');
        
        try {
            // Yazıyor... efekti verir
            await message.channel.sendTyping(); 
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Discord mesaj sınırı 2000 karakterdir, kontrol edelim
            if (text.length > 2000) {
                return message.reply("Cevap çok uzun olduğu için gönderemedim.");
            }
            
            message.reply(text);
        } catch (error) {
            console.error("YZ Hatası:", error);
            message.reply("🤖 Üzgünüm, şu an düşünemiyorum. API anahtarını kontrol et.");
        }
    }
});

client.login(process.env.TOKEN);

