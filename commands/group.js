const Helpers = require('../utils/helpers');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const pushName = m.pushName || 'User';

    if (!isGroup) return;

    const groupMeta = await sock.groupMetadata(from);
    const participant = groupMeta.participants.find(p => p.id === sender);
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    const isBotAdmin = groupMeta.participants.find(p => p.id === sock.user.id)?.admin;

    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });

    switch (cmd) {
        case 'tagall': {
            if (!isAdmin) return reply('❌ Admin only!');
            const text = args.join(' ') || 'Halo semua!';
            const mentions = groupMeta.participants.map(p => p.id);
            let teks = `📢 *TAG ALL*\n\n${text}\n\n`;
            groupMeta.participants.forEach((p, i) => {
                teks += `${i+1}. @${Helpers.cleanNumber(p.id)}\n`;
            });
            await sock.sendMessage(from, { text: teks, mentions }, { quoted: m });
            break;
        }

        case 'hidetag': {
            if (!isAdmin) return reply('❌ Admin only!');
            const text = args.join(' ') || '';
            const mentions = groupMeta.participants.map(p => p.id);
            await sock.sendMessage(from, { text, mentions }, { quoted: m });
            break;
        }

        case 'kick': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                          m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return reply('❌ Tag orangnya!');
            await sock.groupParticipantsUpdate(from, [target], 'remove');
            await reply(`✅ @${Helpers.cleanNumber(target)} ditendang!`);
            break;
        }

        case 'promote': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!target) return reply('❌ Tag orangnya!');
            await sock.groupParticipantsUpdate(from, [target], 'promote');
            await reply(`✅ @${Helpers.cleanNumber(target)} jadi admin!`);
            break;
        }

        case 'demote': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!target) return reply('❌ Tag orangnya!');
            await sock.groupParticipantsUpdate(from, [target], 'demote');
            await reply(`✅ @${Helpers.cleanNumber(target)} di-demote!`);
            break;
        }

        case 'linkgc': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            const code = await sock.groupInviteCode(from);
            await reply(`🔗 *LINK GROUP*\n\nhttps://chat.whatsapp.com/${code}`);
            break;
        }

        case 'revokelink': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            await sock.groupRevokeInvite(from);
            await reply('✅ Link grup di-revoke!');
            break;
        }

        case 'groupinfo': {
            const adminList = groupMeta.participants.filter(p => p.admin).map(p => p.id);
            let teks = `📋 *INFO GROUP*\n\n`;
            teks += `📛 Nama: ${groupMeta.subject}\n`;
            teks += `🆔 ID: ${from}\n`;
            teks += `👥 Member: ${groupMeta.participants.length}\n`;
            teks += `👑 Admin: ${adminList.length}\n`;
            teks += `📝 Desc: ${groupMeta.desc || '-'}\n`;
            await reply(teks);
            break;
        }

        case 'setnamegc': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            const name = args.join(' ');
            if (!name) return reply('❌ Kasih nama!');
            await sock.groupUpdateSubject(from, name);
            await reply('✅ Nama grup diubah!');
            break;
        }

        case 'setdescgc': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            const desc = args.join(' ');
            if (!desc) return reply('❌ Kasih deskripsi!');
            await sock.groupUpdateDescription(from, desc);
            await reply('✅ Deskripsi grup diubah!');
            break;
        }

        case 'mute': {
            if (!isAdmin) return reply('❌ Admin only!');
            if (!isBotAdmin) return reply('❌ Bot bukan admin!');
            await sock.groupSettingUpdate(from, 'announcement');
            await reply('✅ Grup dimute (cuma admin yang bisa chat)');
            break;
        }

        case 'welcome': {
            if (!isAdmin) return reply('❌ Admin only!');
            const g = db.getGroup(from);
            db.setGroup(from, { welcome: !g.welcome });
            await reply(`✅ Welcome: ${!g.welcome ? 'ON' : 'OFF'}`);
            break;
        }

        case 'antilink': {
            if (!isAdmin) return reply('❌ Admin only!');
            const g = db.getGroup(from);
            db.setGroup(from, { antilink: !g.antilink });
            await reply(`✅ Antilink: ${!g.antilink ? 'ON' : 'OFF'}`);
            break;
        }

        case 'antibot': {
            if (!isAdmin) return reply('❌ Admin only!');
            const g = db.getGroup(from);
            db.setGroup(from, { antibot: !g.antibot });
            await reply(`✅ Antibot: ${!g.antibot ? 'ON' : 'OFF'}`);
            break;
        }

        case 'afk': {
            const reason = args.join(' ') || 'AFK';
            db.setUser(sender, { afk: { reason, time: Date.now() } });
            await reply(`💤 ${pushName} sekarang AFK\n📝 Alasan: ${reason}`);
            break;
        }

        case 'warn': {
            if (!isAdmin) return reply('❌ Admin only!');
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!target) return reply('❌ Tag orangnya!');
            const targetUser = db.getUser(target);
            const newWarn = (targetUser.warn || 0) + 1;
            db.setUser(target, { warn: newWarn });
            
            if (newWarn >= 3 && isBotAdmin) {
                await sock.groupParticipantsUpdate(from, [target], 'remove');
                await reply(`⚠️ @${Helpers.cleanNumber(target)} kena warn ke-3, DITENDANG!`);
            } else {
                await reply(`⚠️ @${Helpers.cleanNumber(target)} kena warn!\nTotal: ${newWarn}/3`);
            }
            break;
        }

        case 'delwarn': {
            if (!isAdmin) return reply('❌ Admin only!');
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!target) return reply('❌ Tag orangnya!');
            db.setUser(target, { warn: 0 });
            await reply(`✅ Warn @${Helpers.cleanNumber(target)} di-reset!`);
            break;
        }

        case 'resetwarn': {
            if (!isAdmin) return reply('❌ Admin only!');
            groupMeta.participants.forEach(p => db.setUser(p.id, { warn: 0 }));
            await reply('✅ Semua warn di-reset!');
            break;
        }

        case 'listwarn': {
            const users = db.getUsers();
            let teks = '⚠️ *LIST WARN*\n\n';
            let count = 0;
            for (const jid in users) {
                if (users[jid].warn > 0 && groupMeta.participants.some(p => p.id === jid)) {
                    count++;
                    teks += `${count}. @${Helpers.cleanNumber(jid)} - ${users[jid].warn} warn\n`;
                }
            }
            if (count === 0) teks += 'Tidak ada yang kena warn ✅';
            await sock.sendMessage(from, { text: teks, mentions: groupMeta.participants.map(p => p.id) }, { quoted: m });
            break;
        }

        case 'absen': {
            const teks = `📋 *ABSEN*\n\nReply pesan ini buat absen!\n\n⏰ ${Helpers.getTime()}`;
            await sock.sendMessage(from, { text: teks }, { quoted: m });
            break;
        }

        case 'vote': {
            const question = args.join(' ');
            if (!question) return reply('❌ Format: .vote Pertanyaan');
            await sock.sendMessage(from, { text: `🗳️ *VOTING*\n\n${question}\n\n👍 = Setuju\n👎 = Tidak Setuju` }, { quoted: m });
            break;
        }

        case 'pinmsg': {
            if (!isAdmin) return reply('❌ Admin only!');
            await reply('📌 Fitur pin dalam pengembangan!');
            break;
        }

        case 'leavegc': {
            if (!isAdmin) return reply('❌ Admin only!');
            await reply('👋 Bot keluar dari grup...');
            await sock.groupLeave(from);
            break;
        }

        case 'totag': {
            if (!isAdmin) return reply('❌ Admin only!');
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const text = args.join(' ');
            if (!target) return reply('❌ Tag orangnya!');
            await sock.sendMessage(from, { text: `@${Helpers.cleanNumber(target)} ${text}`, mentions: [target] }, { quoted: m });
            break;
        }
    }
};
