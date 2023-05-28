//Load Env variables
require('dotenv').config();
const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799) // Indents used for the bot
const bot = new Discord.Client({intents});
const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const loadDatabase = require('./Loader/loadDatabase');

bot.color = "#95A5A6" // Set bot color
bot.db = loadDatabase(); // Database

bot.commands = new Discord.Collection(); // Create collection of commands
bot.function = {
    linkGuildDB: require('./Functions/linkGuildToDB')
}

bot.login(process.env.TOKEN); // Login to Discord

loadCommands(bot); // Load all commands in collection, to the bot
loadEvents(bot); // Load all commands in collection, to the bot
loadDatabase(); // Database load /! DEFAULT: FIREBASE SYSTEM

console.log("Database Loaded successfully")

//When bot join a guild
bot.on('guildCreate', async (guild) => {
    await bot.function.linkGuildDB(bot, guild);
});
