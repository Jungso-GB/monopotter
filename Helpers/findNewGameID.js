
module.exports = {

    async run(gCollection){
        let lastGameQuerySnapshot = gCollection.collection('games').orderBy('ID', 'desc').limit(1).get();

        let newGameID;
        
        if (!lastGameQuerySnapshot.empty) {
        const lastGameID = lastGameQuerySnapshot.docs[0].data().ID;
        newGameID = lastGameID + 1;
        //If it's empy (in logical, there is never this case, thanks to dummyDocs)
        } else {
        newGameID = 1;
        }
        return newGameID;
    }
}