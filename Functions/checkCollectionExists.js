const firebase = require('firebase');

module.exports = async (serversRef, guildId) => {
  const docRef = serversRef.doc(guildId);
  const docSnapshot = await docRef.get();
  const collectionExists = docSnapshot.exists;
  if(collectionExists == true){return true;
    }else{
        return false}
}
