import { error } from '@sveltejs/kit';
import { config } from "dotenv";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
config();

const firebaseConfig = {

    apiKey: process.env.FIREBASE_API_KEY,

    authDomain: "foxconn-9c344.firebaseapp.com",

    projectId: "foxconn-9c344",

    storageBucket: "foxconn-9c344.appspot.com",

    messagingSenderId: "557488235474",

    appId: "1:557488235474:web:62725144b759532cb4de0b",

    measurementId: "G-8H0L7C6F1H"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tokenCollection = collection(db, 'Parking');
/** @type {import('./$types').RequestHandler} */
export async function POST(data: any) {
  try{
    addDoc(tokenCollection, data.request.json());
    return new Response("test");
  }catch(e){
    e;
  }
}