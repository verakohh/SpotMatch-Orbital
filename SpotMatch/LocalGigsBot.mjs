// import { TelegramClient } from 'telegram';
// import { StringSession } from 'telegram/sessions/index.js';
// import { Api } from 'telegram';
// import input from 'input'; // npm install input
// import fs from 'fs';
// import path from 'path';

// const apiId = 24601844; // Ensure this is a number
// const apiHash = 'fec54757a8a04552135a120af34d8bbd';
// const stringSession = new StringSession(''); // Fill this later with the value from session.save()

// const client = new TelegramClient(stringSession, apiId, apiHash, {
//     connectionRetries: 5,
// });

// (async () => {
//     console.log('Loading interactive example...');
//     await client.start({
//         phoneNumber: async () => await input.text('Please enter your number: '),
//         password: async () => await input.text('Please enter your password: '),
//         phoneCode: async () => await input.text('Please enter the code you received: '),
//         onError: (err) => console.log(err),
//     });
//     console.log('You should now be connected.');
//     console.log(client.session.save()); // Save this string to avoid logging in again

//     const channel = await client.getEntity('@lowcalgigssg');
//     const result = await client.invoke(
//         new Api.messages.GetHistory({
//             peer: channel,
//             limit: 15,
//         })
//     );

//     const messages = result.messages;
//     const mediaDir = './media';
//     if (!fs.existsSync(mediaDir)) {
//         fs.mkdirSync(mediaDir);
//     }

//     const messagesList = [];
//     for (const msg of messages) {
//         let mediaPath = null;
//         if (msg.media) {
//             const mediaFile = await client.downloadMedia(msg, { downloadPath: mediaDir });
//             if (Buffer.isBuffer(mediaFile)) {
//                 const mediaFileName = `${msg.id}.jpg`; // Assuming it's a jpg image
//                 fs.writeFileSync(path.join(mediaDir, mediaFileName), mediaFile);
//                 mediaPath = path.join(mediaDir, mediaFileName);
//             } else {
//                 mediaPath = mediaFile;
//             }
//         }
        
//         // Convert msg.date to a Date object if necessary
//         const date = msg.date instanceof Date ? msg.date : new Date(msg.date * 1000);

//         messagesList.push({
//             id: msg.id,
//             message: msg.message,
//             date: date.toISOString(),
//             media_url: mediaPath ? path.relative(process.cwd(), mediaPath) : null, // Save the relative path to the media file
//         });
//     }

//     fs.writeFileSync('messages.json', JSON.stringify(messagesList, null, 4));
//     console.log('Messages saved to messages.json');

//     await client.disconnect();
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

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(await fs.promises.readFile(new URL('./config/serviceAccountKey.json', import.meta.url)));
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
    messagesList.push({
      id: msg.id,
      message: msg.message,
      date: date.toISOString(),
      media_url: mediaUrl,
    });
  }

  fs.writeFileSync('messages.json', JSON.stringify(messagesList, null, 4));
  console.log('Messages saved to messages.json');

  await client.disconnect();
})();
