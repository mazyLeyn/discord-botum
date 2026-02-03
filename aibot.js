const { Client, GatewayIntentBits, ActivityType } = require('discord.js');


const http = require('http');
http.createServer((req, res) => {
  res.write("Bot 7/24 Aktif!");
  res.end();
}).listen(process.env.PORT || 3000);



// --- SADECE TOKENİNİ YAZ ---
const DISCORD_TOKEN = process.env.TOKEN; 

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`✅ [BAŞARILI] ${client.user.tag} Aİ BOT şu an online!`);
    
    // Botun altında "Online" yazması için durum ekleyelim
    client.user.setActivity('Sistem Aktif', { type: ActivityType.Watching });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content === '!start') {
        message.reply('🚀 Bot başarıyla başlatıldı ve 7/24 aktif!');
    }
    // Botun çalıştığını test etmek için basit bir cevap
    if (message.content === '!test') {
        message.reply('✅ Bot sorunsuz çalışıyor ve şu an online!');
    }
});

client.login(DISCORD_TOKEN);

