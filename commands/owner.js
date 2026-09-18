const Helpers = require('../utils/helpers');
const config = require('../utils/config');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const senderNum = Helpers.cleanNumber(sender);
    const isOwner = senderNum === config.ownerNumber;

    if (!isOwner) {
        return sock.sendMessage(from, { text: '❌ Lu bukan owner, asu!' }, { quoted: m });
    }

    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    switch (cmd) {
        case 'addlimit': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 10;
            const t = db.getUser(target);
            db.setUser(target, { limit: t.limit + amount });
            await reply(`✅ +${amount} limit ke @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'dellimit': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 10;
            const t = db.getUser(target);
            db.setUser(target, { limit: Math.max(0, t.limit - amount) });
            await reply(`✅ -${amount} limit dari @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'addbalance': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 100;
            const t = db.getUser(target);
            db.setUser(target, { balance: t.balance + amount });
            await reply(`✅ +${amount} balance ke @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'delbalance': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 100;
            const t = db.getUser(target);
            db.setUser(target, { balance: Math.max(0, t.balance - amount) });
            await reply(`✅ -${amount} balance dari @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'addlevel': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 1;
            const t = db.getUser(target);
            db.setUser(target, { level: t.level + amount });
            await reply(`✅ +${amount} level ke @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'dellevel': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 1;
            const t = db.getUser(target);
            db.setUser(target, { level: Math.max(1, t.level - amount) });
            await reply(`✅ -${amount} level dari @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'addxp': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 100;
            const t = db.getUser(target);
            db.setUser(target, { xp: t.xp + amount });
            await reply(`✅ +${amount} XP ke @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'delxp': {
            if (!target) return reply('❌ Tag orangnya!');
            const amount = parseInt(args[0]) || 100;
            const t = db.getUser(target);
            db.setUser(target, { xp: Math.max(0, t.xp - amount) });
            await reply(`✅ -${amount} XP dari @${Helpers.cleanNumber(target)}`);
            break;
        }

        case 'addpremiumgroup':
        case 'premiumgroup': {
            db.addPremium(from);
            await reply(`✅ Grup ini jadi PREMIUM!`);
            break;
        }

        case 'delpremiumgroup': {
            db.delPremium(from);
            await reply('✅ Grup ini bukan premium lagi!');
            break;
        }

        case 'listpremiumgroup': {
            const premium = db.getPremium();
            let teks = `💎 *LIST PREMIUM GROUP (${premium.length})*\n\n`;
            premium.forEach((p, i) => teks += `${i+1}. ${p}\n`);
            await reply(teks);
            break;
        }

        case 'addpremium': {
            if (!target) return reply('❌ Tag orangnya!');
            db.addPremium(target);
            await reply(`✅ @${Helpers.cleanNumber(target)} jadi PREMIUM!`);
            break;
        }

        case 'delpremium': {
            if (!target) return reply('❌ Tag orangnya!');
            db.delPremium(target);
            await reply(`✅ @${Helpers.cleanNumber(target)} bukan premium lagi!`);
            break;
        }

        case 'resetpremium': {
            db.saveJSON(db.premiumFile, []);
            await reply('✅ Semua premium di-reset!');
            break;
        }

        case 'ban': {
            if (!target) return reply('❌ Tag orangnya!');
            db.setUser(target, { banned: true });
            await reply(`🚫 @${Helpers.cleanNumber(target)} dibanned!`);
            break;
        }

        case 'unban': {
            if (!target) return reply('❌ Tag orangnya!');
            db.setUser(target, { banned: false });
            await reply(`✅ @${Helpers.cleanNumber(target)} di-unban!`);
            break;
        }

        case 'block': {
            if (!target) return reply('❌ Tag orangnya!');
            await sock.updateBlockStatus(target, 'block');
            await reply(`🚫 @${Helpers.cleanNumber(target)} diblokir!`);
            break;
        }

        case 'unblock': {
            if (!target) return reply('❌ Tag orangnya!');
            await sock.updateBlockStatus(target, 'unblock');
            await reply(`✅ @${Helpers.cleanNumber(target)} di-unblock!`);
            break;
        }

        case 'blockpc':
        case 'anticallnoblock':
        case 'anticall':
        case 'autoread':
        case 'autotype': {
            const settings = db.getSettings();
            const current = settings[cmd] || false;
            db.setSetting(cmd, !current);
            await reply(`✅ ${cmd}: ${!current ? 'ON' : 'OFF'}`);
            break;
        }

        case 'self': {
            db.setSetting('publicMode', false);
            await reply('✅ Bot mode: SELF');
            break;
        }

        case 'public': {
            db.setSetting('publicMode', true);
            await reply('✅ Bot mode: PUBLIC');
            break;
        }

        case 'onlygroup': {
            db.setSetting('onlyGroup', true);
            await reply('✅ Only Group mode: ON');
            break;
        }

        case 'onlyprem': {
            db.setSetting('onlyPrem', true);
            await reply('✅ Only Premium mode: ON');
            break;
        }

        case 'onlyindo': {
            db.setSetting('onlyIndo', true);
            await reply('✅ Only Indonesia mode: ON');
            break;
        }

        case 'broadcast':
        case 'bcpc': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih pesannya!');
            const users = db.getUsers();
            let sent = 0;
            for (const jid in users) {
                try {
                    await sock.sendMessage(jid, { text: `📢 *BROADCAST*\n\n${text}` });
                    sent++;
                    await Helpers.delay(2000);
                } catch (e) {}
            }
            await reply(`✅ Broadcast terkirim ke ${sent} user`);
            break;
        }

        case 'bcgroup':
        case 'bcgchidetag': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih pesannya!');
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            let sent = 0;
            for (const g of groups) {
                try {
                    const meta = await sock.groupMetadata(g.id);
                    const mentions = meta.participants.map(p => p.id);
                    await sock.sendMessage(g.id, { text, mentions });
                    sent++;
                    await Helpers.delay(3000);
                } catch (e) {}
            }
            await reply(`✅ BC terkirim ke ${sent}/${groups.length} grup`);
            break;
        }

        case 'join': {
            const link = args[0];
            if (!link) return reply('❌ Kasih link grup!');
            const code = link.split('chat.whatsapp.com/')[1];
            if (!code) return reply('❌ Link invalid!');
            await sock.groupAcceptInvite(code);
            await reply('✅ Berhasil join!');
            break;
        }

        case 'setbio': {
            const bio = args.join(' ');
            await sock.updateProfileStatus(bio);
            await reply('✅ Bio diubah!');
            break;
        }

        case 'setname': {
            const name = args.join(' ');
            await sock.updateProfileName(name);
            await reply('✅ Nama bot diubah!');
            break;
        }

        case 'clearchat': {
            await sock.chatModify({ clear: { messages: [{ id: from, fromMe: true }] } }, from);
            await reply('✅ Chat dibersihkan!');
            break;
        }

        case 'listcommand': {
            const cmds = ['menu', 'ping', 'runtime', 'owner', 'addlimit', 'dellimit', 'addbalance', 'ban', 'unban', 'broadcast'];
            await reply(`📋 *LIST COMMAND*\n\n${cmds.map(c => `• .${c}`).join('\n')}`);
            break;
        }

        case 'listgroupnosewa':
        case 'cekgroupsewa':
        case 'cekgroupcron':
        case 'leaveall':
        case 'leavegcbyid':
        case 'refreshgroupbyid':
        case 'publicbyid':
        case 'selfbyid':
        case 'mutebyid':
        case 'react':
        case 'unreact':
        case 'reactchannel':
        case 'unreactchannel':
        case 'setpp':
        case 'setpppanjang':
        case 'setwrsuit':
        case 'setwrttt':
        case 'createredeem':
        case 'deleteredeem':
        case 'listredeem':
        case 'inforedeem':
        case 'createthumbnail':
        case 'copythumbnail':
        case 'createbutton':
        case 'createfullbutton':
        case 'buttonmode':
        case 'buttontojson':
        case 'testbutton':
        case 'setopenaikey':
        case 'autonexara':
        case 'chatgroup':
        case 'mycontacts':
        case 'grabcontact':
        case 'inviteme':
        case 'golink':
        case 'promoteme':
        case 'bchidetag':
        case 'queue':
        case 'callloop':
        case 'callplay':
        case 'callqueue':
        case 'callskip':
        case 'callstop':
        case 'setcommand':
        case 'addrespon':
        case 'delrespon':
        case 'listrespon':
        case 'resetresponse':
        case 'rawmessage':
        case 'searchmessage':
        case 'setdefaultweltype':
        case 'resetanonymous':
        case 'resetbalance':
        case 'resetlevel':
        case 'resetlimit':
        case 'resetxp':
        case 'createlist':
        case 'createtemplate':
        case 'mutebc':
        case 'bccancel':
        case 'bcconfirm':
        case 'bcstat':
        case 'leavenosewa':
        case 'upres':
        case 'addwarn':
        case 'delwarn':
        case 'globalgamemode':
        case 'levellingpc':
        case 'grouponlypremium':
        case 'pconlyprem':
        case 'claimwibusoftredeem':
        case 'cleangroupcron':
        case 'cleangroupsewa': {
            await reply(`⚠️ Command .${cmd} dalam pengembangan!`);
            break;
        }
    }
};
