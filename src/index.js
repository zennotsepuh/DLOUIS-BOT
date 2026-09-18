const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, jidDecode } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const fs = require('fs-extra');
const NodeCache = require('node-cache');

const config = require('./utils/config');
const Helpers = require('./utils/helpers');
const Database = require('./utils/database');

const generalCmd = require('./commands/general');
const gamesCmd = require('./commands/games');
const groupCmd = require('./commands/group');
const infoCmd = require('./commands/info');
const ownerCmd = require('./commands/owner');
const randomCmd = require('./commands/random');
const searchCmd = require('./commands/search');
const stickerCmd = require('./commands/sticker');
const toolsCmd = require('./commands/tools');

const db = new Database();
const msgRetryCounterCache = new NodeCache();

// Daftar command handler
const commands = {
    general: ['menu', 'help', 'ping', 'runtime', 'owner', 'sender', 'infobot', 'version', 'changelog', 'everyone', 'resend'],
    games: ['asahotak', 'buylimit', 'caklontong', 'dare', 'family100', 'hint', 'math', 'nyerah', 'redeem', 'siapakahaku', 'sloth', 'suit', 'susunkalimat', 'susunkata', 'susunlirik', 'tebakbendera', 'tebakbom', 'tebakkata', 'tekateki', 'tfbalance', 'tictactoe', 'truth', 'werewolf2'],
    group: ['absen', 'add', 'addwhitelist', 'afk', 'antibot', 'antidelete', 'antigroupsw', 'antikudeta', 'antilink', 'antilinkchannel', 'antilinknokick', 'antilinkuniversal', 'antiluar', 'antimentionsw', 'antisticker', 'antiviewonce', 'antiwame', 'antiwamenokick', 'cekabsen', 'cekidgroup', 'cekwarn', 'delete', 'deleteabsen', 'delwarn', 'delwhitelist', 'demote', 'demotedetector', 'descgc', 'groupadmin', 'groupinfo', 'groupsetting', 'hidetag', 'kick', 'kickme', 'leavegc', 'left', 'levelling', 'linkgc', 'listwarn', 'listwhitelist', 'mulaiabsen', 'mute', 'pinmsg', 'promote', 'promotedetector', 'refreshgroup', 'reqjoin', 'resetwarn', 'revokelink', 'setdescgc', 'setnamegc', 'setppgc', 'setppgcpanjang', 'setwarn', 'tagall', 'totag', 'unpinmsg', 'vote', 'warn', 'welcome'],
    info: ['balance', 'cekchannel', 'cekpremium', 'infocovid', 'infogempa', 'infounsur', 'kodebahasa', 'limit', 'listban', 'listblock', 'listgroup', 'listpremium', 'profile', 'report', 'status', 'topglobal', 'toplocal'],
    owner: ['addbalance', 'addlevel', 'addlimit', 'addpremiumgroup', 'addrespon', 'addxp', 'anticall', 'anticallnoblock', 'antideletepc', 'autonexara', 'autoread', 'autotype', 'ban', 'bccancel', 'bcconfirm', 'bcgchidetag', 'bcgroup', 'bchidetag', 'bcpc', 'bcstat', 'block', 'blockpc', 'broadcast', 'buttonmode', 'buttontojson', 'callloop', 'callplay', 'callqueue', 'callskip', 'callstop', 'cekgroupcron', 'cekgroupsewa', 'chatgroup', 'claimwibusoftredeem', 'cleangroupcron', 'cleangroupsewa', 'clearchat', 'copythumbnail', 'createbutton', 'createfullbutton', 'createlist', 'createredeem', 'createtemplate', 'createthumbnail', 'delbalance', 'deleteredeem', 'dellevel', 'dellimit', 'delpremiumgroup', 'delrespon', 'delxp', 'globalgamemode', 'golink', 'grabcontact', 'grouponlypremium', 'inforedeem', 'inviteme', 'join', 'leaveall', 'leavegcbyid', 'leavenosewa', 'levellingpc', 'listcommand', 'listgroupnosewa', 'listpremiumgroup', 'listredeem', 'listrespon', 'mutebc', 'mutebyid', 'mycontacts', 'onlygroup', 'onlyindo', 'onlyprem', 'pconlyprem', 'premiumgroup', 'promoteme', 'public', 'publicbyid', 'queue', 'rawmessage', 'react', 'reactchannel', 'refreshgroupbyid', 'resetanonymous', 'resetbalance', 'resetlevel', 'resetlimit', 'resetpremium', 'resetresponse', 'resetxp', 'searchmessage', 'self', 'selfbyid', 'setbio', 'setcommand', 'setdefaultweltype', 'setname', 'setopenaikey', 'setpp', 'setpppanjang', 'setwrsuit', 'setwrttt', 'testbutton', 'unban', 'unblock', 'unreact', 'unreactchannel', 'upres', 'addpremium', 'delpremium'],
    random: ['alay', 'apakah', 'cekkhodam', 'faktaunik', 'jadian', 'kapankah', 'katabijak', 'pantun', 'puisi', 'randomanime', 'randomnumber', 'randomtag', 'rate', 'siapakah'],
    search: ['alkitab', 'alquranaudio', 'artinama', 'brainly', 'ipchecker', 'jadwalshalat', 'lirik'],
    sticker: ['sticker', 'stickercircle', 'stickerwm', 'takesticker', 'toimg'],
    tools: ['cekplatform', 'dbase64', 'dec', 'dhex', 'ebase64', 'ehex', 'enc', 'fakereply', 'halah', 'hdsw', 'heleh', 'hilih', 'holoh', 'huluh', 'kirim', 'poll', 'qrcode', 'readmore', 'readviewonce', 'shortlink', 'swhd', 'toquickvideo', 'toviewonce', 'translate']
};

const commandHandlers = {
    general: generalCmd,
    games: gamesCmd,
    group: groupCmd,
    info: infoCmd,
    owner: ownerCmd,
    random: randomCmd,
    search: searchCmd,
    sticker: stickerCmd,
    tools: toolsCmd
};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['D-LOUIS BOT', 'Chrome', '1.0.0'],
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(chalk.yellow('\n📱 SCAN QR CODE:\n'));
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('❌ Koneksi terputus!'), shouldReconnect ? 'Reconnecting...' : 'Logged out!');
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green(`
╔══════════════════════════════════════╗
║     ✨ 𝐁𝐎𝐓 𝐃-𝐋𝐎𝐔𝐈𝐒 𝐕.𝟏 ✨          ║
║                                      ║
║  ✅ BOT CONNECTED!                   ║
║  👑 Owner: ${config.ownerNumber}              ║
║  🤖 Bot: ${config.botName}          ║
║  ⚡ Prefix: ${config.prefix}                          ║
║  📦 Version: ${config.version}                      ║
║  🟢 Status: ONLINE                   ║
╚══════════════════════════════════════╝
`));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            if (m.key.fromMe) return;

            const from = m.key.remoteJid;
            if (from === 'status@broadcast') return;
            if (from.endsWith('@newsletter')) return;

            const sender = m.key.participant || m.key.remoteJid;
            const senderNum = Helpers.cleanNumber(sender);
            const isOwner = senderNum === config.ownerNumber;

            const messageType = Object.keys(m.message)[0];
            let text = '';
            if (messageType === 'conversation') text = m.message.conversation;
            else if (messageType === 'extendedTextMessage') text = m.message.extendedTextMessage.text;
            else if (messageType === 'imageMessage') text = m.message.imageMessage.caption || '';
            else if (messageType === 'videoMessage') text = m.message.videoMessage.caption || '';

            if (!text) return;
            if (!text.startsWith(config.prefix)) return;

            const args = text.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            console.log(chalk.cyan(`📩 [${Helpers.getTime()}] ${m.pushName}: ${text}`));

            // Cek banned
            const user = db.getUser(sender);
            if (user.banned && !isOwner) {
                return sock.sendMessage(from, { text: '🚫 Lu dibanned!' }, { quoted: m });
            }

            // Cari handler
            for (const [category, cmdList] of Object.entries(commands)) {
                if (cmdList.includes(command)) {
                    await commandHandlers[category](sock, m, db, command, args);
                    break;
                }
            }
        } catch (e) {
            console.error('Error:', e);
        }
    });
}

console.log(chalk.green(`
╔══════════════════════════════════════╗
║   ✨ 𝐁𝐎𝐓 𝐃-𝐋𝐎𝐔𝐈𝐒 𝐕.𝟏 ✨           ║
║                                      ║
║  🚀 Starting bot...                  ║
║  ⚡ Prefix: ${config.prefix}                          ║
║  📦 Version: ${config.version}                      ║
╚══════════════════════════════════════╝
`));

startBot().catch(e => console.error('Fatal:', e));

process.on('uncaughtException', (e) => console.error('Uncaught:', e));
process.on('unhandledRejection', (e) => console.error('Unhandled:', e));
