import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyA6htLDyIKmytKYUHaY46SNmPCzkqPId0A",
    authDomain: "sprinty-50232.firebaseapp.com",
    databaseURL: "https://sprinty-50232.firebaseio.com",
    projectId: "sprinty-50232",
    storageBucket: "sprinty-50232.appspot.com",
    messagingSenderId: "612282586671"
};
firebase.initializeApp(config);

const database = firebase.database();

export {
  database,
};