import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUiRMR_nlJ3nzfpN1H-KHB0kgaV6v5YL0",
  authDomain: "farmcs-75b1b.firebaseapp.com",
  projectId: "farmcs-75b1b",
  storageBucket: "farmcs-75b1b.firebasestorage.app",
  messagingSenderId: "291902144856",
  appId: "1:291902144856:web:fc88e99cba04a87eeda52d",
  measurementId: "G-LC8ZJHW1HS"
};

const app = initializeApp(firebaseConfig);

let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      window.firebaseAnalytics = analytics;
    }
  })
  .catch((error) => {
    console.warn("Firebase analytics not supported in this environment", error);
  });

window.firebaseApp = app;
