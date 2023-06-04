/* Ideas: 
- Ping people at 8PM to remember to play
*/
/* TODOS:
Ligne 29 - A activer quand commande start finie
*/

require('dotenv').config();
const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799) // Indents used for the bot
const bot = new Discord.Client({intents});

const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const loadDatabase = require('./Loader/loadDatabase');


bot.color = "#95A5A6" // Set bot color

bot.commands = new Discord.Collection(); // Create collection of commands
bot.function = {
    //All functions of bot should go here
    linkGuildDB: require('./Helpers/linkGuildToDB')
}

bot.login(process.env.TOKEN); // Login to Discord

bot.db = loadDatabase()

loadCommands(bot); // Load all commands in collection, to the bot
loadEvents(bot); // Load all commands in collection, to the bot

//When bot join a guild
bot.on('guildCreate', async (guild) => {
    await bot.function.linkGuildDB(bot, guild);
});
