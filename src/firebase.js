import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDRSbozF27Xy7KMF833BoSrCGc1KHVByjc",
    authDomain: "spotifyai-374f6.firebaseapp.com",
    projectId: "spotifyai-374f6",
    storageBucket: "spotifyai-374f6.appspot.com",
    messagingSenderId: "814101053542",
    appId: "1:814101053542:web:77071acf8da08c52d0ada7",
    measurementId: "G-1X1NPLFX5F"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcJ6FwpAAAAAKn1wyJ_7sleIq7IoWBmcE1Cpr2M'),
    isTokenAutoRefreshEnabled: true
});
const functions = getFunctions(app);
const auth = getAuth(app);
const db = getFirestore(app);


// // Connect to Firebase emulators if running locally
// if (window.location.hostname === "localhost") {
//     // Connect to Functions emulator
//     connectFunctionsEmulator(functions, "localhost", 5001);
//     // Connect to Firestore emulator
//     connectFirestoreEmulator(db, "localhost", 8080);
//     // Connect to Auth emulator
//     connectAuthEmulator(auth, "http://localhost:9099");
// }


export { app, analytics, appCheck, functions, auth, db };