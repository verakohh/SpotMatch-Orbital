/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');

admin.initializeApp();

const db = admin.firestore();

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/jpeg,*/*;q=0.8',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
};

async function scrapeMainPage(url) {
  try {
    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    const concerts = [];
    const concertElements = $('div.AtIvjk2YjzXSULT1cmVx');

    concertElements.each((_, element) => {
      const concert = {};
      try {
        const concertLinkElement = $(element).find('a.HsqHp2xM2FkfSdjy1mlU');
        concert.link = concertLinkElement.attr('href') || "";

        const artistElement = $(element).find('div._5CQoAbgUFZI3p33kRVk');
        concert.artist = artistElement.text() || "";

        const dateTimeElement = $(element).find('div.r593Wuo4miYix9siDdTP');
        const dateTimeText = dateTimeElement.find('div').last().text().trim();
        if (dateTimeText.includes(' - ')) {
          const [date, time] = dateTimeText.split(' - ');
          concert.date = date;
          concert.time = time;
        } else {
          concert.date = dateTimeText;
          concert.time = "";
        }

        concerts.push(concert);
      } catch (error) {
        console.error('Error extracting concert element:', error);
      }
    });

    return concerts;
  } catch (error) {
    console.error('Error scraping main page:', error);
    return [];
  }
}

async function scrapeConcertDetails(concert) {
  try {
    const { data } = await axios.get(concert.link, { headers });
    const $ = cheerio.load(data);

    const titleElement = $('div._FmG2rq5Aj0u3WF5Nunp');
    concert.title = titleElement.text() || "";

    const locationElement = $('div.BaJwuMlMV9rEGpXmDXL4 a.q1Vlsw1cdclAUZ4gBvAn');
    concert.location = locationElement.text() || "";

    const scriptElements = $('script[type="application/ld+json"]');
    scriptElements.each((_, element) => {
      const jsonData = JSON.parse($(element).html());
      if (jsonData.genre) {
        concert.genre = jsonData.genre;
      }
    });

    const imageElement = $('a.iZzIxQNuR9Gi9sRL2wmk source[type="image/webp"]');
    concert.image = imageElement.attr('srcset') || "";

    return concert;
  } catch (error) {
    console.error('Error extracting concert details:', error);
    return concert;
  }
}

async function saveConcertToFirestore(concert) {
  try {
    const docRef = await db.collection('concerts').add(concert);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

exports.scheduledConcertScraper = functions.pubsub.schedule('every 4 hours').onRun(async (context) => {
  const url = "https://www.bandsintown.com/?came_from=257&sort_by_filter=Number+of+RSVPs&concerts=true";
  const concerts = await scrapeMainPage(url);

  const detailedConcerts = await Promise.all(concerts.map(concert => scrapeConcertDetails(concert)));

  for (const concert of detailedConcerts) {
    await saveConcertToFirestore(concert);
  }

  console.log('Concert data saved to Firestore');
});

