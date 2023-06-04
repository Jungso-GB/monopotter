const admin = require('firebase');


const loadDatabase = () => {
  // Vérifie si Firebase est déjà initialisé
  if (!admin.apps.length) {
    // Configuration Firebase. Placez vos informations d'identification dans le fichier .env
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MSGSENDER,
      appId: process.env.FIREBASE_APPID,
      measurementId: process.env.FIREBASE_MEASUREMENTID
    };

    // Initialise Firebase
    admin.initializeApp(firebaseConfig);
  }

  let db;
  let isConnected = false;

  while (!isConnected) {
    try {
      db = admin.firestore();
      isConnected = true;
      console.log("Database Loaded successfully")
    } catch (error) {
      console.log('Error during connect to Firestore :', error);
      console.log('Try to connect...');
    }
  }
  return db

};
module.exports = loadDatabase;