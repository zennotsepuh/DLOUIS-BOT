const Helpers = require('./helpers');

const gamesData = {
    asahotak: [
        { q: "Hewan apa yang bisa terbang?", a: "burung" },
        { q: "Ibu kota Indonesia?", a: "jakarta" },
        { q: "Planet terdekat matahari?", a: "merkurius" },
    ],
    caklontong: [
        { q: "Kenapa bebek kalau jalan goyang?", a: "karena dikejar ayam" },
        { q: "Apa yang selalu ada di hati?", a: "tulisan 'hati'" },
    ],
    siapakahaku: [
        { q: "Aku punya 4 kaki, bisa jalan. Siapakah aku?", a: "kursi" },
        { q: "Aku punya wajah tapi gak punya mata. Siapakah aku?", a: "jam" },
    ],
    tekateki: [
        { q: "Apa yang kalau dipotong malah tambah tinggi?", a: "celana" },
        { q: "Bisa dilihat tapi gak bisa disentuh?", a: "pelangi" },
    ],
    tebakkata: [
        { q: "K_T_ (hewan air)", a: "kutu" },
        { q: "B_K_ (kendaraan)", a: "buku" },
    ],
    susunkata: [
        { q: "M-A-K-A-N", a: "makan" },
        { q: "T-I-D-U-R", a: "tidur" },
    ],
    family100: [
        { q: "Sebutkan makanan khas Indonesia", a: ["rendang", "sate", "nasi goreng"] },
    ],
    tebakbendera: [
        { q: "🇮🇩 Bendera apa?", a: "indonesia" },
        { q: "🇯🇵 Bendera apa?", a: "jepang" },
    ],
    tebakbom: [
        { q: "1+1=?", a: "2" },
        { q: "5x5=?", a: "25" },
    ]
};

class GamesManager {
    constructor() {
        this.activeGames = new Map();
    }

    startGame(chatId, type, sender) {
        const list = gamesData[type];
        if (!list) return null;

        const picked = Helpers.random(list);
        this.activeGames.set(chatId, {
            type,
            question: picked.q,
            answer: picked.a,
            sender,
            time: Date.now()
        });

        return picked.q;
    }

    checkAnswer(chatId, answer) {
        const game = this.activeGames.get(chatId);
        if (!game) return null;

        const userAnswer = answer.toLowerCase().trim();
        const correct = String(game.answer).toLowerCase();

        if (Array.isArray(game.answer)) {
            if (game.answer.some(a => a.toLowerCase() === userAnswer)) {
                this.activeGames.delete(chatId);
                return { correct: true, answer: game.answer[0] };
            }
        } else if (userAnswer === correct) {
            this.activeGames.delete(chatId);
            return { correct: true, answer: game.answer };
        }

        return { correct: false };
    }

    surrender(chatId) {
        const game = this.activeGames.get(chatId);
        if (!game) return null;
        this.activeGames.delete(chatId);
        return game.answer;
    }

    hasActiveGame(chatId) {
        return this.activeGames.has(chatId);
    }
}

module.exports = { GamesManager, gamesData };
