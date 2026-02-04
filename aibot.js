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
const genAI = new GoogleGenerativeAI("AIzaSyAvSrN5566VkJiziDpMcSeTv0oUjeFeo2Y");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
            const hataMesaji = error.message || "Bilinmeyen bir hata oluştu.";
            message.reply(`🤖 **Sistem Hatası Aldım!** \n\`\`\`\n${hataMesaji}\n\`\`\``);
        }
    }
});

client.login(process.env.TOKEN);



