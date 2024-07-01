import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs/promises'; // Import fs/promises
import path from 'path';

// Load your service account key JSON file.
const serviceAccount = JSON.parse(await fs.readFile(new URL('./config/serviceAccountKey.json', import.meta.url)));

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Read messages.json file
const messages = JSON.parse(await fs.readFile('./messages.json', 'utf8'));

async function uploadGigs() {
  const batch = db.batch();

  messages.forEach((msg) => {
    const docRef = db.collection('gigs').doc(msg.id.toString());
    batch.set(docRef, msg);
  });

  await batch.commit();
  console.log('Gigs uploaded to Firestore');
}

uploadGigs().catch(console.error);
