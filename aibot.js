const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// Render 7/24 Aktif Tutma Sunucusu
http.createServer((req, res) => {
  res.write("Bot 7/24 Aktif!");
  res.end();
}).listen(process.env.PORT || 3000);

// --- KURULUMLAR ---
// Sadece bir kez tanımlıyoruz
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`✅ [BAŞARILI] ${client.user.tag} online!`);
    client.user.setActivity('Yapay Zeka Aktif', { type: ActivityType.Listening });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!start') {
        return message.reply('🚀 Bot ve Yapay Zeka aktif!');
    }

    if (message.content.startsWith('!soru ')) {
        const prompt = message.content.replace('!soru ', '');
        
        try {
            await message.channel.sendTyping(); 
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            if (text.length > 2000) {
                return message.reply("Cevap çok uzun (2000+ karakter).");
            }
            
            message.reply(text);
        } catch (error) {
            console.error("YZ Hatası Detayı:", error);
            message.reply(`🤖 Bir hata oluştu! Lütfen Render'daki GEMINI_KEY anahtarını kontrol et.`);
        }
    }
});

client.login(process.env.TOKEN);

