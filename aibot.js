const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const http = require('http');

// GÜVENLİ VE STABİL HTTP SUNUCUSU
http.createServer((req, res) => { 
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write("Bot 7/24 Aktif Tutuluyor!"); 
    res.end(); 
}).listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

let bakimModu = false; 
const SAHIB_ID = 'SENIN_DISCORD_ID_BURAYA'; // Kendi ID'ni buraya yazarsan daha güvenli olur

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} başarıyla giriş yaptı!`);
    client.user.setActivity('Aktif!', { type: ActivityType.Watching });
});

// Durum güncelleme döngüsü (Ram dostu olması için 1 dakikaya çıkardım)
setInterval(() => {
    const status = bakimModu ? 'Bakımda...' : 'Aktif!';
    const type = bakimModu ? ActivityType.Custom : ActivityType.Watching;
    client.user.setActivity(status, { type: type });
}, 60000);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Bakım Modu Koruması
    if (bakimModu && !message.member.permissions.has('Administrator')) {
        if (message.content.startsWith('!')) return message.reply('🛠️ Bot şu anda bakımda.');
        return;
    }

    const mesaj = message.content.toLowerCase();

    // Komutlar
    if (mesaj === '!ping') return message.reply(`🏓 Pong! ${client.ws.ping}ms`);
    if (mesaj === 'sa') return message.reply('Aleyküm Selam!');

    // Bakım Yönetimi (Sadece yönetici yetkisi olanlar)
    if (mesaj === '!bakımaç' && message.member.permissions.has('Administrator')) {
        bakimModu = true;
        return message.reply('🚨 Bakım modu açıldı.');
    }

    if (mesaj === '!bakımkapat' && message.member.permissions.has('Administrator')) {
        bakimModu = false;
        return message.reply('✅ Bot normale döndü.');
    }
});

client.login(process.env.TOKEN);
