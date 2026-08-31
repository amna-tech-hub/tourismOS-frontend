// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCb_PmheCk8t77l7aQFYrSelun_GpQ0h04",
  authDomain: "tourismos-1a55b.firebaseapp.com",
  projectId: "tourismos-1a55b",
  storageBucket: "tourismos-1a55b.firebasestorage.app",
  messagingSenderId: "751396003686",
  appId: "1:751396003686:web:4a68938370028ea2f532a7",

});

const messaging = firebase.messaging();