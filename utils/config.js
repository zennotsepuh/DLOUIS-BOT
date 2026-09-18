require('dotenv').config();

module.exports = {
    ownerNumber: process.env.OWNER_NUMBER || '6282122997137',
    botName: process.env.BOT_NAME || 'BOT D-LOUIS V.1',
    prefix: process.env.PREFIX || '.',
    version: process.env.VERSION || '1.0.0',
    sessionName: './session',
    menuImage: './src/media/menu.jpg',
    dataPath: './database/'
};
