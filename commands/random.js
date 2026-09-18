const Helpers = require('../utils/helpers');

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: m });

    switch (cmd) {
        case 'alay': {
            const text = args.join(' ') || 'halo';
            const alay = text.split('').map(c => {
                const alayMap = { a: '4', b: '8', e: '3', g: '6', i: '1', o: '0', s: '5', t: '7' };
                const lower = c.toLowerCase();
                if (alayMap[lower]) return Math.random() > 0.5 ? alayMap[lower] : lower.toUpperCase();
                return c;
            }).join('');
            await reply(`🔤 *ALAY*\n\n${alay}`);
            break;
        }

        case 'apakah': {
            const question = args.join(' ') || 'Aku ganteng?';
            const answers = ['Iya', 'Tidak', 'Mungkin', 'Bisa jadi', 'Tentu saja', 'Tidak mungkin', 'Coba lagi nanti', 'Rahasia'];
            await reply(`❓ *${question}*\n\n🎱 Jawaban: ${Helpers.random(answers)}`);
            break;
        }

        case 'cekkhodam': {
            const khodams = ['🐉 Naga Hitam', '🐅 Macan Putih', '🦅 Elang Jawa', '🐍 Ular Sakti', '👻 Jin Penjaga', '🔥 Garuda Emas', '🌊 Ratu Laut Selatan'];
            await reply(`🔮 *KHODAM LU*\n\n${Helpers.random(khodams)}\n\n_Khodam gak jelas, jangan dipercaya_`);
            break;
        }

        case 'faktaunik': {
            const fakta = [
                '🐙 Gurita punya 3 jantung',
                '🍯 Madu gak pernah basi',
                '🦈 Hiu lebih tua dari pohon',
                '🐌 Siput bisa tidur 3 tahun',
                '🌙 Bulan menjauh 3.8cm/tahun'
            ];
            await reply(`📚 *FAKTA UNIK*\n\n${Helpers.random(fakta)}`);
            break;
        }

        case 'jadian': {
            const persen = Helpers.getRandom(1, 100);
            await reply(`💕 *PERSENTASE JADIAN*\n\n${persen}% 💖`);
            break;
        }

        case 'kapankah': {
            const answers = ['Besok', 'Minggu depan', 'Bulan depan', 'Tahun depan', 'Gak akan', 'Pas bulan purnama', 'Setelah hujan'];
            await reply(`🔮 *KAPANKAH?*\n\n${Helpers.random(answers)}`);
            break;
        }

        case 'katabijak': {
            const kata = [
                'Jangan takut gagal, takutlah gak pernah nyoba',
                'Hidup kayak sepeda, kalo berhenti jatuh',
                'Kesuksesan dimulai dari mimpi',
                'Jangan jadi orang yang nyesel di akhir'
            ];
            await reply(`💭 *KATA BIJAK*\n\n${Helpers.random(kata)}`);
            break;
        }

        case 'pantun': {
            const pantun = [
                'Buah mangga buah kedondong\nManis rasanya di dalam mulut\nKalo kamu lagi ngoding\nJangan lupa istirahat dulu',
                'Ke pasar beli terasi\nPulangnya mampir ke rumah Lina\nRajin-rajinlah belajar ngaji\nBiar hidupmu penuh berkah'
            ];
            await reply(`🎭 *PANTUN*\n\n${Helpers.random(pantun)}`);
            break;
        }

        case 'puisi': {
            const puisi = [
                'Codingan malam\nBintang menemani\nError menghantui\nHati pun gundah',
                'Dalam sunyi malam\nAku termenung sendiri\nMemikirkan hari esok\nYang belum pasti'
            ];
            await reply(`📝 *PUISI*\n\n${Helpers.random(puisi)}`);
            break;
        }

        case 'randomanime': {
            const animes = ['Naruto', 'One Piece', 'Jujutsu Kaisen', 'Demon Slayer', 'Attack on Titan', 'My Hero Academia', 'Tokyo Revengers', 'Bleach'];
            await reply(`🎌 *ANIME RANDOM*\n\n${Helpers.random(animes)}`);
            break;
        }

        case 'randomnumber': {
            const min = parseInt(args[0]) || 1;
            const max = parseInt(args[1]) || 100;
            await reply(`🎲 *RANDOM NUMBER*\n\n${Helpers.getRandom(min, max)}`);
            break;
        }

        case 'randomtag': {
            if (!from.endsWith('@g.us')) return reply('❌ Grup only!');
            const meta = await sock.groupMetadata(from);
            const random = Helpers.random(meta.participants);
            await reply(`🎯 *RANDOM TAG*\n\n@${Helpers.cleanNumber(random.id)}`);
            break;
        }

        case 'rate': {
            const target = args.join(' ') || 'Sesuatu';
            const rate = Helpers.getRandom(1, 100);
            const emoji = rate > 80 ? '🔥' : rate > 50 ? '👍' : '😐';
            await reply(`⭐ *RATE*\n\n${target}\n\n${emoji} ${rate}/100`);
            break;
        }

        case 'siapakah': {
            if (!from.endsWith('@g.us')) return reply('❌ Grup only!');
            const meta = await sock.groupMetadata(from);
            const random = Helpers.random(meta.participants);
            const question = args.join(' ') || 'yang paling ganteng?';
            await reply(`❓ *${question}*\n\n👉 @${Helpers.cleanNumber(random.id)}`);
            break;
        }
    }
};
