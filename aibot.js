const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
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
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Yeni üyeleri ve botları tespit etmek için ŞART!
    ] 
});

// --- AYARLAR (Burayı Kendi Sunucuna Göre Doldur) ---
const UYE_ROL_ID = '1233757496326225940'; // Normal kullanıcılar için rol ID
const BOT_ROL_ID = '807692100723802173';   // Sunucuya gelen botlar için rol ID
let bakimModu = false; 

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} başarıyla giriş yaptı!`);
    client.user.setActivity('Aktif!', { type: ActivityType.Watching });
});

// --- AYRIMLI OTOMATİK ROL SİSTEMİ ---
client.on('guildMemberAdd', async (member) => {
    try {
        if (member.user.bot) {
            // Eğer katılan bir BOT ise
            const botRol = member.guild.roles.cache.get(BOT_ROL_ID);
            if (botRol) await member.roles.add(botRol);
            console.log(`🤖 Yeni bot geldi: ${member.user.tag}, Bot rolü verildi.`);
        } else {
            // Eğer katılan bir İNSAN ise
            const uyeRol = member.guild.roles.cache.get(UYE_ROL_ID);
            if (uyeRol) await member.roles.add(uyeRol);
            console.log(`👤 Yeni üye geldi: ${member.user.tag}, Üye rolü verildi.`);
        }
    } catch (err) {
        console.error("❌ Rol verme hatası! Botun rolü, vermeye çalıştığı rolden daha aşağıda olabilir.", err);
    }
});

// Durum güncelleme döngüsü
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

    // Bakım Yönetimi
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
