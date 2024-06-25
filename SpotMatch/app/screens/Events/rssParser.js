// // //screens/Events/rssParser.js

import rssParser from 'react-native-rss-parser';


export const fetchRSSFeed = async (page = 1, limit = 15) => {
  try {
    const response = await fetch('https://fetchrss.com/rss/666825c846712086720c6bf2666825ae29500593a60a0ed2.xml');
    const text = await response.text();
    console.log('RSS Feed fetched, length:', text.length);
    const parsed = await rssParser.parse(text);
    console.log('RSS Feed parsed, number of items:', parsed.items.length);
    return parsed;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return null;
  }
};
export const extractGigData = (item) => {
  const title = item.title;
  const description = item.description;

  // Extract image URL
  const imageMatch = description.match(/<img src="([^"]+)" \/>/);
  const gig_image = imageMatch ? imageMatch[1] : null;

  if (!gig_image) {
    console.log('No image URL found for gig:', title);
  } else {
    console.log('Image URL:', gig_image);
  }

  // Extract gig details
  const detailsMatch = description.match(/<div.*?>(.*?)<\/div>/);
  const details = detailsMatch ? detailsMatch[1].split('<br/>').map(line => line.trim()) : [];

  const gig_title = details[0];
  let gig_extrainfo = '';
  let gig_mainartist = '';
  let gig_artists = '';
  let gig_dateandtime = '';
  let gig_location = '';
  let gig_link = 'Free entry!';

  if (details.length > 1 && !details[1].startsWith('by')) {
    gig_extrainfo = details[1];
    gig_mainartist = details[2];
  } else {
    gig_mainartist = details[1];
  }

  gig_artists = details.find(line => line.startsWith('ft.'));
  gig_dateandtime = details.find(line => /\d{1,2} \w{3}, \d{1,2}(AM|PM)/.test(line) || /\d{1,2}:\d{2}(AM|PM)/.test(line));

  const locationIndex = details.findIndex(line => line.includes('📍'));
  if (locationIndex !== -1) {
    gig_location = details[locationIndex].replace(/<i.*?<\/i>/, '').trim();
  }

  const linkMatch = description.match(/>tickets here!<br\/><a href="([^"]+)" target="_blank"/);
  if (linkMatch) {
    gig_link = linkMatch[1];
  }

  console.log('Gig data extracted:', {
    gig_image,
    gig_title,
    gig_extrainfo,
    gig_mainartist,
    gig_artists,
    gig_dateandtime,
    gig_location,
    gig_link,
  }); // Debugging log

  return {
    gig_image,
    gig_title,
    gig_extrainfo,
    gig_mainartist,
    gig_artists,
    gig_dateandtime,
    gig_location,
    gig_link,
  };
};
