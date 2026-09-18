const Helpers = require('../utils/helpers');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const isMedia = m.message?.imageMessage || quoted?.imageMessage || quoted?.videoMessage;

    switch (cmd) {
        case 'sticker':
        case 'stickerwm':
        case 'stickercircle':
        case 'takesticker': {
            if (!isMedia) return reply('❌ Kirim/reply gambar/video!');
            try {
                let mediaMessage = quoted || m.message;
                let type = mediaMessage.imageMessage ? 'image' : 'video';
                
                const stream = await sock.downloadMediaMessage({ message: mediaMessage, key: m.key });
                const wm = cmd === 'stickerwm' ? args.join(' ') : 'D-LOUIS';
                
                await sock.sendMessage(from, {
                    sticker: stream
                }, { quoted: m });
            } catch (e) {
                await reply('❌ Gagal buat sticker!');
            }
            break;
        }

        case 'toimg': {
            if (!quoted?.stickerMessage) return reply('❌ Reply sticker!');
            try {
                const stream = await sock.downloadMediaMessage({ message: quoted, key: m.key });
                await sock.sendMessage(from, {
                    image: stream,
                    caption: '✅ Sticker to image!'
                }, { quoted: m });
            } catch (e) {
                await reply('❌ Gagal convert!');
            }
            break;
        }
    }
};
