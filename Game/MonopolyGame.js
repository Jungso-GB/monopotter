const admin = require('firebase');
class MonopolyGame {
    constructor(gCollection, GameID) {
        this.gCollection = gCollection;
        this.GameID = GameID;   
    }
    
    // To be async. Call it by .initialize()
    async initialize(){
        //Create the game's structure in database
        const GameCollection = this.gCollection.collection('games').doc(newGameID.toString())

      const init_variables = {
        ID : parseInt(await GameCollection.id),
        gameStatus : "NotStarted", //"NotStarted", "InGame => When player is playing", "Paused => Waiting player play", "Finished"
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
      GameCollection.set(init_variables)
    
      // Create board
      await this.createBoard(GameCollection);

      this.initializeMoney(); // Fonction à définir pour attribuer le montant de départ à chaque joueur

      // Autres propriétés de l'instance du jeu
    }

    async createBoard(GameCollection) {
      const settings = require('../Data/settings.json');
      //Change by theme
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
      GameCollection.collection('board').doc('places').set(board)
      console.log("Board created"); // A delete

    // Méthodes et fonctionnalités de l'instance du jeu

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
    
    console.log("BOARD: n\ " + JSON.stringify(board, null, 2))
    return board;
  }

  async generateRaw(rawSize, startCase, chancePercentage, communityPercentage, board){

    // Add places on raw
    for (let i = startCase; i < rawSize - 1; i++) {
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
 /* // Affichage du plateau généré
 console.log("Board of Monopoly Game: ")
  for (let i = 0; i < numCases; i++) {
    console.log(`${i + 1}. ${board[i]}`);
  }*/
  

}
  
module.exports = MonopolyGame;