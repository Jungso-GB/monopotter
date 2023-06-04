const Discord = require('discord.js');
const MonopolyGame = require('../Game/MonopolyGame');
const firebase = require('firebase/app');
require('firebase/firestore');
const loadDatabase = require('../Loader/loadDatabase');

module.exports = {
    name: "start",
    description: "Start a game of Monopoly",
    permission: "Aucune",
    dm: false,
    category: "Monopoly",

    async run(bot, message, args) {

        const createMessage = new Discord.EmbedBuilder()
        .setTitle('MONOPOLY !')
        .setDescription('Come us play to Monopoly !')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .setColor('#0099ff');

        let db = await loadDatabase(bot)

        const gCollection = db.collection('Servers').doc(message.guild.id);  // Collection of guild

        // Verify if party is already in progress
        let gameStatus = (await gCollection.get()).data().gameStatus;

        if (gameStatus !== "NotStarted" && gameStatus !== "Finished") {
            return message.reply("A party is already in progress. Use /cancel to cancel the current party.");
        }
        //To prevent creating a new party during creating of it
        // A ACTIVER UNE FOIS LE START FINI await gCollection.update({ gameStatus: "Creating" });

        //Find the new game ID
        newGameID = await require('../Helpers/findNewGameID').run(gCollection);
    
        
        // Game Instance + createBoard
        const monopolyGame = new MonopolyGame(gCollection, newGameID);
        await monopolyGame.initialize();

        // Information about new game 
        message.channel.send({ embeds: [createMessage] })
        message.reply("Game created successfully.");
        console.log("Game created successfully");
        
        // Inviter les joueurs à rejoindre la partie
                        
        // Afficher les informations initiales du jeu aux joueurs
        
        // Autres étapes de la commande "start"
        }
    }

    // Vérifier si on a toutes les variables


        /*Vérifier si une partie est déjà en cours dans le serveur Discord. 
        Si oui, afficher un message indiquant qu'une partie est déjà en cours et informer les joueurs sur la manière de rejoindre la partie en cours.

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
