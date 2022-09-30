import axios from "axios";
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

/** @type {import('./$types').PageServerLoad} */
export async function load(params: any) {

    const db = getFirestore(app);

    const tokenCollection = collection(db, 'Tokens');
    const tokenSnapshot = await getDocs(tokenCollection);
    const tokenList = tokenSnapshot.docs.map(doc => doc.data());
    let tokens;
    if(!tokenList.length){
        const response = await axios.post(
            'https://api.pre-prod.parkdots.com/auth/realms/parkingrealm/protocol/openid-connect/token',
            `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );
        const tokenData = {
            access_token: response.data.access_token,
            access_expires_at: Date.now()+response.data.expires_in*1000,
            refresh: response.data.refresh_token,
            refresh_expires_at: Date.now()+response.data.refresh_expires_in*1000
        };
        addDoc(tokenCollection, tokenData);
        tokens = tokenData;
    }else{
        tokens = tokenList[0];
    }
    
}