import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs/promises';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Verify the environment variable
const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error('SERVICE_ACCOUNT_KEY environment variable is not set.');
}

// Parse service account key from environment variable
const serviceAccount = JSON.parse(serviceAccountKey);

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Function to fetch gigs in descending order
async function fetchGigs() {
  const gigsRef = db.collection('gigs');
  const snapshot = await gigsRef.orderBy('id', 'desc').get();

  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

fetchGigs().catch(console.error);
