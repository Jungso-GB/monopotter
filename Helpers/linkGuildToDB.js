const firebase = require('firebase');
const checkCollectionExists = require('./checkCollectionExists');

module.exports = async (bot, guild) => {
  const db = firebase.firestore();
  const serversRef = db.collection('Servers');

  try {
    // If server doesn't exist, create it
    if(await checkCollectionExists(serversRef, guild.id) == false) {
      await serversRef.doc(guild.id).set({
        name: guild.name,
        gameStatus: "NotStarted", //"NotStarted", "InGame => When player is playing", "Paused => Waiting player play", "Finished"
        currentPlayer: "none", //"none => Idle player", player
        remainingDays : 0, // Before finishing the game, how many days the game has left
        // Admin variables
        admin_diceRoll : 5,
        admin_Language: "en",
        admin_PlayTime: 10, // How many days the game has to be played
        admin_MaxPlayers: 25,
        admin_Theme: "default", // default, FF14
        admin_Money: "$", //Only UTF-8 characters ; Maybe delete and replace in themes
        admin_chancePercentage: 15, // Percentage of chance card
        admin_communityPercentage: 25, // Percentage of community card
        admin_rawSize: 11 //Default value of monopoly
      });
      const guildDocRef = serversRef.doc(guild.id); //Collection of the Guild

      // Create a new sub collection 'Games' 
      guildDocRef.collection('games').doc('dummyDoc').set({});
  
    console.log(`Collection server created successful for "${guild.name}" (${guild.id})`);
  }else{
    console.log(`Collection already exists for "(${guild.name})`)
  }
  } catch (error) {
    console.log(`Error during verify collection for "${guild.name}" (${guild.id}) `, error);
  }
};
