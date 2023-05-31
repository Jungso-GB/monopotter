class MonopolyGame {
    constructor(gCollection, GameID) {
        this.gCollection = gCollection;
        this.GameID = GameID;
    }
    
    // To be async. Call it by .initialize()
    async initialize(){
        //Create the game's structure in database
            // Have the ID of the last game ; If not, there is a dummyDocs, so ID will be 2
        GameCollection = this.gCollection.collection('games').collection(GameID);

      // Create players sub-collection
      await GameCollection.collection('players').set({})
      //dummyDoc will be delete when there is an other document  in the players collection

      // Create board sub-collection
      await GameCollection.collection('board').set({})

      //dummyDoc will be delete when there is an other document  in the board collection
      GameCollection.doc('gameStatus').set("NotStarted"), //"NotStarted", "InGame => When player is playing", "Paused => Waiting player play", "Finished"
      GameCollection.collection('board').doc('currentPlayer').set("none"),
      // Variables admin
      GameCollection.doc('diceRoll').set(this.gCollection.doc('diceRoll').get('diceRoll')),
      GameCollection.doc('remainingDays').set(this.gCollection.doc('admin_PlayTime').get('admin_PlayTime')),
      GameCollection.doc('language').set(this.gCollection.doc('admin_Language').get('admin_Language')),
      GameCollection.doc('maxplayers').set(this.gCollection.doc('admin_MaxPlayers').get('admin_MaxPlayers')),
      GameCollection.doc('theme').set(this.gCollection.doc('admin_Theme').get('admin_Theme')),
    
      // Create board
      this.board = await this.createBoard(GameCollection.collection('board'));

      this.money = initializeMoney(); // Fonction à définir pour attribuer le montant de départ à chaque joueur
      // Autres propriétés de l'instance du jeu
    }

    async createBoard(boardCollection) {
      const settings = require('../Data/settings.json');
      //Change by theme
      let language = this.gCollection.doc('admin_Language').get('admin_Language');

      //Define theme
      //If it's not valid theme
      if(!Objects.value(settings.themes).includes(GameCollection.doc('theme').get().data().theme)){
        console.log("Theme not valid:" + GameCollection.doc('theme').get().data().theme + " -> default theme");
        //Select default theme
        let dataJSON = ('../Data/default_' + language + ".json")
      }else{
      //Select theme
      let dataJSON = ('../Data/' + theme + "_" + language + ".json")
      console.log("Valid theme:" + GameCollection.doc('theme').get().data().theme);
      }

      // Create the board
      //Variable à bien attribuer à partir de la BDD: numCasesRaw, chancePercentage, communityPercentage
      const board = await this.generateBoard(numCasesRaw, chancePercentage, communityPercentage)

    // Méthodes et fonctionnalités de l'instance du jeu

  }

  async generateBoard(numCasesRaw, chancePercentage, communityPercentage) {
    const board = [];
    
    // First place
    board.push('GO');
    // Generate first raw
    this.generateRaw(numCasesRaw, chancePercentage, communityPercentage)

    board.push('Jail')

    this.generateRaw(numCasesRaw, chancePercentage, communityPercentage)

    board.push('Free Park')

    this.generateRaw(numCasesRaw, chancePercentage, communityPercentage)

    board.push('Go To Jail')
    
    return board;
  }

  async generateRaw(){

    // Add places on raw
    for (let i = 1; i < numCasesRaw - 2; i++) {
      board.push(generateCase(i, chancePercentage, communityPercentage));
    }
  }
  
  async generateCase(position, chancePercentage, communityPercentage) {
    const randomValue = Math.random() * 100
    //Voir pour ajouter les cases "Water", "Energy", "Taxes" et "Free Park"
    if (randomValue < chancePercentage) {
      return 'Chance';
    } else if (randomValue < chancePercentage + communityPercentage) {
      return 'Community';
    } else {
      return 'Estate';
    }
  }
 /* // Affichage du plateau généré
 console.log("Board of Monopoly Game: ")
  for (let i = 0; i < numCases; i++) {
    console.log(`${i + 1}. ${board[i]}`);
  }*/
  

}
  
module.exports = MonopolyGame;