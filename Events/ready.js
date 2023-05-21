const Discord = require('discord.js');
const loadSlashCommands = require('../Loader/loadSlashCommands');

module.exports = async (bot) => {

    await loadSlashCommands(bot)

    console.log(`${bot.user.tag} is online on ${bot.guilds.size} servers!`);
    bot.user.setActivity(`In Development`);
    bot.user.setStatus('online');
    }