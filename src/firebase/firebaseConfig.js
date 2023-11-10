
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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