class MonopolyGame {
    constructor(players, gCollection) {
        //Create the game's structure in database
            // Have the ID of the last game ; If not, there is a dummyDocs, so ID will be 2
        newGameID = require('../Functions/findNewGameID').findNewGameID(gCollection);


      // Create players sub-collection
      await gCollection.collection('players').doc('dummyDoc').set({});
      //dummyDoc will be delete when there is an other document  in the players collection

      // Create board sub-collection
      await guildDocRef.collection('board').doc('dummyDoc').set({});
      //dummyDoc will be delete when there is an other document  in the board collection

      this.players = players;
      this.currentPlayerIndex = 0;
      this.board = createBoard(); // Fonction à définir pour créer les cases du plateau de jeu
      this.money = initializeMoney(); // Fonction à définir pour attribuer le montant de départ à chaque joueur
      // Autres propriétés de l'instance du jeu
    }
  
    // Méthodes et fonctionnalités de l'instance du jeu
  }
  
  module.exports = MonopolyGame;
  

module.exports = {

    async run(gCollection){
        gCollection.doc('gameStatus').set("Paused"), //"NotStarted", "InGame => When player is playing", "Paused => Waiting player play", "Finished"
        gCollection.doc('currentPlayer').set("none"),
        gCollection.doc('diceRoll').set(diceRoll),
        gCollection.doc('diceRoll').set(diceRoll),
        diceRoll : 5, // Number of dice to roll each day
        remainingDays : 0, // Before finishing the game, how many days the game has left
        // Admin variables
        admin_Language: "en",
        admin_PlayTime: 10, // How many days the game has to be played
        admin_MaxPlayers: 25,
        admin_Theme: "default", // default, FF14
    }
}