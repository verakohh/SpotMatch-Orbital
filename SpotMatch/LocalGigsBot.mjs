// import { TelegramClient } from 'telegram';
// import { StringSession } from 'telegram/sessions/index.js';
// import { Api } from 'telegram';
// import input from 'input'; // npm install input
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getStorage } from 'firebase-admin/storage';
// import { getFirestore } from 'firebase-admin/firestore';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// // Verify the environment variable
// const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

// if (!serviceAccountKey) {
//   throw new Error('SERVICE_ACCOUNT_KEY environment variable is not set.');
// }

// // Parse service account key from environment variable
// const serviceAccount = JSON.parse(serviceAccountKey);

// // Initialize Firebase Admin SDK
// initializeApp({
//   credential: cert(serviceAccount),
//   storageBucket: "gs://orbital-athena.appspot.com",
// });

// const db = getFirestore();
// const storage = getStorage();

// const apiId = 24601844;
// const apiHash = 'fec54757a8a04552135a120af34d8bbd';
// const stringSession = new StringSession('');

// const client = new TelegramClient(stringSession, apiId, apiHash, {
//   connectionRetries: 5,
// });

// async function uploadImage(filePath) {
//   const bucket = storage.bucket();
//   const fileName = path.basename(filePath);
//   const file = bucket.file(fileName);

//   await file.save(fs.readFileSync(filePath), {
//     metadata: { contentType: 'image/jpeg' },
//   });

//   const [url] = await file.getSignedUrl({
//     action: 'read',
//     expires: '03-01-2500', // Set an appropriate expiry date
//   });

//   return url;
// }

// (async () => {
//   console.log('Loading interactive example...');
//   await client.start({
//     phoneNumber: async () => await input.text('Please enter your number: '),
//     password: async () => await input.text('Please enter your password: '),
//     phoneCode: async () => await input.text('Please enter the code you received: '),
//     onError: (err) => console.log(err),
//   });
//   console.log('You should now be connected.');
//   console.log(client.session.save());

//   const channel = await client.getEntity('@lowcalgigssg');
//   const result = await client.invoke(
//     new Api.messages.GetHistory({
//       peer: channel,
//       limit: 15,
//     })
//   );

//   const messages = result.messages;
//   const messagesList = [];

//   for (const msg of messages) {
//     let mediaUrl = null;
//     if (msg.media) {
//       const mediaFile = await client.downloadMedia(msg, { downloadPath: './media' });
//       if (Buffer.isBuffer(mediaFile)) {
//         const mediaFileName = `${msg.id}.jpg`;
//         const filePath = path.join('./media', mediaFileName);
//         fs.writeFileSync(filePath, mediaFile);
//         mediaUrl = await uploadImage(filePath);
//       }
//     }

//     const date = msg.date instanceof Date ? msg.date : new Date(msg.date * 1000);
//     messagesList.push({
//       id: msg.id,
//       message: msg.message,
//       date: date.toISOString(),
//       media_url: mediaUrl,
//     });
//   }

//   fs.writeFileSync('messages.json', JSON.stringify(messagesList, null, 4));
//   console.log('Messages saved to messages.json');

//   await client.disconnect();
// })();


import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { Api } from 'telegram';
import input from 'input'; // npm install input
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
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
  storageBucket: "gs://orbital-athena.appspot.com",
});

const db = getFirestore();
const storage = getStorage();

const apiId = 24601844;
const apiHash = 'fec54757a8a04552135a120af34d8bbd';
const stringSession = new StringSession('');

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

async function uploadImage(filePath) {
  const bucket = storage.bucket();
  const fileName = path.basename(filePath);
  const file = bucket.file(fileName);

  await file.save(fs.readFileSync(filePath), {
    metadata: { contentType: 'image/jpeg' },
  });

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500', // Set an appropriate expiry date
  });

  return url;
}

// Function to extract gig date from message text
function extractGigDate(message) {
  const datePattern = /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC),?\s*(\d{4})?/i;
  const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
  
  const dateMatch = message.match(datePattern);
  const timeMatch = message.match(timePattern);

  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    const months = {
      JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
      JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
    };
    const formattedDate = `${year || new Date().getFullYear()}-${months[month.toUpperCase()]}-${day.padStart(2, '0')}`;

    let formattedTime = '00:00:00';
    if (timeMatch) {
      let [_, hour, minute, period] = timeMatch;
      hour = parseInt(hour, 10);
      if (period) {
        period = period.toUpperCase();
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
      }
      formattedTime = `${hour.toString().padStart(2, '0')}:${minute}:00`;
    }

    return `${formattedDate}T${formattedTime}Z`;
  }

  return null;
}

(async () => {
  console.log('Loading interactive example...');
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () => await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });
  console.log('You should now be connected.');
  console.log(client.session.save());

  const channel = await client.getEntity('@lowcalgigssg');
  const result = await client.invoke(
    new Api.messages.GetHistory({
      peer: channel,
      limit: 15,
    })
  );

  const messages = result.messages;
  const messagesList = [];

  for (const msg of messages) {
    let mediaUrl = null;
    if (msg.media) {
      const mediaFile = await client.downloadMedia(msg, { downloadPath: './media' });
      if (Buffer.isBuffer(mediaFile)) {
        const mediaFileName = `${msg.id}.jpg`;
        const filePath = path.join('./media', mediaFileName);
        fs.writeFileSync(filePath, mediaFile);
        mediaUrl = await uploadImage(filePath);
      }
    }

    const date = msg.date instanceof Date ? msg.date : new Date(msg.date * 1000);
    const gigDate = extractGigDate(msg.message); // Extract gig date from message
    const gigData = {
      id: msg.id,
      message: msg.message,
      media_url: mediaUrl,
      date: date.toISOString(),
      gig_date: gigDate // Store extracted gig date
    };
    messagesList.push(gigData);

    // Update Firestore with gig_date
    if (gigDate) {
      await db.collection('gigs').doc(msg.id.toString()).set(gigData);
      console.log(`Updated document ${msg.id} with gig_date: ${gigDate}`);
    }
  }

  fs.writeFileSync('messages.json', JSON.stringify(messagesList, null, 4));
  console.log('Messages saved to messages.json');

  await client.disconnect();
})();
