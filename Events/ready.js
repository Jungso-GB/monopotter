const Discord = require('discord.js');
const loadSlashCommands = require('../Loader/loadSlashCommands');

module.exports = async (bot) => {

    await loadSlashCommands(bot)

    console.log(`${bot.user.tag} is ready`);

}