// Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
 import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

 //import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
     apiKey: "AIzaSyBUGViwq859c88qh6hnP2VsgtT_1e_52K4",
     authDomain: "dnd-campaign-notes-e127f.firebaseapp.com",
     projectId: "dnd-campaign-notes-e127f",
     storageBucket: "dnd-campaign-notes-e127f.firebasestorage.app",
     messagingSenderId: "483633516360",
     appId: "1:483633516360:web:118b060bc0a29713f02d7d",
     measurementId: "G-WD1P7PNT78"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 //const analytics = getAnalytics(app);

 const titleInput = document.getElementById("campaignTitle");
 const loadedTitle = document.getElementById("loadedTitle");

 const campaignDoc = doc(db, "campaigns", "main");

 // Load and display data
 onSnapshot(campaignDoc, (snapshot) => {
     if (snapshot.exists()) {
         const data = snapshot.data();
         loadedTitle.textContent = data.title ?? "No title yet";
     }
 });

 // Save function
 window.saveTitle = async function () {
     const newTitle = titleInput.value;
     await setDoc(campaignDoc, { title: newTitle });
 };

export { db };