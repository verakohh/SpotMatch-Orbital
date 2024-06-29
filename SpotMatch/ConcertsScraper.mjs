import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';

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

async function main() {
    const url = "https://www.bandsintown.com/?came_from=257&sort_by_filter=Number+of+RSVPs&concerts=true";
    const concerts = await scrapeMainPage(url);

    // Use Promise.all to fetch concert details concurrently
    const detailedConcerts = await Promise.all(concerts.map(concert => scrapeConcertDetails(concert)));

    const jsonFilePath = path.join(path.resolve(), 'concerts.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(detailedConcerts, null, 2));
    console.log(`Concert data saved to ${jsonFilePath}`);
}

main();
