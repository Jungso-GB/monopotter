// FireBase v8 to works with NodeJS and DiscordJS
const firebase = require('firebase/app');
require('firebase/database');

let database;

module.exports = async () => {
  // Verify is Firebase is already initialized
  if (!firebase.apps.length) {
    // Configuration firebase. Put your credentials in .env file
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MSGSENDER,
      appId: process.env.FIREBASE_APPID,
      measurementId: process.env.FIREBASE_MEASUREMENTID
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  // Verify if Firebase database is already initialized
  if (!database) {
    database = firebase.database();
  }

  return database;
};
