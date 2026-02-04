const { Client, GatewayIntentBits, ActivityType } = require('discord.js');const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// Render'da botun uyumaması için basit bir sunucu
http.createServer((req, res) => {
  res.write("Bot 7/24 Aktif!");
  res.end();
}).listen(process.env.PORT || 3000);

// --- KURULUMLAR ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
// En stabil model ismi
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`✅ [BAŞARILI] ${client.user.tag} aktif!`);
    client.user.setActivity('Soruları Bekliyorum', { type: ActivityType.Listening });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!start') {
        return message.reply('🚀 Bot ve Yapay Zeka hazır! Mesajına `!soru` ekleyerek bir şeyler sorabilirsin.');
    }

    if (message.content.startsWith('!soru ')) {
        const prompt = message.content.replace('!soru ', '');
        
        try {
            await message.channel.sendTyping(); 
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Discord 2000 karakter sınırı kontrolü
            if (text.length > 2000) {
                return message.reply("🤖 Cevap çok uzun olduğu için gönderemiyorum.");
            }
            
            message.reply(text);

        } catch (error) {
            console.error("Hata Detayı:", error);
            
            // Hatayı anlamamız için Discord'a teknik detay yazdıralım
            let hataMesaji = "Beklenmedik bir hata oluştu.";
            if (error.message.includes("404")) hataMesaji = "Model bulunamadı (404). Lütfen kütüphaneyi güncelleyin.";
            if (error.message.includes("403")) hataMesaji = "Erişim engellendi (403). Bölge kısıtlaması olabilir.";
            if (error.message.includes("API_KEY_INVALID")) hataMesaji = "API Anahtarı geçersiz.";

            message.reply(`🤖 **Hata Oluştu!**\n\`\`\`\n${hataMesaji}\n\`\`\``);
        }
    }
});

client.login(process.env.TOKEN);
