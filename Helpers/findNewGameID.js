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
            const lastGameID = await lastGameQuerySnapshot.docs[0].data().ID;
            console.log("lastGameID is not empty");
            newGameID = lastGameID + 1;

            await gamesCollectionRef.doc(newGameID.toString()).set(template_Games);
        }
        else {
            console.log("No 'games' collection found \n Creating collection...");
            newGameID = 1;

            await gamesCollectionRef.doc(newGameID.toString()).set(template_Games);

            console.log("Document créé dans la collection 'games'");
        }
        return newGameID;
    }
};
