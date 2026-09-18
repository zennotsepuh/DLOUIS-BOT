const Helpers = require('./helpers');
const config = require('./config');
const fs = require('fs-extra');

class Database {
    constructor() {
        this.usersFile = config.dataPath + 'users.json';
        this.premiumFile = config.dataPath + 'premium.json';
        this.groupsFile = config.dataPath + 'groups.json';
        this.settingsFile = config.dataPath + 'settings.json';
        this.initDefaults();
    }

    initDefaults() {
        fs.ensureDirSync(config.dataPath);
        fs.ensureDirSync('./session');
        
        if (!fs.existsSync(this.usersFile)) Helpers.saveJSON(this.usersFile, {});
        if (!fs.existsSync(this.premiumFile)) Helpers.saveJSON(this.premiumFile, []);
        if (!fs.existsSync(this.groupsFile)) Helpers.saveJSON(this.groupsFile, {});
        if (!fs.existsSync(this.settingsFile)) {
            Helpers.saveJSON(this.settingsFile, {
                anticall: false,
                autoread: false,
                autotype: false,
                selfMode: false,
                publicMode: true,
                welcome: true,
                antitoxic: false
            });
        }
    }

    getUsers() { return Helpers.loadJSON(this.usersFile); }
    saveUsers(d) { Helpers.saveJSON(this.usersFile, d); }
    
    getUser(jid) {
        const users = this.getUsers();
        return users[jid] || {
            jid,
            limit: 50,
            balance: 0,
            level: 1,
            xp: 0,
            premium: false,
            banned: false,
            warn: 0,
            afk: null,
            registered: false,
            name: '',
            age: 0
        };
    }
    
    setUser(jid, data) {
        const users = this.getUsers();
        users[jid] = { ...this.getUser(jid), ...data };
        this.saveUsers(users);
        return users[jid];
    }

    getPremium() { return Helpers.loadJSON(this.premiumFile); }
    addPremium(jid) {
        const p = this.getPremium();
        if (!p.includes(jid)) {
            p.push(jid);
            Helpers.saveJSON(this.premiumFile, p);
            return true;
        }
        return false;
    }
    delPremium(jid) {
        const p = this.getPremium();
        const idx = p.indexOf(jid);
        if (idx > -1) {
            p.splice(idx, 1);
            Helpers.saveJSON(this.premiumFile, p);
            return true;
        }
        return false;
    }
    isPremium(jid) { return this.getPremium().includes(jid); }

    getGroups() { return Helpers.loadJSON(this.groupsFile); }
    getGroup(jid) {
        const groups = this.getGroups();
        return groups[jid] || {
            jid,
            welcome: true,
            antilink: false,
            antibot: false,
            mute: false,
            antidelete: false,
            antisticker: false,
            antiviewonce: false
        };
    }
    setGroup(jid, data) {
        const groups = this.getGroups();
        groups[jid] = { ...this.getGroup(jid), ...data };
        Helpers.saveJSON(this.groupsFile, groups);
        return groups[jid];
    }

    getSettings() { return Helpers.loadJSON(this.settingsFile); }
    setSetting(key, value) {
        const s = this.getSettings();
        s[key] = value;
        Helpers.saveJSON(this.settingsFile, s);
        return s;
    }
}

module.exports = Database;
