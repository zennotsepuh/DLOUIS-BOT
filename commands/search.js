const Helpers = require('../utils/helpers');
const axios = require('axios');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });

    switch (cmd) {
        case 'lirik': {
            const query = args.join(' ');
            if (!query) return reply('❌ Format: .lirik judul lagu');
            try {
                const res = await axios.get(`https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`);
                const song = res.data.data[0];
                if (!song) return reply('❌ Lagu gak ditemukan!');
                const lyrics = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`);
                await reply(`🎵 *${song.title}* - ${song.artist.name}\n\n${lyrics.data.lyrics.substring(0, 4000)}`);
            } catch (e) {
                await reply('❌ Gagal ambil lirik!');
            }
            break;
        }

        case 'artinama': {
            const nama = args.join(' ');
            if (!nama) return reply('❌ Format: .artinama nama');
            await reply(`📛 *ARTI NAMA: ${nama}*\n\nNama ini punya arti yang dalam dan bermakna. Orang dengan nama ini biasanya punya kepribadian kuat dan karismatik.`);
            break;
        }

        case 'alkitab': {
            const query = args.join(' ');
            if (!query) return reply('❌ Format: .alkitab Yohanes 3:16');
            await reply(`📖 *ALKITAB*\n\n${query}\n\n_Fitur dalam pengembangan_`);
            break;
        }

        case 'jadwalshalat': {
            const kota = args.join(' ') || 'jakarta';
            try {
                const res = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(kota)}`);
                if (!res.data.data?.[0]) return reply('❌ Kota gak ditemukan!');
                const kotaId = res.data.data[0].id;
                const today = new Date().toISOString().split('T')[0];
                const jadwal = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${today}`);
                const d = jadwal.data.data.jadwal;
                await reply(`🕌 *JADWAL SHALAT - ${kota.toUpperCase()}*\n\n📅 ${d.tanggal}\n\n🌅 Imsak: ${d.imsak}\n🌄 Subuh: ${d.subuh}\n☀️ Dzuhur: ${d.dzuhur}\n🌤️ Ashar: ${d.ashar}\n🌆 Maghrib: ${d.maghrib}\n🌙 Isya: ${d.isya}`);
            } catch (e) {
                await reply('❌ Gagal ambil jadwal shalat!');
            }
            break;
        }

        case 'alquranaudio': {
            await reply('🎧 *ALQURAN AUDIO*\n\nFitur dalam pengembangan!');
            break;
        }

        case 'brainly': {
            const query = args.join(' ');
            if (!query) return reply('❌ Format: .brainly pertanyaan');
            await reply(`🧠 *BRAINLY*\n\n${query}\n\n_Fitur dalam pengembangan_`);
            break;
        }

        case 'ipchecker': {
            const ip = args[0];
            if (!ip) return reply('❌ Format: .ipchecker 8.8.8.8');
            try {
                const res = await axios.get(`http://ip-api.com/json/${ip}`);
                const d = res.data;
                await reply(`🌐 *IP CHECKER*\n\nIP: ${d.query}\n🌍 Negara: ${d.country}\n🏙️ Kota: ${d.city}\n📡 ISP: ${d.isp}\n📍 Koordinat: ${d.lat}, ${d.lon}\n🕐 Timezone: ${d.timezone}`);
            } catch (e) {
                await reply('❌ Gagal cek IP!');
            }
            break;
        }
    }
};
