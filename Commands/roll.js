const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const start = require('./start'); 
const firebase = require('firebase/app');
const MonopolyGame = require('../Game/MonopolyGame');
require('firebase/firestore');
const loadDatabase = require('../Loader/loadDatabase');

module.exports = {
    name: "roll",
    description: "Roll to play Monopoly !",
    permission: "Aucune",
    dm: false,
    category: "User",

    async run(bot, message, args) {

      const playerName = message.user.displayName

      //Message when party is created
      const embed = new EmbedBuilder()
      .setAuthor({
        name: playerName + " has played !",
        url: "https://github.com/Jungso-GB",
        iconURL: "https://e1.pxfuel.com/desktop-wallpaper/817/583/desktop-wallpaper-monopoly-guy-png-monopoly-guy-png-png-cliparts-on-clipart-library-monopoly-man-logo.jpg",
      })
      /*.setTitle() 
      .setDescription()  DEFINE In command roll*/
      //.setImage("https://cubedhuang.com/images/alex-knight-unsplash.webp")
      .setThumbnail("https://easydrawingguides.com/wp-content/uploads/2022/04/Monopoly-Man-step-by-step-drawing-tutorial-step-10.png")
      .setColor("#8F1A1D")
      .setFooter({
        text: "Monopotter",
        iconURL: "https://toppng.com/uploads/preview/monopoly-collect-win-transparent-background-monopoly-guy-11563049600zctdjngr0t.png",
      })
      .setTimestamp();


      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('Roll')
        .setLabel('Roll again !')
        .setStyle(ButtonStyle.Primary)
      );

      let db = await loadDatabase(bot)
      const gCollection = db.collection('Servers').doc(message.guild.id);  // Collection of guild
      //Return current game ID
      newGameID = await require('../Helpers/findNewGameID').run(gCollection);

      //Verify if monopolyGame object don't exists, if, create it
      if (!start.monopolyGame) {
        start.monopolyGame = await new MonopolyGame(gCollection, newGameID);
    }
    
      await start.monopolyGame.roll(bot, message, embed);
        
        // Message
         // Information and invitation about new game
        setTimeout(() => {
          message.channel.send({ embeds: [embed], components: [button] });
        }, 2000);
        
        //await gCollection.update({ gameStatus: "Idle" });

        //Waiting interaction of user.

        // Collect event of message
        const collector = message.channel.createMessageComponentCollector();

        collector.on('collect', async (interaction) => {
          if (interaction.customId === 'JoinGameButton') {
            await monopolyGame.join(bot, interaction);
          }
        });

    }
  }