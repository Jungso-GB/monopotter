const admin = require('firebase');

const template_Games = {
    gameStatus: "NotStarted", //"NotStarted", "InGame => When player is playing", "Paused => Waiting player play", "Finished"
    currentPlayer: "none", //"none => Idle player", player
    remainingDays : 10, // Before finishing the game, how many days the game has left
    // Admin variables
    diceRoll : 5,
    Language: "en",
    PlayTime: 10, // How many days the game has to be played
    MaxPlayers: 25,
    Theme: "default", // default, FF14
    Money: "$", //Only UTF-8 characters ; Maybe delete and replace in themes
    chancePercentage: 15, // Percentage of chance card
    communityPercentage: 25, // Percentage of community card
    rawSize: 11 //Default value of monopoly
};

module.exports = {
    async run(gCollection){
        const gamesCollectionRef = gCollection.collection('games');
        let lastGameQuerySnapshot = await gamesCollectionRef.orderBy('ID', 'desc').limit(1).get();

        let newGameID;
        if (!lastGameQuerySnapshot.empty) {
            console.log("lastGameID is not empty");

            console.log("ID lastGame: " + lastGameQuerySnapshot.docs[0].id)
            const lastGameID = parseInt(lastGameQuerySnapshot.docs[0].id);
            
            console.log("New Game ID in condition: " + (lastGameID + 1))
            newGameID = lastGameID + 1;

            await gamesCollectionRef.doc(newGameID.toString()).set(template_Games);
        }
        else {
            console.log("No 'games' collection found \n Creating collection...");
            newGameID = 1;

            await gamesCollectionRef.doc(newGameID.toString()).set(template_Games);

            console.log("Document créé dans la collection 'games'");
        }
        console.log("New game ID finish: " + newGameID)

        gamesCollectionRef.doc(newGameID.toString()).set({ ID: newGameID.toString() }, { merge: true });
        return newGameID;
    }
};
