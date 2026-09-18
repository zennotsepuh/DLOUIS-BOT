const Helpers = require('../utils/helpers');
const config = require('../utils/config');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const user = db.getUser(sender);
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });

    switch (cmd) {
        case 'profile':
        case 'balance':
        case 'limit': {
            const bal = cmd === 'balance' ? user.balance : (cmd === 'limit' ? user.limit : null);
            await reply(`👤 *PROFILE*\n\n📛 Nama: ${m.pushName}\n📱 Nomor: ${Helpers.cleanNumber(sender)}\n💰 Balance: ${user.balance}\n🎯 Limit: ${user.limit}\n⭐ Level: ${user.level}\n🔮 XP: ${user.xp}\n💎 Premium: ${db.isPremium(sender) ? 'Ya' : 'Tidak'}`);
            break;
        }

        case 'cekpremium': {
            const isPrem = db.isPremium(sender);
            await reply(`💎 *STATUS PREMIUM*\n\n${isPrem ? '✅ Lu PREMIUM!' : '❌ Lu bukan premium'}`);
            break;
        }

        case 'listpremium': {
            const premium = db.getPremium();
            let teks = `💎 *LIST PREMIUM (${premium.length})*\n\n`;
            premium.forEach((p, i) => {
                teks += `${i+1}. @${Helpers.cleanNumber(p)}\n`;
            });
            await sock.sendMessage(from, { text: teks, mentions: premium }, { quoted: m });
            break;
        }

        case 'listban': {
            const users = db.getUsers();
            let teks = '🚫 *LIST BANNED*\n\n';
            let count = 0;
            for (const jid in users) {
                if (users[jid].banned) {
                    count++;
                    teks += `${count}. @${Helpers.cleanNumber(jid)}\n`;
                }
            }
            if (count === 0) teks += 'Tidak ada yang dibanned ✅';
            await reply(teks);
            break;
        }

        case 'listblock': {
            await reply('🚫 *LIST BLOCK*\n\nFitur dalam pengembangan!');
            break;
        }

        case 'listgroup': {
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            let teks = `📋 *LIST GROUP (${groups.length})*\n\n`;
            groups.forEach((g, i) => {
                teks += `${i+1}. ${g.subject}\n   ID: ${g.id}\n\n`;
            });
            await reply(teks);
            break;
        }

        case 'status': {
            await reply(`🟢 *STATUS BOT*\n\n✅ Online\n⏰ Uptime: ${Helpers.getRuntime()}\n🧠 RAM: ${Helpers.getRAM()}\n🕐 Time: ${Helpers.getTime()}`);
            break;
        }

        case 'infogempa': {
            try {
                const axios = require('axios');
                const res = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
                const gempa = res.data.Infogempa.gempa;
                await reply(`🌋 *INFO GEMPA*\n\n📅 Tanggal: ${gempa.Tanggal}\n🕐 Jam: ${gempa.Jam}\n📍 Lokasi: ${gempa.Wilayah}\n📊 Magnitude: ${gempa.Magnitude} SR\n🌊 Kedalaman: ${gempa.Kedalaman}\n⚠️ Potensi: ${gempa.Potensi}`);
            } catch (e) {
                await reply('❌ Gagal ambil data gempa!');
            }
            break;
        }

        case 'cekchannel': {
            await reply('📢 *CEK CHANNEL*\n\nFitur dalam pengembangan!');
            break;
        }

        case 'report': {
            const text = args.join(' ');
            if (!text) return reply('❌ Format: .report pesan lu');
            await reply(`✅ Report terkirim ke owner!\n\n📝 Pesan: ${text}`);
            break;
        }

        case 'topglobal':
        case 'toplocal': {
            const users = db.getUsers();
            const arr = Object.values(users).sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 10);
            let teks = `🏆 *TOP ${cmd === 'topglobal' ? 'GLOBAL' : 'LOCAL'}*\n\n`;
            arr.forEach((u, i) => {
                const medal = ['🥇', '🥈', '🥉'][i] || `${i+1}.`;
                teks += `${medal} @${Helpers.cleanNumber(u.jid)} - ${u.xp || 0} XP\n`;
            });
            await sock.sendMessage(from, { text: teks, mentions: arr.map(u => u.jid) }, { quoted: m });
            break;
        }

        case 'kodebahasa': {
            await reply('💻 *KODE BAHASA*\n\n• js - JavaScript\n• py - Python\n• php - PHP\n• java - Java\n• cpp - C++\n• rb - Ruby\n• go - Go\n• rs - Rust');
            break;
        }

        case 'infocovid': {
            await reply('🦠 *INFO COVID*\n\nFitur dalam pengembangan!');
            break;
        }

        case 'infounsur': {
            await reply('📊 *INFO UNSUR*\n\nFitur dalam pengembangan!');
            break;
        }
    }
};
