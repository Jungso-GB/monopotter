const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const start = require('../Commands/start'); 
const firebase = require('firebase/app');
require('firebase/firestore');
const loadDatabase = require('../Loader/loadDatabase');

module.exports = {
    name: "join",
    description: "Join the Monopoly !",
    permission: "Aucune",
    dm: false,
    category: "User",

    async run(bot, message, args) {

      await start.monopolyGame.join(bot, message);
        }
    }