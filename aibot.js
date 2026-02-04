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

let bakimModu = false; 

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} aktif!`);
    
    // Bot ilk açıldığında durumu ayarla
    client.user.setActivity('Aktif!', { type: ActivityType.Watching });

    // Durum kontrol döngüsü (Her 10 saniyede bir kontrol eder)
    setInterval(() => {
        if (bakimModu) {
            // Bakım modu açıksa sadece "Bakımda..." yazar
            client.user.setActivity('Bakımda...', { type: ActivityType.Custom });
        } else {
            // Bakım modu kapalıysa senin cümlen yazar
            client.user.setActivity('Aktif!.', { type: ActivityType.Watching });
        }
    }, 10000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Bakım Modu Kısıtlaması
    if (bakimModu && !message.member.permissions.has('Administrator')) {
        if (message.content.startsWith('!')) {
            return message.reply('🛠️ Bot şu anda **Bakım Modundadır.**');
        }
        return;
    }

    const mesaj = message.content.toLowerCase();

    // --- KOMUTLAR ---
    if (mesaj === '!test') return message.reply('✅ Bot sorunsuz çalışıyor ve şu an online!');
    if (mesaj === 'sa') return message.reply('Aleyküm Selam!');
    if (mesaj === '!ping') return message.reply(`🏓 Pong! Gecikme: ${client.ws.ping}ms`);

    // --- BAKIM YÖNETİMİ ---
    if (mesaj === '!bakımaç') {
        if (!message.member.permissions.has('Administrator')) return;
        bakimModu = true;
        // Komut verildiği an hemen durumu değiştir
        client.user.setActivity('Bakımda...', { type: ActivityType.Custom });
        return message.reply('🚨 Bot **Bakım Moduna** alındı. (Kapatılana kadar böyle kalacak)');
    }

    if (mesaj === '!bakımkapat') {
        if (!message.member.permissions.has('Administrator')) return;
        bakimModu = false;
        // Komut verildiği an hemen durumu değiştir
        client.user.setActivity('Aktif!', { type: ActivityType.Watching });
        return message.reply('✅ Bot **Aktif** moda döndü.');
    }
});

client.login(process.env.TOKEN);
