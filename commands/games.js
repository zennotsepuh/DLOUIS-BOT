const Helpers = require('../utils/helpers');
const { GamesManager } = require('../utils/games');

const gameManager = new GamesManager();

module.exports = async (sock, m, db, cmd, args) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const pushName = m.pushName || 'User';
    const user = db.getUser(sender);

    const gameMap = {
        asahotak: 'Asah Otak',
        caklontong: 'Cak Lontong',
        siapakahaku: 'Siapakah Aku',
        tekateki: 'Teka Teki',
        tebakkata: 'Tebak Kata',
        susunkata: 'Susun Kata',
        family100: 'Family 100',
        tebakbendera: 'Tebak Bendera',
        tebakbom: 'Tebak Bom'
    };

    if (gameMap[cmd]) {
        if (gameManager.hasActiveGame(from)) {
            return sock.sendMessage(from, { text: '❌ Masih ada game yang jalan! Selesaikan dulu atau ketik .nyerah' }, { quoted: m });
        }
        if (user.limit < 1) {
            return sock.sendMessage(from, { text: '❌ Limit lu abis! Beli dulu pakai .buylimit' }, { quoted: m });
        }

        db.setUser(sender, { limit: user.limit - 1 });
        const question = gameManager.startGame(from, cmd, sender);

        await sock.sendMessage(from, {
            text: `🎮 *${gameMap[cmd]}*\n\n❓ Soal:\n${question}\n\n💡 Ketik jawaban langsung\n⏱️ Waktu: 60 detik\n💰 Hadiah: 10 limit + 100 XP\n\n_Reply pesan ini buat jawab_`
        }, { quoted: m });
    }

    if (cmd === 'nyerah') {
        const answer = gameManager.surrender(from);
        if (!answer) return sock.sendMessage(from, { text: '❌ Gak ada game yang jalan!' }, { quoted: m });
        await sock.sendMessage(from, { text: `🏳️ Lu nyerah!\n\n✅ Jawaban: *${answer}*` }, { quoted: m });
    }

    if (cmd === 'hint') {
        const game = gameManager.activeGames.get(from);
        if (!game) return sock.sendMessage(from, { text: '❌ Gak ada game yang jalan!' }, { quoted: m });
        const hint = String(game.answer).split('').map((c, i) => i === 0 ? c : '_').join(' ');
        await sock.sendMessage(from, { text: `💡 Hint: ${hint}` }, { quoted: m });
    }

    if (cmd === 'math') {
        const a = Helpers.getRandom(1, 100);
        const b = Helpers.getRandom(1, 100);
        const op = Helpers.random(['+', '-', '×']);
        let answer;
        if (op === '+') answer = a + b;
        if (op === '-') answer = a - b;
        if (op === '×') answer = a * b;

        gameManager.activeGames.set(from, {
            type: 'math',
            question: `${a} ${op} ${b} = ?`,
            answer: String(answer),
            sender,
            time: Date.now()
        });

        await sock.sendMessage(from, { text: `🧮 *MATH GAME*\n\n❓ ${a} ${op} ${b} = ?\n\n⏱️ Jawab dalam 60 detik!` }, { quoted: m });
    }

    if (cmd === 'suit') {
        const choices = ['batu', 'gunting', 'kertas'];
        const botChoice = Helpers.random(choices);
        const userChoice = args[0]?.toLowerCase();

        if (!choices.includes(userChoice)) {
            return sock.sendMessage(from, { text: '❌ Pilih: batu, gunting, atau kertas\nContoh: .suit batu' }, { quoted: m });
        }

        let result;
        if (userChoice === botChoice) result = '🤝 SERI!';
        else if (
            (userChoice === 'batu' && botChoice === 'gunting') ||
            (userChoice === 'gunting' && botChoice === 'kertas') ||
            (userChoice === 'kertas' && botChoice === 'batu')
        ) result = '🎉 LU MENANG!';
        else result = '😢 LU KALAH!';

        await sock.sendMessage(from, {
            text: `✊ *SUIT*\n\n👤 Lu: ${userChoice}\n🤖 Bot: ${botChoice}\n\n${result}`
        }, { quoted: m });
    }

    if (cmd === 'dare') {
        const dares = [
            'Kirim foto selfie lu ke grup ini!',
            'Voice note nyanyi lagu Indonesia Raya!',
            'Tag semua member grup dan bilang "aku sayang kalian"',
            'Update status WA "aku lagi galau" selama 1 jam',
            'Kirim screenshot chat terakhir lu ke grup ini'
        ];
        await sock.sendMessage(from, { text: `🎯 *DARE*\n\n${Helpers.random(dares)}` }, { quoted: m });
    }

    if (cmd === 'truth') {
        const truths = [
            'Siapa orang yang paling lu benci di grup ini?',
            'Apa rahasia terbesar lu yang belum pernah diceritain?',
            'Kapan terakhir lu bohong ke orang tua?',
            'Siapa crush lu di grup ini?',
            'Apa hal paling memalukan yang pernah lu lakuin?'
        ];
        await sock.sendMessage(from, { text: `💬 *TRUTH*\n\n${Helpers.random(truths)}` }, { quoted: m });
    }

    if (cmd === 'buylimit') {
        const price = 100;
        if (user.balance < price) {
            return sock.sendMessage(from, { text: `❌ Balance lu kurang! Butuh ${price} balance, lu cuma punya ${user.balance}` }, { quoted: m });
        }
        db.setUser(sender, { balance: user.balance - price, limit: user.limit + 10 });
        await sock.sendMessage(from, { text: `✅ Berhasil beli 10 limit!\n💰 Balance: ${user.balance - price}\n🎯 Limit: ${user.limit + 10}` }, { quoted: m });
    }

    if (cmd === 'tfbalance') {
        const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const amount = parseInt(args[0]);

        if (!target || !amount || amount < 1) {
            return sock.sendMessage(from, { text: '❌ Format: .tfbalance @user 100' }, { quoted: m });
        }
        if (user.balance < amount) {
            return sock.sendMessage(from, { text: '❌ Balance lu kurang!' }, { quoted: m });
        }

        const targetUser = db.getUser(target);
        db.setUser(sender, { balance: user.balance - amount });
        db.setUser(target, { balance: targetUser.balance + amount });

        await sock.sendMessage(from, { text: `✅ Berhasil transfer ${amount} balance ke @${Helpers.cleanNumber(target)}!`, mentions: [target] }, { quoted: m });
    }

    if (cmd === 'redeem') {
        await sock.sendMessage(from, { text: '🎁 Masukkan kode redeem: .redeem KODE' }, { quoted: m });
    }

    if (cmd === 'sloth') {
        const emojis = ['🦥', '🐌', '🐢', '💤', '😴'];
        await sock.sendMessage(from, { text: `🦥 *SLOTH MODE*\n\n${Helpers.random(emojis)} Zzz...` }, { quoted: m });
    }

    if (cmd === 'susunkalimat') {
        await sock.sendMessage(from, { text: '📝 *SUSUN KALIMAT*\n\nSoal: "makan - aku - nasi - suka"\n\nJawab: .susunkalimat aku suka makan nasi' }, { quoted: m });
    }

    if (cmd === 'susunlirik') {
        await sock.sendMessage(from, { text: '🎵 *SUSUN LIRIK*\n\nBentar ya, fitur lagi dikembangin!' }, { quoted: m });
    }

    if (cmd === 'tictactoe') {
        await sock.sendMessage(from, { text: '⭕ *TIC TAC TOE*\n\nFitur dalam pengembangan!' }, { quoted: m });
    }

    if (cmd === 'werewolf2') {
        await sock.sendMessage(from, { text: '🐺 *WEREWOLF*\n\nFitur dalam pengembangan!' }, { quoted: m });
    }
};
