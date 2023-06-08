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

      let db = await loadDatabase(bot)
      const gCollection = db.collection('Servers').doc(message.guild.id);  // Collection of guild
      //TODOS : Verify if return current Game ID
      newGameID = await require('../Helpers/findNewGameID').run(gCollection);

      //Verify if monopolyGame object don't exists
      if (!start.monopolyGame) {
        start.monopolyGame = await new MonopolyGame(gCollection, newGameID);
    }

      await start.monopolyGame.join(bot, message);
        }
    }