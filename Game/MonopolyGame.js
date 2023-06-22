/*
TODOS :
- Quand on a une carte "move" vers l'arrière mais qu'on est sur un ID bas, on peut aller en position "-1,-2, ..."

*/

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
        maxPlayers : (await this.gCollection.get()).data().admin_MaxPlayers,
        coeffValue : (await this.gCollection.get()).data().admin_coeffValue   
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
        } else if (messageOrInteraction.isCommand()) {
          interactionId = 2
          user = messageOrInteraction.user;
          userId = messageOrInteraction.user.id;
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
        await playersCollectionRef.doc(userId).set({discordID : userId, dice : (await GameCollection.get()).data().diceRoll, position : 1});

        return messageOrInteraction.reply({ content: "You joined the Monopoly", ephemeral: true})
    
      } catch (error) {
        console.error("Error in join:", error);
        message.reply("Error during join. Show it to developers: \n\n", error);
        // Traitez l'erreur ici (par exemple, envoyez un message d'erreur à l'utilisateur ou effectuez une autre action appropriée)
      }
    }

    async roll(bot, message, embed) {

      // Select collection of current game AND take gameStatus
      const GameCollection = await this.gCollection.collection('games').doc(this.GameID.toString());
      const gameData = (await GameCollection.get()).data();
      let gameStatus = (await GameCollection.get()).data().gameStatus;
  
      // Verify status of current game
      if (gameStatus !== "InGame" && gameStatus !== "Idle") {
        return message.reply({content: "No party is currently in progress. Use /start to create a party.", ephemeral: true});
      }

      // Take data of player
      const playerQuery = GameCollection.collection('players').where('discordID', '==', message.user.id);
      const playerSnapshot = await playerQuery.get();
    
      // Verifiy is player is already in party
      if (playerSnapshot.empty) {
        return message.reply({content: "You're not in a party. Use /join to join Monopoly.", ephemeral: true});
      }
    
      const playerData = playerSnapshot.docs[0].data();
      const playerName = message.guild.members.cache.get(playerData.discordID).displayName
      const playerDice = playerData.dice

      //Verify dice number
      let totalRoll = 1
      if(playerDice <= 0) {
        return 0

      }else if(playerDice == 1){
        const dice1 = await this.rollDice();
        totalRoll = dice1;
        playerSnapshot.docs[0].ref.update({dice : 0})

      }else{
        const dice1 = await this.rollDice();
        const dice2 = await this.rollDice();
        totalRoll = await dice1 + dice2;
        playerSnapshot.docs[0].ref.update({dice : playerDice - 2})}
    
        message.reply({content: "Dice result: " + totalRoll + " ! \n\n You're moving on the board...", ephemeral: true});
      
      // MOVE ON BOARD
      // Get board information
      const boardCollectionRef = GameCollection.collection('board');
      const boardDoc = await boardCollectionRef.doc('places').get();
      const board = boardDoc.data();

      let newPosition = await this.moveOnBoard(GameCollection, playerData, totalRoll, board)

      const typeCard = await this.executeSlotAction(board, playerData, newPosition, gameData, embed, GameCollection, playerSnapshot)
      console.log("typeCard: " + typeCard)

      setTimeout(() => {
        message.editReply("You are on a " + typeCard + "\'s place ! ")
      }, 1000);
    
    }

    // When you have a new position
    async executeSlotAction(board, playerData, newPosition, gameData, embed, GameCollection, playerSnapshot) {

      let typeCardMessage = ""

      const coeffValue = gameData.coeffValue;
      console.log('coeffValue in executeSlotAction()' + coeffValue);
      // LOGIQUE BY SLOT
      const slotData = board[newPosition.toString()]
      console.log("slotData", slotData)

      const slotType = slotData.type
      console.log("slotType", slotType)

      let value = 0 // Value money about the slot action
      let message = "" // Message for embed

      //Estate card. Most common type
      if(slotType === 'estate') {
        typeCardMessage = "Estate"
        embed.setTitle("Estate place ! \n" + slotData.title)
        // TODO 
      }

      //Chance Cards and Community Cards
      else if (slotType === 'chance_cards' || slotType === 'community_cards'){
        typeCardMessage = "Chance"

        // Choose random card in set 
        const cardData = await this.chooseRandomCard(slotType, GameCollection)
        console.log("CARDDATA: " + cardData) // Delete
        console.log("slot Effect: " + slotData.effect) // Delete

        embed.setTitle("Special cards ! \n" + cardData.title)
        let preMessage = cardData.desc

        // Add money card
        if(cardData.effect === "add"){
          value = await this.updateMoney(playerData, cardData, coeffValue, playerSnapshot, GameCollection)
          embed.setDescription(preMessage + " Get " + value)
          console.log("add card") // Delete

        } // Sub money card
        else if(cardData.effect === "sub"){
          value = await this.updateMoney(playerData, cardData, coeffValue, playerSnapshot, GameCollection)
          embed.setDescription(preMessage + " Pay " + value)
          console.log("sub card") // Delete

        // Move card
        }else if(cardData.effect === "move"){
          console.log("move card") // Delete
          // You move 
          await this.moveOnBoard(GameCollection, playerData, cardData.case, board)
          // For good message
          if(cardData.sub_effect === "forward"){
            embed.setDescription(preMessage + " Forward of :" + cardData.case)
          }else if(cardData.sub_effect === "backward"){
            const negativeToPositive = (cardData.case * -1)
            embed.setDescription(preMessage + " Backward of : " + negativeToPositive)
          }
        }
      }
      return typeCardMessage;
    }
/*

    HELPERS OF CLASS

*/

    async chooseRandomCard(type, GameCollection){
      let category = type

      let dataJSON = await this.getDataJSON(GameCollection)

      if(type == 'estate'){category = 'estate_set'}

      // Get key of estate_set
      console.log("dataJSON: " + JSON.stringify(await dataJSON))
      console.log('Category: ' + category)

      const setKeys = Object.keys(dataJSON[category]);

    // Choose a random card
    const randomIndex = Math.floor(Math.random() * setKeys.length);

    // Get the random card
    const randomCard = dataJSON[category][setKeys[randomIndex]];

    console.log("randomCard: " + JSON.stringify(randomCard))

    return randomCard;
    }

    async moveOnBoard(GameCollection, playerData, totalRoll, board){
      //Get player position
      const playerPosition = playerData.position;
      console.log("Old position: " + playerPosition) // Delete

      //Calculate new position
      let newPosition = playerPosition + totalRoll;
      if (newPosition > Object.keys(board).length) {
        //Formule that when you reach the end of the board, you go back to the beginning
        newPosition = (newPosition - 1) % Object.keys(board).length + 1;
      }
      console.log("New Position: " + newPosition); // Delete

      // Take data of player
      const playerQuery = GameCollection.collection('players').where('discordID', '==', playerData.discordID);
      const playerSnapshot = await playerQuery.get();

      // Update position
      await playerSnapshot.docs[0].ref.update({ position: newPosition });

      return newPosition

    }

    // update money 
    async updateMoney(playerData, slotData, coeffValue, playerSnapshot, GameCollection){
      
      const playerMoney = playerData.money 
      console.log("Game Collection in addMoney: " + GameCollection + " money of player:" + playerMoney) //Delete

      const varMoney = slotData.value * coeffValue
      console.log('varMoney: ' + varMoney + 'slotData.value: ' + slotData.value + 'coeffValue: ' + coeffValue)
      const newMoney = playerData.money - (varMoney)
      //await playerData.money.update({money: newMoney})
      console.log('newMoney: ' + newMoney)
      await playerSnapshot.docs[0].ref.update({money : newMoney})

      return varMoney
    }

    async rollDice() {
      return (Math.floor(Math.random() * 6) + 1); // Lance un dé à 6 faces
    }

    async getDataJSON(GameCollection){
      const settings = require('../Data/settings.json');
      //Take language 
      const language = (await GameCollection.get()).data().language
      //Define theme
      const theme = (await GameCollection.get()).data().theme

      let dataJSON

      //If it's not valid theme
      if(!Object.values(settings.themes).includes(theme)){
        console.log("Theme not valid:" + (await GameCollection.get()).data().theme + " -> default theme");
        //Select default theme
        dataJSON = require('../Data/default_' + language + ".json")
      }else{
      //Select theme
      dataJSON = require('../Data/' + theme + "_" + language + ".json")
      }

      return dataJSON

    }


    async createBoard(GameCollection) {

      let dataJSON = await getDataJSON(GameCollection)

      // Define variables by GameCollection
      let rawSize = (await GameCollection.get()).data().rawSize;
      let chancePercentage = (await GameCollection.get()).data().chancePercentage;
      let communityPercentage = (await GameCollection.get()).data().communityPercentage;

      // Create the board
      const board = await this.generateBoard(rawSize, chancePercentage, communityPercentage, dataJSON)

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

  async generateBoard(rawSize, chancePercentage, communityPercentage, dataJSON) {
    const board = {};
    
    let waterCaseExists = false;
    let energyCaseExists = false;
    let taxesCaseExists = false;

    // First raw
    board[1] = {...dataJSON.unique_cards.GO};
    await this.generateRaw(rawSize, 2, chancePercentage, communityPercentage, board, dataJSON)

    // Second raw
    board[rawSize] = {...dataJSON.unique_cards.Jail};
    await this.generateRaw(rawSize * 2, rawSize + 1, chancePercentage, communityPercentage, board, dataJSON)

    // Third raw
    board[rawSize * 2] = {...dataJSON.unique_cards.FreePark};
    await this.generateRaw(rawSize * 3, (rawSize * 2 + 1), chancePercentage, communityPercentage, board, dataJSON)

    // Fourth raw
    board[rawSize * 3] = {...dataJSON.unique_cards.GoToJail};
    await this.generateRaw(rawSize * 4, (rawSize * 3 + 1), chancePercentage, communityPercentage, board, dataJSON)
    
    return board;
  }

  async generateRaw(rawSize, startCase, chancePercentage, communityPercentage, board, dataJSON){
    
    // Get key of estate_set
    const setKeys = Object.keys(dataJSON.estate_set);

    // Choose a random set of keys
    const randomIndex = Math.floor(Math.random() * setKeys.length);

    // Get the random set of estate's set
    const randomSet = dataJSON.estate_set[setKeys[randomIndex]];


    // Add places on raw
    for (let i = startCase; i <= rawSize - 1; i++) {
      board[i] = (await this.generateCase(i, chancePercentage, communityPercentage, dataJSON, randomSet));
    }
  }
  
  async generateCase(position, chancePercentage, communityPercentage, dataJSON, randomSet) {

    const randomValue = Math.random() * 100

    // Water place
    if (!this.generateBoard.waterCaseExists && randomValue < chancePercentage) {
      this.generateBoard.waterCaseExists = true;
      return {...dataJSON.special.Water};

      //Chance place
    } else if (randomValue < chancePercentage) {
      return {...dataJSON.special.Chance}

      // Energy place
      } else if (!this.generateBoard.energyCaseExists && randomValue < chancePercentage + communityPercentage) {
        this.generateBoard.energyCaseExists = true;
        return {...dataJSON.special.Energy}

        // Taxes place
      } else if (!this.generateBoard.taxesCaseExists && randomValue < chancePercentage + communityPercentage) {
        this.generateBoard.taxesCaseExists = true;
        return {...dataJSON.special.Taxes}

        // Community place
    } else if (randomValue < chancePercentage + communityPercentage) {
      return {...dataJSON.special.Community}

      // Estate place
    } else {
      return this.randomEstate(randomSet);
    }
  }

  async randomEstate(randomSet) {
    // Get estate of randomSet
    const setKeys = Object.keys(randomSet.estates);

    // Choose a random estate of set
    const randomIndex = Math.floor(Math.random() * setKeys.length);

    // Return the random estate
    return randomSet.estates[setKeys[randomIndex]];
  }

}
  
module.exports = MonopolyGame;