const firebase = require('firebase');

module.exports = async (serversRef, guildId) => {
  const docRef = serversRef.doc(guildId); //get the collection of guild
  const docSnapshot = await docRef.get(); //get the documents in the collection
  const collectionExists = docSnapshot.exists; //if there is a document in the collection
  if(collectionExists == true){return true; //We consider that the collection exists
    }else{
        return false}
}
