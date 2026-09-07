/* Firebase web configuration. This key is public by design; protect data with Firestore Rules. */
const firebaseConfig = {
  apiKey: 'AIzaSyBXM95naA_kkNgitiubfSOHQNW_4DZqt84',
  authDomain: 'database-odp-odc.firebaseapp.com',
  projectId: 'database-odp-odc',
  storageBucket: 'database-odp-odc.firebasestorage.app',
  messagingSenderId: '91340519520',
  appId: '1:91340519520:web:f4f3d4fbf93b90b2086b05',
  measurementId: 'G-W462ZWEWJ2'
};

firebase.initializeApp(firebaseConfig);
const cloudDb = firebase.firestore();
const CLOUD_STATE_DOC = cloudDb.collection('app_state').doc('network');
