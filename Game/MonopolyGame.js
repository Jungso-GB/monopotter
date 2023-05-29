class MonopolyGame {
    constructor(gCollection, GameID) {
        this.gCollection = gCollection;
        this.GameID = GameID;
    }
    
    // To be async. Call it by .initialize()
    async initialize(){
        //Create the game's structure in database
            // Have the ID of the last game ; If not, there is a dummyDocs, so ID will be 2
        GameCollection = gCollection.collection('games').collection(GameID);

      // Create players sub-collection
      await GameCollection.collection('players').set({});
      //dummyDoc will be delete when there is an other document  in the players collection

      // Create board sub-collection
      await GameCollection.collection('board').set({});

      //dummyDoc will be delete when there is an other document  in the board collection
      GameCollection.doc('gameStatus').set("NotStarted"), //"NotStarted", "InGame => When player is playing", "Paused => Waiting player play", "Finished"
      GameCollection.collection('board').doc('currentPlayer').set("none"),
      // Variables admin
      GameCollection.doc('diceRoll').set(gCollection.doc('diceRoll').get('diceRoll')),
      GameCollection.doc('remainingDays').set(gCollection.doc('admin_PlayTime').get('admin_PlayTime')),
      GameCollection.doc('language').set(gCollection.doc('admin_Language').get('admin_Language')),
      GameCollection.doc('maxplayers').set(gCollection.doc('admin_MaxPlayers').get('admin_MaxPlayers')),
      GameCollection.doc('theme').set(gCollection.doc('admin_Theme').get('admin_Theme')),
    
      this.board = this.createBoard(GameCollection.collection('board')); // Fonction à définir pour créer les cases du plateau de jeu

      this.money = initializeMoney(); // Fonction à définir pour attribuer le montant de départ à chaque joueur
      // Autres propriétés de l'instance du jeu
    }

    async createBoard(boardCollection) {
      //Change by theme


      const boardData = [
        { name: "Case départ", type: "start" },
        { name: "Propriété 1", type: "property" },
        { name: "Chance", type: "chance" },
      ];
    
      // Créer les documents pour chaque case du plateau de jeu
      for (const caseData of boardData) {
        await gameCollection.collection('board').add(caseData);
      }
    
      console.log("Le plateau de jeu a été créé avec succès !");
    }
    

    // Méthodes et fonctionnalités de l'instance du jeu
  }
  
module.exports = MonopolyGame;