const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const MonopolyGame = require('../Game/MonopolyGame');
const firebase = require('firebase/app');
require('firebase/firestore');
const loadDatabase = require('../Loader/loadDatabase');

module.exports = {
    name: "start",
    description: "Start a game of Monopoly",
    permission: "Aucune",
    dm: false,
    category: "Admin",

    async run(bot, message, args) {

      //Message when party is created
      const embed = new EmbedBuilder()
      .setAuthor({
        name: "Monopotter",
        url: "https://github.com/Jungso-GB",
        //iconURL: "URL",
      })
      .setTitle("New Monopoly !")
      .setDescription("There is a new Monopoly game now ! \n\nTheme:\n``` {{theme}}``` \nPlay during:\n``` {{remainingDays}}``` \n\nBe the best, good luck !")
      //.setImage("https://cubedhuang.com/images/alex-knight-unsplash.webp")
      //.setThumbnail("https://dan.onl/images/emptysong.jpg")
      .setColor("#00b0f4")
      .setFooter({
        text: "Example Footer",
        //iconURL: "https://slate.dan.onl/slate.png",
      })
      .setTimestamp()
      .addFields({
        name: "Join the game !",
        value: "Click the button below to join",
      });

      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('JoinGameButton')
        .setLabel('Join !')
        .setStyle(ButtonStyle.Primary)
      );

      //START OF FUNCTION

        let db = await loadDatabase(bot)

        const gCollection = db.collection('Servers').doc(message.guild.id);  // Collection of guild

        // Verify if party is already in progress
        let gameStatus = (await gCollection.get()).data().gameStatus;

        if (gameStatus !== "NotStarted" && gameStatus !== "Finished") {
            return message.reply("A party is already in progress. Use /join to join or Use /cancel to cancel the current party.");
        }
        //To prevent creating a new party during creating of it
        await gCollection.update({ gameStatus: "Creating" });

        //Find the new game ID
        newGameID = await require('../Helpers/findNewGameID').run(gCollection);
    
        
        // Game Instance + createBoard
        const monopolyGame = new MonopolyGame(gCollection, newGameID);
        await monopolyGame.initialize();

        //Put new game ID in server data
        await gCollection.update({ currentGameID: newGameID });

        // Information and invitation about new game
        await message.reply({ embeds: [embed], components: [button] });
        console.log("Game created successfully");
        await gCollection.update({ gameStatus: "Idle" });

        const collector = message.channel.createMessageComponentCollector();

        collector.on('collect', async interaction => {
          interaction.user.send("You joined the Monopoly ! ")
          await message.channel.send(`@${interaction.user.username} joined the game !`);
        });
                                
        
        // Autres étapes de la commande "start"
        }
    }

    // Vérifier si on a toutes les variables
/*
Si aucune partie n'est en cours, initialiser les variables nécessaires pour démarrer une nouvelle partie.
 Cela peut inclure la création d'une instance de jeu, la création des cases du plateau de jeu, l'attribution d'un montant de départ à chaque joueur, etc.

Inviter les joueurs à rejoindre la partie en utilisant une commande spécifique, par exemple, "!join". 
Les joueurs peuvent rejoindre la partie en utilisant cette commande.

Lorsque tous les joueurs souhaités ont rejoint la partie ou lorsque le temps limite pour rejoindre la partie est écoulé, démarrer officiellement la partie.

Distribuer les 5 dés à chaque joueur. Les joueurs peuvent lancer les dés en utilisant une commande, par exemple, "!roll".

Enregistrer le résultat du lancer de dés de chaque joueur et déterminer la case sur laquelle ils atterrissent.

En fonction de la case sur laquelle un joueur atterrit, exécuter les actions appropriées. Par exemple, si le joueur atterrit sur une propriété non possédée, il peut choisir d'acheter la propriété. Si le joueur atterrit sur une propriété possédée par un autre joueur, il doit payer un loyer.

Mettre à jour les informations du jeu, y compris les propriétés des joueurs, les montants d'argent, etc.

Afficher les informations mises à jour aux joueurs, y compris leur position sur le plateau de jeu, leur solde d'argent, les propriétés qu'ils possèdent, etc.*/
