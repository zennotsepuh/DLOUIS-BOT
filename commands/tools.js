const Helpers = require('../utils/helpers');
const axios = require('axios');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });

    switch (cmd) {
        case 'ebase64': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih text!');
            await reply(`🔐 *BASE64 ENCODE*\n\n${Buffer.from(text).toString('base64')}`);
            break;
        }

        case 'dbase64': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih text!');
            try {
                await reply(`🔓 *BASE64 DECODE*\n\n${Buffer.from(text, 'base64').toString('utf-8')}`);
            } catch (e) {
                await reply('❌ Invalid base64!');
            }
            break;
        }

        case 'ehex': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih text!');
            await reply(`🔐 *HEX ENCODE*\n\n${Buffer.from(text).toString('hex')}`);
            break;
        }

        case 'dhex': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih text!');
            try {
                await reply(`🔓 *HEX DECODE*\n\n${Buffer.from(text, 'hex').toString('utf-8')}`);
            } catch (e) {
                await reply('❌ Invalid hex!');
            }
            break;
        }

        case 'enc':
        case 'dec': {
            await reply(`🔐 *${cmd.toUpperCase()}* - Fitur dalam pengembangan!`);
            break;
        }

        case 'qrcode': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih text!');
            await sock.sendMessage(from, {
                image: { url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}` },
                caption: `✅ QR Code: ${text}`
            }, { quoted: m });
            break;
        }

        case 'shortlink': {
            const url = args[0];
            if (!url) return reply('❌ Kasih URL!');
            await reply(`🔗 *SHORTLINK*\n\n${url}\n\n_Fitur dalam pengembangan_`);
            break;
        }

        case 'translate': {
            const lang = args[0] || 'en';
            const text = args.slice(1).join(' ');
            if (!text) return reply('❌ Format: .translate en Halo');
            try {
                const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${lang}`);
                await reply(`🌐 *TRANSLATE*\n\n📝 Asli: ${text}\n🔤 Hasil: ${res.data.responseData.translatedText}`);
            } catch (e) {
                await reply('❌ Gagal translate!');
            }
            break;
        }

        case 'cekplatform': {
            const platform = from.endsWith('@g.us') ? 'WhatsApp Group' : 'WhatsApp Personal';
            await reply(`📱 *CEK PLATFORM*\n\n${platform}`);
            break;
        }

        case 'kirim': {
            const target = args[0];
            const text = args.slice(1).join(' ');
            if (!target || !text) return reply('❌ Format: .kirim 628xxx pesan');
            await sock.sendMessage(target + '@s.whatsapp.net', { text });
            await reply('✅ Pesan terkirim!');
            break;
        }

        case 'poll': {
            const question = args.join(' ');
            if (!question) return reply('❌ Format: .poll Pertanyaan');
            await sock.sendMessage(from, {
                poll: {
                    name: question,
                    values: ['Ya', 'Tidak', 'Mungkin'],
                    selectableCount: 1
                }
            }, { quoted: m });
            break;
        }

        case 'readmore': {
            const text = args.join(' ');
            if (!text) return reply('❌ Kasih text!');
            await reply(`${text}\n\n> _ini readmore_`);
            break;
        }

        case 'fakereply': {
            await reply('💬 Fake reply fitur dalam pengembangan!');
            break;
        }

        case 'halah':
        case 'heleh':
        case 'hilih':
        case 'holoh':
        case 'huluh': {
            const vokal = cmd[1];
            const text = args.join(' ') || 'halo';
            const result = text.replace(/[aiueo]/gi, vokal);
            await reply(`🔤 *${cmd.toUpperCase()}*\n\n${result}`);
            break;
        }

        case 'readviewonce':
        case 'toviewonce':
        case 'swhd':
        case 'hdsw':
        case 'toquickvideo': {
            await reply(`⚠️ .${cmd} dalam pengembangan!`);
            break;
        }
    }
};
