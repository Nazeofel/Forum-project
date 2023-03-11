importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyDlgO_-cPdehrcAd8-dz5a28mZc0aZ_l-A",
  authDomain: "forum-71f19.firebaseapp.com",
  projectId: "forum-71f19",
  storageBucket: "forum-71f19.appspot.com",
  messagingSenderId: "403564355798",
  appId: "1:403564355798:web:aeaa7b09efa5248d162977",
  measurementId: "G-CC20L5EKFF",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
  console.log("omg here in the background ?");
});
