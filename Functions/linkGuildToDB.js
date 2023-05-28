const firebase = require('firebase');
const checkCollectionExists = require('./checkCollectionExists');

module.exports = async (bot, guild) => {
  const db = firebase.firestore();
  const serversRef = db.collection('Servers');

  try {
    // If server doesn't exist, create it
    // Later, verify each variables exists in collection
    if(await checkCollectionExists(serversRef, guild.id) == false) {
      await serversRef.doc(guild.id).set({
        name: guild.name,
        gameStatus: "NotStarted",
        currentPlayer: "NotStarted",
        diceRoll : 0,
        remainingDays : 0,
        // Admin variables
        admin_PlayTime: 10,
        admin_MaxPlayers: 25,
        admin_Theme: "default",
        admin_Money: "$",
      });
      const guildDocRef = serversRef.doc(guild.id);

      // Create players sub-collection
      await guildDocRef.collection('players').doc('dummyDoc').set({});

      // Create board sub-collection
      await guildDocRef.collection('board').doc('dummyDoc').set({});
  
    console.log(`Collection server created successful for "${guild.name}" (${guild.id})`);
  }else{
    console.log(`Collection already exists for "(${guild.name})`)
  }
  } catch (error) {
    console.log(`Error during verify collection for "${guild.name}" (${guild.id}) `, error);
  }
};
