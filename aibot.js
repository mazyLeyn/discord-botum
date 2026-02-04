const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const http = require('http');

// --- RENDER CANLI TUTUCU ---
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write("AI Bot 7/24 Aktif!");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

// --- AYARLAR ---
const LOG_KANAL_ID = "807689795642851368"; 
let bakimModu = false;

client.on('ready', () => {
    console.log(`✅ [AI BOT] ${client.user.tag} aktif!`);
    client.user.setActivity('Aktif!', { type: ActivityType.Watching });
});

// --- HOŞ GELDİN LOGU ---
client.on('guildMemberAdd', async (member) => {
    const logKanali = member.guild.channels.cache.get(LOG_KANAL_ID);
    if (!logKanali) return;

    const embed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('📥 Yeni Katılım')
        .setDescription(`Merhaba ${member}, sunucuya hoş geldin!\nSeninle birlikte **${member.guild.memberCount}** kişi olduk.`)
        .setTimestamp();
    
    logKanali.send({ embeds: [embed] });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    // --- BAKIM MODU KONTROLÜ ---
    if (bakimModu && !message.member.permissions.has('Administrator')) {
        if (message.content.startsWith('!')) return message.reply('🛠️ Bot şu anda bakımda, daha sonra tekrar dene.');
        return;
    }

    const mesaj = message.content.toLowerCase();

    // --- BAKIM KOMUTLARI ---
    if (mesaj === '!bakımaç' && message.member.permissions.has('Administrator')) {
        bakimModu = true;
        client.user.setActivity('Bakımda...', { type: ActivityType.Custom });
        return message.reply('🚨 **Bakım modu açıldı.** Adminler hariç komut kullanımı kilitlendi.');
    }

    if (mesaj === '!bakımkapat' && message.member.permissions.has('Administrator')) {
        bakimModu = false;
        client.user.setActivity('Aktif!', { type: ActivityType.Watching });
        return message.reply('✅ **Bakım modu kapatıldı.** Bot normale döndü.');
    }

    // --- AI CEVAPLARI BURAYA GELECEK ---
    // Örnek: if (mesaj.startsWith('!sor')) { ... }
});

client.login(process.env.TOKEN);
