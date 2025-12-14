import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyAIbn8YWlwLTzYBrx9a9QqKKcTN3cjD4kU",
    authDomain: "recipes-app-21a8a.firebaseapp.com",
    projectId: "recipes-app-21a8a",
    storageBucket: "recipes-app-21a8a.firebasestorage.app",
    messagingSenderId: "1087155702810",
    appId: "1:1087155702810:web:59d9172ccb636b872c15a3"
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return {
    provide: {
      db,
      collection,
      addDoc,
      deleteDoc,
      doc,
      onSnapshot,
      query,
      where
    }
  }
})
