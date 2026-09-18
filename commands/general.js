const Helpers = require('../utils/helpers');
const config = require('../utils/config');
const fs = require('fs-extra');

const menuText = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   ✨  𝐁𝐎𝐓 𝐃-𝐋𝐎𝐔𝐈𝐒 𝐕.𝟖  ✨
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭═══『 📋 INFO BOT 』═══╮
┃ ▸ 👑 Owner   : {owner}
┃ ▸ 🤖 Bot     : {botName}
┃ ▸ ⚡ Prefix  : {prefix}
┃ ▸ 📦 Version : {version}
┃ ▸ 💻 Runtime : {runtime}
┃ ▸ 🧠 RAM     : {ram}
┃ ▸ 🕐 Time    : {time}
┃ ▸ 🟢 Status  : Online ✅
╰═══════════════════════╯

╭═══『 🎮 GAME 』═══╮
┃ ▸ .asahotak
┃ ▸ .buylimit
┃ ▸ .caklontong
┃ ▸ .dare
┃ ▸ .family100
┃ ▸ .hint
┃ ▸ .math
┃ ▸ .nyerah
┃ ▸ .redeem
┃ ▸ .siapakahaku
┃ ▸ .sloth
┃ ▸ .suit
┃ ▸ .susunkalimat
┃ ▸ .susunkata
┃ ▸ .susunlirik
┃ ▸ .tebakbendera
┃ ▸ .tebakbom
┃ ▸ .tebakkata
┃ ▸ .tekateki
┃ ▸ .tfbalance
┃ ▸ .tictactoe
┃ ▸ .truth
┃ ▸ .werewolf2
╰═══════════════════╯

╭═══『 🛠️ GENERAL 』═══╮
┃ ▸ .changelog
┃ ▸ .everyone
┃ ▸ .infobot
┃ ▸ .menu
┃ ▸ .owner
┃ ▸ .ping
┃ ▸ .resend
┃ ▸ .runtime
┃ ▸ .sender
┃ ▸ .version
╰═══════════════════════╯

╭═══『 👥 GROUP 』═══╮
┃ ▸ .absen
┃ ▸ .add
┃ ▸ .addwhitelist
┃ ▸ .afk
┃ ▸ .antibot
┃ ▸ .antidelete
┃ ▸ .antigroupsw
┃ ▸ .antikudeta
┃ ▸ .antilink
┃ ▸ .antilinkchannel
┃ ▸ .antilinknokick
┃ ▸ .antilinkuniversal
┃ ▸ .antiluar
┃ ▸ .antimentionsw
┃ ▸ .antisticker
┃ ▸ .antiviewonce
┃ ▸ .antiwame
┃ ▸ .antiwamenokick
┃ ▸ .cekabsen
┃ ▸ .cekidgroup
┃ ▸ .cekwarn
┃ ▸ .delete
┃ ▸ .deleteabsen
┃ ▸ .delwarn
┃ ▸ .delwhitelist
┃ ▸ .demote
┃ ▸ .demotedetector
┃ ▸ .descgc
┃ ▸ .groupadmin
┃ ▸ .groupinfo
┃ ▸ .groupsetting
┃ ▸ .hidetag
┃ ▸ .kick
┃ ▸ .kickme
┃ ▸ .leavegc
┃ ▸ .left
┃ ▸ .levelling
┃ ▸ .linkgc
┃ ▸ .listwarn
┃ ▸ .listwhitelist
┃ ▸ .mulaiabsen
┃ ▸ .mute
┃ ▸ .pinmsg
┃ ▸ .promote
┃ ▸ .promotedetector
┃ ▸ .refreshgroup
┃ ▸ .reqjoin
┃ ▸ .resetwarn
┃ ▸ .revokelink
┃ ▸ .setdescgc
┃ ▸ .setnamegc
┃ ▸ .setppgc
┃ ▸ .setppgcpanjang
┃ ▸ .setwarn
┃ ▸ .tagall
┃ ▸ .totag
┃ ▸ .unpinmsg
┃ ▸ .vote
┃ ▸ .warn
┃ ▸ .welcome
╰═══════════════════════╯

╭═══『 ℹ️ INFO 』═══╮
┃ ▸ .balance
┃ ▸ .cekchannel
┃ ▸ .cekpremium
┃ ▸ .infocovid
┃ ▸ .infogempa
┃ ▸ .infounsur
┃ ▸ .kodebahasa
┃ ▸ .limit
┃ ▸ .listban
┃ ▸ .listblock
┃ ▸ .listgroup
┃ ▸ .listpremium
┃ ▸ .profile
┃ ▸ .report
┃ ▸ .status
┃ ▸ .topglobal
┃ ▸ .toplocal
╰═══════════════════════╯

╭═══『 👑 OWNER 』═══╮
┃ ▸ .addbalance
┃ ▸ .addlevel
┃ ▸ .addlimit
┃ ▸ .addpremiumgroup
┃ ▸ .addrespon
┃ ▸ .addxp
┃ ▸ .anticall
┃ ▸ .anticallnoblock
┃ ▸ .antideletepc
┃ ▸ .autonexara
┃ ▸ .autoread
┃ ▸ .autotype
┃ ▸ .ban
┃ ▸ .bccancel
┃ ▸ .bcconfirm
┃ ▸ .bcgchidetag
┃ ▸ .bcgroup
┃ ▸ .bchidetag
┃ ▸ .bcpc
┃ ▸ .bcstat
┃ ▸ .block
┃ ▸ .blockpc
┃ ▸ .broadcast
┃ ▸ .buttonmode
┃ ▸ .buttontojson
┃ ▸ .callloop
┃ ▸ .callplay
┃ ▸ .callqueue
┃ ▸ .callskip
┃ ▸ .callstop
┃ ▸ .cekgroupcron
┃ ▸ .cekgroupsewa
┃ ▸ .chatgroup
┃ ▸ .claimwibusoftredeem
┃ ▸ .cleangroupcron
┃ ▸ .cleangroupsewa
┃ ▸ .clearchat
┃ ▸ .copythumbnail
┃ ▸ .createbutton
┃ ▸ .createfullbutton
┃ ▸ .createlist
┃ ▸ .createredeem
┃ ▸ .createtemplate
┃ ▸ .createthumbnail
┃ ▸ .delbalance
┃ ▸ .deleteredeem
┃ ▸ .dellevel
┃ ▸ .dellimit
┃ ▸ .delpremiumgroup
┃ ▸ .delrespon
┃ ▸ .delxp
┃ ▸ .globalgamemode
┃ ▸ .golink
┃ ▸ .grabcontact
┃ ▸ .grouponlypremium
┃ ▸ .inforedeem
┃ ▸ .inviteme
┃ ▸ .join
┃ ▸ .leaveall
┃ ▸ .leavegcbyid
┃ ▸ .leavenosewa
┃ ▸ .levellingpc
┃ ▸ .listcommand
┃ ▸ .listgroupnosewa
┃ ▸ .listpremiumgroup
┃ ▸ .listredeem
┃ ▸ .listrespon
┃ ▸ .mutebc
┃ ▸ .mutebyid
┃ ▸ .mycontacts
┃ ▸ .onlygroup
┃ ▸ .onlyindo
┃ ▸ .onlyprem
┃ ▸ .pconlyprem
┃ ▸ .premiumgroup
┃ ▸ .promoteme
┃ ▸ .public
┃ ▸ .publicbyid
┃ ▸ .queue
┃ ▸ .rawmessage
┃ ▸ .react
┃ ▸ .reactchannel
┃ ▸ .refreshgroupbyid
┃ ▸ .resetanonymous
┃ ▸ .resetbalance
┃ ▸ .resetlevel
┃ ▸ .resetlimit
┃ ▸ .resetpremium
┃ ▸ .resetresponse
┃ ▸ .resetxp
┃ ▸ .searchmessage
┃ ▸ .self
┃ ▸ .selfbyid
┃ ▸ .setbio
┃ ▸ .setcommand
┃ ▸ .setdefaultweltype
┃ ▸ .setname
┃ ▸ .setopenaikey
┃ ▸ .setpp
┃ ▸ .setpppanjang
┃ ▸ .setwrsuit
┃ ▸ .setwrttt
┃ ▸ .testbutton
┃ ▸ .unban
┃ ▸ .unblock
┃ ▸ .unreact
┃ ▸ .unreactchannel
┃ ▸ .upres
╰═══════════════════════╯

╭═══『 🎲 RANDOM 』═══╮
┃ ▸ .alay
┃ ▸ .apakah
┃ ▸ .cekkhodam
┃ ▸ .faktaunik
┃ ▸ .jadian
┃ ▸ .kapankah
┃ ▸ .katabijak
┃ ▸ .pantun
┃ ▸ .puisi
┃ ▸ .randomanime
┃ ▸ .randomnumber
┃ ▸ .randomtag
┃ ▸ .rate
┃ ▸ .siapakah
╰═══════════════════════╯

╭═══『 🔍 SEARCH 』═══╮
┃ ▸ .alkitab
┃ ▸ .alquranaudio
┃ ▸ .artinama
┃ ▸ .brainly
┃ ▸ .ipchecker
┃ ▸ .jadwalshalat
┃ ▸ .lirik
╰═══════════════════════╯

╭═══『 🎨 STICKER 』═══╮
┃ ▸ .sticker
┃ ▸ .stickercircle
┃ ▸ .stickerwm
┃ ▸ .takesticker
┃ ▸ .toimg
╰═══════════════════════╯

╭═══『 🔧 TOOLS 』═══╮
┃ ▸ .cekplatform
┃ ▸ .dbase64
┃ ▸ .dec
┃ ▸ .dhex
┃ ▸ .ebase64
┃ ▸ .ehex
┃ ▸ .enc
┃ ▸ .fakereply
┃ ▸ .halah
┃ ▸ .hdsw
┃ ▸ .heleh
┃ ▸ .hilih
┃ ▸ .holoh
┃ ▸ .huluh
┃ ▸ .kirim
┃ ▸ .poll
┃ ▸ .qrcode
┃ ▸ .readmore
┃ ▸ .readviewonce
┃ ▸ .shortlink
┃ ▸ .swhd
┃ ▸ .toquickvideo
┃ ▸ .toviewonce
┃ ▸ .translate
╰═══════════════════════╯

╭═══════════════════════╮
┃  💎 Powered by D-LOUIS  ┃
┃  © pangeranzenv1 2024       ┃
╰═══════════════════════╯`;

module.exports = (sock, m, db, cmd) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const pushName = m.pushName || 'User';
    const senderNum = Helpers.cleanNumber(sender);
    const owners = [config.ownerNumber];

    const generateMenu = () => menuText
        .replace('{owner}', owners[0])
        .replace('{botName}', config.botName)
        .replace('{prefix}', config.prefix)
        .replace('{version}', config.version)
        .replace('{runtime}', Helpers.getRuntime())
        .replace('{ram}', Helpers.getRAM())
        .replace('{time}', Helpers.getTime());

    switch (cmd) {
        case 'menu':
        case 'help': {
            const text = generateMenu();
            
            // Cek gambar menu
            if (fs.existsSync(config.menuImage)) {
                try {
                    await sock.sendMessage(from, {
                        image: fs.readFileSync(config.menuImage),
                        caption: text,
                        mentions: [sender]
                    }, { quoted: m });
                } catch (e) {
                    await sock.sendMessage(from, { text }, { quoted: m });
                }
            } else {
                await sock.sendMessage(from, { text }, { quoted: m });
            }
            break;
        }

        case 'ping': {
            const start = Date.now();
            await sock.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: m });
            const latency = Date.now() - start;
            await sock.sendMessage(from, {
                text: `🏓 *PONG!*\n⚡ Latency: ${latency}ms\n💻 Runtime: ${Helpers.getRuntime()}\n🧠 RAM: ${Helpers.getRAM()}`
            }, { quoted: m });
            break;
        }

        case 'runtime': {
            await sock.sendMessage(from, {
                text: `💻 *RUNTIME BOT*\n\n⏰ Uptime: ${Helpers.getRuntime()}\n🕐 Waktu: ${Helpers.getTime()}\n🧠 RAM: ${Helpers.getRAM()}`
            }, { quoted: m });
            break;
        }

        case 'owner': {
            await sock.sendMessage(from, {
                text: `👑 *OWNER BOT*\n\n📱 Nomor: ${owners[0]}\n💬 Chat: wa.me/${owners[0]}\n🤖 Bot: ${config.botName}`
            }, { quoted: m });
            break;
        }

        case 'sender': {
            const user = db.getUser(sender);
            await sock.sendMessage(from, {
                text: `👤 *INFO SENDER*\n\n📛 Nama: ${pushName}\n📱 Nomor: ${senderNum}\n🎫 JID: ${sender}\n💎 Premium: ${db.isPremium(sender) ? 'Ya' : 'Tidak'}\n🎯 Limit: ${user.limit}\n💰 Balance: ${user.balance}\n⭐ Level: ${user.level}\n🔮 XP: ${user.xp}`
            }, { quoted: m });
            break;
        }

        case 'infobot': {
            await sock.sendMessage(from, {
                text: `🤖 *INFO BOT*\n\n📛 Nama: ${config.botName}\n📦 Versi: ${config.version}\n⚡ Prefix: ${config.prefix}\n👑 Owner: ${owners[0]}\n💻 Runtime: ${Helpers.getRuntime()}\n🧠 RAM: ${Helpers.getRAM()}`
            }, { quoted: m });
            break;
        }

        case 'version': {
            await sock.sendMessage(from, {
                text: `📦 *VERSION BOT*\n\n🔖 Versi: ${config.version}\n📛 Nama: ${config.botName}\n📅 Update: ${Helpers.getTime()}`
            }, { quoted: m });
            break;
        }

        case 'changelog': {
            await sock.sendMessage(from, {
                text: `📝 *CHANGELOG V${config.version}*\n\n✨ Fitur Baru:\n- Menu system dengan foto\n- 200+ commands\n- Game engine\n- Anti link & anti bot\n\n🐛 Bug Fix:\n- Fix error install\n- Optimasi performa`
            }, { quoted: m });
            break;
        }

        case 'everyone': {
            if (!from.endsWith('@g.us')) {
                return sock.sendMessage(from, { text: '❌ Command ini cuma buat grup!' }, { quoted: m });
            }
            try {
                const meta = await sock.groupMetadata(from);
                const mentions = meta.participants.map(p => p.id);
                await sock.sendMessage(from, {
                    text: `📢 *EVERYONE*\n\n${m.message?.extendedTextMessage?.text?.split(' ').slice(1).join(' ') || 'Halo semua!'}`,
                    mentions
                }, { quoted: m });
            } catch (e) {
                await sock.sendMessage(from, { text: '❌ Error!' }, { quoted: m });
            }
            break;
        }

        case 'resend': {
            if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
                await sock.sendMessage(from, { forward: { key: { remoteJid: from, fromMe: false, id: m.message.extendedTextMessage.contextInfo.stanzaId }, message: quoted } });
            } else {
                await sock.sendMessage(from, { text: '❌ Reply pesan yang mau di-resend!' }, { quoted: m });
            }
            break;
        }
    }
};
