// SDK Firebase
// Importez les fonctions dont vous avez besoin à partir des SDK dont vous avez besoin
const firebase = require('firebase/app');
require('firebase/database');

let database;

module.exports = async () => {
  // Vérifiez si l'application Firebase est déjà initialisée
  if (!firebase.apps.length) {
    // Votre configuration Firebase
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MSGSENDER,
      appId: process.env.FIREBASE_APPID,
      measurementId: process.env.FIREBASE_MEASUREMENTID
    };

    // Initialisez l'application Firebase
    firebase.initializeApp(firebaseConfig);
  }

  // Vérifiez si la base de données est déjà initialisée
  if (!database) {
    database = firebase.database();
  }

  return database;
};
