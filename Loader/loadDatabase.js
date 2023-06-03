const admin = require('firebase-admin');


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

  const db = admin.firestore();
  return db;

};
module.exports = loadDatabase;