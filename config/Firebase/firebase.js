import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },
  signOut: () => {
    return firebase.auth().signOut();
  },
  checkUserAuth: user => {
    return firebase.auth().onAuthStateChanged(user);
  },
  passwordReset: email => {
    return firebase.auth().sendPasswordResetEmail(email);
  },
  // firestore
  createNewClient: clients => {
    return firebase
      .firestore()
      .collection("clients")
      .doc(`${clients.uid}`)
      .set(userData)
  },
  getClients: clientid => {
    return firebase.firestore()
    .collection('clients')
    .where("disabled", "==", false)
    .get()
  }

};


export default Firebase;
