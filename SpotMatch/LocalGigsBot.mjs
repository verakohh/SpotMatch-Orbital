import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { Api } from 'telegram';
import input from 'input'; // npm install input
import fs from 'fs';
import path from 'path';

const apiId = 24601844; // Ensure this is a number
const apiHash = 'fec54757a8a04552135a120af34d8bbd';
const stringSession = new StringSession(''); // Fill this later with the value from session.save()

const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
});

(async () => {
    console.log('Loading interactive example...');
    await client.start({
        phoneNumber: async () => await input.text('Please enter your number: '),
        password: async () => await input.text('Please enter your password: '),
        phoneCode: async () => await input.text('Please enter the code you received: '),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.');
    console.log(client.session.save()); // Save this string to avoid logging in again

    const channel = await client.getEntity('@lowcalgigssg');
    const result = await client.invoke(
        new Api.messages.GetHistory({
            peer: channel,
            limit: 15,
        })
    );

    const messages = result.messages;
    const mediaDir = './media';
    if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir);
    }

    const messagesList = [];
    for (const msg of messages) {
        let mediaPath = null;
        if (msg.media) {
            const mediaFile = await client.downloadMedia(msg, { downloadPath: mediaDir });
            if (Buffer.isBuffer(mediaFile)) {
                const mediaFileName = `${msg.id}.jpg`; // Assuming it's a jpg image
                fs.writeFileSync(path.join(mediaDir, mediaFileName), mediaFile);
                mediaPath = path.join(mediaDir, mediaFileName);
            } else {
                mediaPath = mediaFile;
            }
        }
        
        // Convert msg.date to a Date object if necessary
        const date = msg.date instanceof Date ? msg.date : new Date(msg.date * 1000);

        messagesList.push({
            id: msg.id,
            message: msg.message,
            date: date.toISOString(),
            media_url: mediaPath ? path.relative(process.cwd(), mediaPath) : null, // Save the relative path to the media file
        });
    }

    fs.writeFileSync('messages.json', JSON.stringify(messagesList, null, 4));
    console.log('Messages saved to messages.json');

    await client.disconnect();
})();
