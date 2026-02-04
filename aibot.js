const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const http = require('http');

// Render canlı tutucu
http.createServer((req, res) => { res.write("Bot Aktif!"); res.end(); }).listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// --- AYAR: Bakım Modu ---
let bakimModu = false; // Bakıma almak istersen burayı 'true' yapıp dosyayı kaydet.

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} aktif!`);
    
    // Durum mesajını ayarla
    setInterval(() => {
        if (bakimModu) {
            client.user.setActivity('Bakımda...', { type: ActivityType.Custom });
        } else {
            client.user.setActivity('Aktif ✅', { type: ActivityType.Watching });
        }
    }, 10000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Eğer bakım modu açıksa, komutları çalıştırma
    if (bakimModu && !message.member.permissions.has('Administrator')) {
        if (message.content.startsWith('!')) {
            return message.reply('🛠️ Bot şu anda **Bakım Modundadır.** Lütfen daha sonra tekrar deneyin.');
        }
        return;
    }

    const mesaj = message.content.toLowerCase();

    // --- BASİT KOMUTLAR ---
    if (mesaj === '!test') return message.reply('✅ Bot sorunsuz çalışıyor ve şu an online!');
    
    if (mesaj === 'sa') return message.reply('Aleyküm Selam!');

    if (mesaj === '!ping') return message.reply(`🏓 Pong! Gecikme: ${client.ws.ping}ms`);

    // --- BAKIM MODUNU KOMUTLA AÇ/KAPAT (Sadece Adminler) ---
    if (mesaj === '!bakımaç') {
        if (!message.member.permissions.has('Administrator')) return;
        bakimModu = true;
        return message.reply('🚨 Bot **Bakım Moduna** alındı.');
    }

    if (mesaj === '!bakımkapat') {
        if (!message.member.permissions.has('Administrator')) return;
        bakimModu = false;
        return message.reply('✅ Bot **Aktif** moda döndü.');
    }
});

client.login(process.env.TOKEN);
