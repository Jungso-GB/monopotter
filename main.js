const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799) // Indents used for the bot
const bot = new Discord.Client({intents});
const loadCommands = require('./Loader/loadCommands');
const config = require('./token.js'); // Put your token in token.js

bot.commands = new Discord.Collection(); // Create collection of commands

bot.login(config.token); // Login to Discord

loadCommands(bot); // Load all commands in collection, to the bot

// When the bot is ready
bot.on("Bot is ready", async () => {
    console.log(`${bot.user.tag} est prêt!`)
});

// Commands
bot.on("messageCreate", async (message) => {
    if(message.content === "!start") 
        return bot.commands.get("start").run(bot, message);
})
