import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyATlDaKvw5tf-nIouS7CEgywUP2ACOIp-c',
	authDomain: 'speakease-5f8eb.firebaseapp.com',
	projectId: 'speakease-5f8eb',
	storageBucket: 'speakease-5f8eb.firebasestorage.app',
	messagingSenderId: '267746919494',
	appId: '1:267746919494:web:ef5bda90f1f2452d40b647'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
