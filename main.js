const Discord = require('discord.js');
const bot = new Discord.Client({intents: 3276799}); // Mettre les intents autorisés pour que ça marche
const config = require('./token.js');

bot.login(config.token);

