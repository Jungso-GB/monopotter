
module.exports = async (serversRef, guildId) => {
    const collections = await serversRef.firestore().listCollections();
    const collectionExists = collections.some(collection => collection.id === guildId);
    console.log(collectionExists);
    return collectionExists;
}