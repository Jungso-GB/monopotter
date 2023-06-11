const admin = require('firebase');
const discord = require('discord.js');
class MonopolyGame {
    constructor(gCollection, GameID) {
        this.gCollection = gCollection;
        this.GameID = GameID;
    }
    
    // To be async. Call it by .initialize()
    async initialize(){
        //Create the game's structure in database
        const GameCollection = this.gCollection.collection('games').doc(newGameID.toString())

      //Get current admin variable in new game
      const init_variables = {
        ID : parseInt(await GameCollection.id),
        gameStatus : "NotStarted", //"NotStarted", "InGame => When player is playing", "Idle => Waiting player play", "Finished"
        currentPlayer : "none",
        // Variables admin
        language : (await this.gCollection.get()).data().admin_Language,
        theme : (await this.gCollection.get()).data().admin_Theme,
        diceRoll : (await this.gCollection.get()).data().admin_diceRoll,
        rawSize : (await this.gCollection.get()).data().admin_rawSize,
        chancePercentage : (await this.gCollection.get()).data().admin_chancePercentage,
        communityPercentage : (await this.gCollection.get()).data().admin_communityPercentage,
        remainingDays : (await this.gCollection.get()).data().admin_PlayTime,
        maxPlayers : (await this.gCollection.get()).data().admin_MaxPlayers    
      }
      // Push admin variable to firebase
      GameCollection.set(init_variables)
    
      // Create board
      await this.createBoard(GameCollection);
      await GameCollection.update({ gameStatus: "Idle" });

      // Autres propriétés de l'instance du jeu
    }

    // PLAYER WANT JOIN THE PARTY
    async join(bot, messageOrInteraction) {
      try {

        let user
        let userId
        let interactionId

        //Verify if you have message or interaction in args
        if (messageOrInteraction instanceof discord.CommandInteraction) {
          interactionId = 1 
          user = messageOrInteraction.user;
          userId = messageOrInteraction.user.id;
          console.log("message")
        } else if (messageOrInteraction.isCommand()) {
          interactionId = 2
          user = messageOrInteraction.user;
          userId = messageOrInteraction.user.id;
          console.log("Interaction")
        }else{
          interactionId = 3
          user = messageOrInteraction.user;
          userId = messageOrInteraction.user.id;
          //throw new Error("Unsupported interaction type: " + messageOrInteraction.type + " MUST BE Messsage or Interaction")
        }

        // Select collection of current game AND take gameStatus
        const GameCollection = await this.gCollection.collection('games').doc(this.GameID.toString());
        let gameStatus = (await GameCollection.get()).data().gameStatus;

        //const GameCollection = this.gCollection.collection('games').doc((this.gCollection.get()).data().currentGameID.toString());
    
        // Verify status of current game
        if (gameStatus !== "InGame" && gameStatus !== "Idle") {
          return messageOrInteraction.reply({content: "No party is currently in progress. Use /start to create a party.", ephemeral: true}); true
        }

        //Take all data with The member DiscordID
        const query = GameCollection.collection('players').where('discordID', '==', userId);
        const snapshot = await query.get();
    
        // If userID is found in the collection of the current game
        if (!snapshot.empty) {
          return messageOrInteraction.reply({content: "You're already in a current game", ephemeral : true});
        }
        
        //Add player to collection 'players' in the game collection
        const playersCollectionRef = GameCollection.collection('players')
        //Put DiscordID and first dice
        await playersCollectionRef.doc(userId).set({discordID : userId, dice : (await GameCollection.get()).data().diceRoll});

        // CONTINUER LE JOIN

        return messageOrInteraction.reply({ content: "You joined the Monopoly", ephemeral: true})
    
      } catch (error) {
        console.error("Error in join:", error);
        // Traitez l'erreur ici (par exemple, envoyez un message d'erreur à l'utilisateur ou effectuez une autre action appropriée)
      }
    }

    async roll(bot, message) {

      // Select collection of current game AND take gameStatus
      const GameCollection = await this.gCollection.collection('games').doc(this.GameID.toString());
      let gameStatus = (await GameCollection.get()).data().gameStatus;
  
      // Verify status of current game
      if (gameStatus !== "InGame" && gameStatus !== "Idle") {
        return message.reply({content: "No party is currently in progress. Use /start to create a party.", ephemeral: true});
      }

      //Take all data with The member DiscordID
      const query = GameCollection.collection('players').where('discordID', '==', message.user.id);
      const snapshot = await query.get();
  
      // If userID is not found in the collection of the current game
      if (snapshot.empty) {
        return message.reply({content: "You're not in the game. Use /join to join the Monopoly", ephemeral: true});
      }

      const boardRef = GameCollection.collection('board').doc('places').collection('places');

      // Définir un tableau vide "board"
      const board = [];
  
      // Récupérer tous les documents de la collection "places"
      const querySnapshot = await boardRef.get();
  
      // Parcourir les documents et ajouter les données à "board"
      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        board.push(data);
      });
  
      // Utiliser le tableau "board" pour effectuer les opérations nécessaires
      console.log("Board:", board);

    }

    

/*

    HELPERS OF CLASS

*/

    async createBoard(GameCollection) {
      const settings = require('../Data/settings.json');
      //Take language 
      const language = (await GameCollection.get()).data().language
      //Define theme
      const theme = (await GameCollection.get()).data().theme

      //If it's not valid theme
      if(!Object.values(settings.themes).includes(theme)){
        console.log("Theme not valid:" + (await GameCollection.get()).data().theme + " -> default theme");
        //Select default theme
        let dataJSON = ('../Data/default_' + language + ".json")
      }else{
      //Select theme
      let dataJSON = ('../Data/' + theme + "_" + language + ".json")
      }

      // Define variables by GameCollection
      let rawSize = (await GameCollection.get()).data().rawSize;
      let chancePercentage = (await GameCollection.get()).data().chancePercentage;
      let communityPercentage = (await GameCollection.get()).data().communityPercentage;

      // Create the board
      const board = await this.generateBoard(rawSize, chancePercentage, communityPercentage)

      // Put board in database
      // Verify if sub-collection board exists
      const boardCollectionRef = GameCollection.collection('board');
      const boardCollectionSnapshot = await boardCollectionRef.get();

      // If not, create it. => Necessary to put the board in sub-collection 'places'
      if (boardCollectionSnapshot.empty) {
        // La sous-collection "board" n'existe pas, la créer
        await boardCollectionRef.doc('information').set({toDefine : true});
      }

      // Put board in database
      await boardCollectionRef.doc('places').set(board);

  }

  async generateBoard(rawSize, chancePercentage, communityPercentage) {
    const board = {};
    
    let waterCaseExists = false;
    let energyCaseExists = false;
    let taxesCaseExists = false;

    // First raw
    board[1] = "GO";
    await this.generateRaw(rawSize, 2, chancePercentage, communityPercentage, board)

    // Second raw
    board[rawSize] = "Jail";
    await this.generateRaw(rawSize * 2, rawSize + 1, chancePercentage, communityPercentage, board)

    // Third raw
    board[rawSize * 2] = "Free Park";
    await this.generateRaw(rawSize * 3, (rawSize * 2 + 1), chancePercentage, communityPercentage, board)

    // Fourth raw
    board[rawSize * 3] = "Go To Jail";
    await this.generateRaw(rawSize * 4, (rawSize * 3 + 1), chancePercentage, communityPercentage, board)
    
    return board;
  }

  async generateRaw(rawSize, startCase, chancePercentage, communityPercentage, board){

    // Add places on raw
    for (let i = startCase; i <= rawSize - 1; i++) {
      board[i] = (await this.generateCase(i, chancePercentage, communityPercentage));
    }
  }
  
  async generateCase(position, chancePercentage, communityPercentage) {
    const randomValue = Math.random() * 100

    // Water place
    if (!this.generateBoard.waterCaseExists && randomValue < chancePercentage) {
      this.generateBoard.waterCaseExists = true;
      return 'Water';
      //Chance place
    } else if (randomValue < chancePercentage) {
      return 'Chance';
      // Energy place
      } else if (!this.generateBoard.energyCaseExists && randomValue < chancePercentage + communityPercentage) {
        this.generateBoard.energyCaseExists = true;
        return 'Energy';
        // Taxes place
      } else if (!this.generateBoard.taxesCaseExists && randomValue < chancePercentage + communityPercentage) {
        this.generateBoard.taxesCaseExists = true;
        return 'Taxes';
        // Community place
    } else if (randomValue < chancePercentage + communityPercentage) {
      return 'Community';
      // Estate place
    } else {
      return 'Estate';
    }
  }

}
  
module.exports = MonopolyGame;