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
        GatewayIntentBits.GuildMembers // ŞART!
    ] 
});

// --- AYARLAR ---
const UYE_ROL_ID = '1233757496326225940'; 
const BOT_ROL_ID = '807692100723802173';  
const LOG_KANAL_ID = '1233781589796716614'; // Mesajların gideceği oda ID
let bakimModu = false; 

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} başarıyla giriş yaptı!`);
    client.user.setActivity('Aktif!', { type: ActivityType.Watching });
});

// --- AYRIMLI OTOMATİK ROL VE LOG SİSTEMİ ---
client.on('guildMemberAdd', async (member) => {
    const logKanali = member.guild.channels.cache.get(LOG_KANAL_ID);
    
    try {
        if (member.user.bot) {
            // BOT GELDİĞİNDE
            const botRol = member.guild.roles.cache.get(BOT_ROL_ID);
            if (botRol) await member.roles.add(botRol);
            
            if (logKanali) {
                const botEmbed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('🤖 Yeni Bot Katıldı')
                    .setDescription(`Sunucuya yeni bir bot eklendi: ${member}\nVerilen Rol: <@&${BOT_ROL_ID}>`)
                    .setTimestamp();
                logKanali.send({ embeds: [botEmbed] });
            }
        } else {
            // İNSAN GELDİĞİNDE
            const uyeRol = member.guild.roles.cache.get(UYE_ROL_ID);
            if (uyeRol) await member.roles.add(uyeRol);
            
            if (logKanali) {
                const uyeEmbed = new EmbedBuilder()
                    .setColor('#2ECC71')
                    .setTitle('📥 Aramıza Hoş Geldin!')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Merhaba ${member}! Sunucuya hoş geldin.\nSeninle birlikte **${member.guild.memberCount}** kişi olduk! ✨\n\nOtomatik rolün tanımlandı: <@&${UYE_ROL_ID}>`)
                    .setFooter({ text: 'Keyifli vakit geçirmeni dileriz!' })
                    .setTimestamp();
                logKanali.send({ embeds: [uyeEmbed] });
            }
        }
    } catch (err) {
        console.error("❌ Rol/Mesaj hatası:", err);
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

    if (bakimModu && !message.member.permissions.has('Administrator')) {
        if (message.content.startsWith('!')) return message.reply('🛠️ Bot şu anda bakımda.');
        return;
    }

    const mesaj = message.content.toLowerCase();

    if (mesaj === '!ping') return message.reply(`🏓 Pong! ${client.ws.ping}ms`);
    if (mesaj === 'sa') return message.reply('Aleyküm Selam!');

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
