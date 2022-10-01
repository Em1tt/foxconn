import { error } from '@sveltejs/kit';
import axios from 'axios';
import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,

    authDomain: 'foxconn-9c344.firebaseapp.com',

    projectId: 'foxconn-9c344',

    storageBucket: 'foxconn-9c344.appspot.com',

    messagingSenderId: '557488235474',

    appId: '1:557488235474:web:62725144b759532cb4de0b',

    measurementId: 'G-8H0L7C6F1H'
};

const id = process.env.CLIENT_ID;
const secret = process.env.CLIENT_SECRET;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: any) {
    const tokenSnapshot = await getDocs(collection(db, 'Tokens'));
    let res;
		const tokenList = tokenSnapshot.docs.map((doc) => {
			return doc.data();
		});
		let tokens: {
			access_token: string;
			access_expires_at: number;
			refresh: string;
			refresh_expires_at: number;
		};
		if (!tokenList.length) {
			const response = await axios.post(
				'https://api.pre-prod.parkdots.com/auth/realms/parkingrealm/protocol/openid-connect/token',
				`grant_type=client_credentials&client_id=${id}&client_secret=${secret}`,
				{
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				}
			);
			const tokenData = {
				access_token: response.data.access_token,
				access_expires_at: Date.now() + response.data.expires_in * 1000,
				refresh: response.data.refresh_token,
				refresh_expires_at: Date.now() + response.data.refresh_expires_in * 1000
			};
			addDoc(collection(db, 'Tokens'), tokenData);
			tokens = tokenData;
		} else {
			tokens = tokenList[0] as unknown as {
				access_token: string;
				access_expires_at: number;
				refresh: string;
				refresh_expires_at: number;
			};
		}
		if (tokens.access_expires_at < Date.now()) {
			try {
				const response = await axios.post(
					'https://api.pre-prod.parkdots.com/auth/realms/parkingrealm/protocol/openid-connect/token',
					`client_id=${id}&client_secret=${secret}&grant_type=refresh_token&refresh_token=${tokens?.refresh}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					}
				);
				const tokenData = {
					access_token: response.data.access_token,
					access_expires_at: Date.now() + response.data.expires_in * 1000,
					refresh: response.data.refresh_token,
					refresh_expires_at: Date.now() + response.data.refresh_expires_in * 1000
				};
				tokenSnapshot.docs.map((docc) => {
					deleteDoc(doc(db, 'Tokens', docc.id));
				});
				addDoc(collection(db, 'Tokens'), tokenData);
				tokens = tokenData;
			} catch (e) {
				console.log(e);
			}
		}
		if (tokens.refresh_expires_at < Date.now()) {
			try {
				const response = await axios.post(
					'https://api.pre-prod.parkdots.com/auth/realms/parkingrealm/protocol/openid-connect/token',
					`grant_type=client_credentials&client_id=${id}&client_secret=${secret}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					}
				);
				const tokenData = {
					access_token: response.data.access_token,
					access_expires_at: Date.now() + response.data.expires_in * 1000,
					refresh: response.data.refresh_token,
					refresh_expires_at: Date.now() + response.data.refresh_expires_in * 1000
				};
				tokenSnapshot.docs.map((docc) => {
					deleteDoc(doc(db, 'Tokens', docc.id));
				});
				addDoc(collection(db, 'Tokens'), tokenData);
				tokens = tokenData;
			} catch (e) {
				console.log(e);
			}
			try {
                console.log(tokens.access_token);
				const response = await axios.get(
					'https://api.pre-prod.parkdots.com/api-deviceint/devices',
					{
						headers: {
							Accept: 'application/json',
							authorization: `Bearer ${tokens.access_token}`
						}
					}
				);
				res = response.data;
                console.log(res);
			} catch (e) {
				console.log(e);
			}
		}
        console.log(res);
        return new Response(res);
}