// // Make sure to save this file as uploadActivities.mjs if using ES module syntax

// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import fs from 'fs';
// import path from 'path';

// // Load your service account key JSON file.
// const serviceAccount = JSON.parse(fs.readFileSync('./config/serviceAccountKey.json', 'utf8'));

// // Initialize Firebase Admin SDK
// initializeApp({
//   credential: cert(serviceAccount)
// });

// const db = getFirestore();

// // Read the activities JSON file
// const activitiesPath = path.join(__dirname, 'activities.json');
// const activities = JSON.parse(fs.readFileSync(activitiesPath, 'utf8'));

// // Upload activities to Firestore
// async function uploadActivities() {
//   for (const activity of activities) {
//     try {
//       await db.collection('activities').add(activity);
//       console.log(`Document added for activity: ${activity.name}`);
//     } catch (error) {
//       console.error('Error adding document:', error);
//     }
//   }
// }

// uploadActivities();
// SpotMatch/uploadActivities.mjs
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(
  await readFile(new URL('./config/serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const activities = [
    {
      "id": "1",
      "name": "Swee Lee Cafe at Clarke Quay",
      "image": "https://s3-ap-southeast-1.amazonaws.com/blt-catalog/locations%2F1117%2F1711947920752.jpg",
      "directions": "https://maps.google.com/?q=Swee+Lee+Cafe+at+Clarke+Quay",
      "website": "https://www.sweelee.com.sg/",
      "description": "An all-encompassing music lifestyle store featuring a cafe & bar, vinyl listening stations, musical instruments, and merchandise. Enjoy a unique experience blending music and culinary delights in a vibrant and trendy atmosphere. Special events include vinyl listening sessions every Saturday from 2pm to 4pm.",
      "ophours": "Mondays to Sundays - 11am to 9pm"
    },
    {
      "id": "2",
      "name": "Slow Boat Cafe",
      "image": "https://lh3.googleusercontent.com/p/AF1QipPlPEU2Pj3AS5rUbinD_iyBv23gjsMaRENySy7y=s1360-w1360-h1020",
      "directions": "https://maps.google.com/?q=Slow+Boat+Cafe",
      "website": "https://slowboat.sg/",
      "description": "A cozy cafe with a great selection of coffees and pastries. Slow Boat Cafe is perfect for a relaxing afternoon with friends or a peaceful spot to get some work done, offering a warm and inviting ambiance. Enjoy live acoustic music performances every Sunday from 4pm to 6pm.",
      "ophours": "Tuesdays to Sundays - 8am to 8pm"
    },
    {
      "id": "3",
      "name": "Offtrack",
      "image": "https://media.timeout.com/images/105878788/1024/576/image.webp",
      "directions": "https://maps.google.com/?q=Offtrack",
      "website": "https://www.offtrack.sg/",
      "description": "A unique spot offering great music, food, and drinks. Offtrack blends a hip atmosphere with an eclectic menu and an impressive selection of cocktails, making it a go-to destination for those seeking a lively and vibrant experience. Don't miss their weekly DJ nights every Friday from 8pm to midnight.",
      "ophours": "Fridays to Sundays - 5pm to 12am"
    },
    {
      "id": "4",
      "name": "Vertigo 26",
      "image": "https://media.timeout.com/images/106116794/1024/768/image.webp",
      "directions": "https://maps.google.com/?q=Vertigo+26",
      "website": "https://vertigo26.com.sg/",
      "description": "A rooftop bar with stunning views and a vibrant atmosphere. Vertigo 26 offers a perfect setting for a night out with friends, featuring stylish decor, delicious cocktails, and a panoramic view of the city skyline. Special events include sunset happy hours every day from 4pm to 6pm with discounted drinks.",
      "ophours": "Mondays to Sundays - 4pm to 1am"
    },
    {
      "id": "5",
      "name": "Cool Cats at the NCO Club",
      "image": "https://hear65.s3.amazonaws.com/system/tinymce/image/file/2648/content_mceu_83522461611679034553619.png",
      "directions": "https://maps.google.com/?q=Cool+Cats+at+the+NCO+Club",
      "website": "https://www.coolcats.sg/",
      "description": "A jazz club with a sophisticated vibe and top-notch performances. Cool Cats at the NCO Club offers an intimate and elegant setting, perfect for enjoying live jazz music and expertly crafted cocktails. Don't miss their special jazz nights every Wednesday featuring renowned local and international artists.",
      "ophours": "Wednesdays to Saturdays - 7pm to 12am"
    },
    {
      "id": "6",
      "name": "Blu Jaz Cafe",
      "image": "https://hear65.s3.amazonaws.com/system/tinymce/image/file/2655/content_mceu_60152738651679035161056.jpg",
      "directions": "https://maps.google.com/?q=Blu+Jaz+Cafe",
      "website": "https://blujazcafe.net",
      "description": "A lively cafe with great food, drinks, and live music. Blu Jaz Cafe is known for its vibrant atmosphere, eclectic decor, and an impressive lineup of live performances, making it a favorite among locals and tourists alike. Enjoy open mic nights every Tuesday and live band performances every Friday and Saturday.",
      "ophours": "Mondays to Sundays - 5pm to 1am"
    },
    {
      "id": "7",
      "name": "Tipsy Penguin",
      "image": "https://media-cdn.tripadvisor.com/media/photo-s/19/33/35/be/tipsy-penguin-tampines.jpg",
      "directions": "https://maps.google.com/?q=Tipsy+Penguin",
      "website": "https://www.tipsycollective.com/tipsypenguin",
      "description": "A fun bar with a wide selection of drinks and a cozy atmosphere. Tipsy Penguin offers a lively ambiance with regular events and promotions, making it a popular spot for social gatherings and a night out. Check out their trivia nights every Wednesday and karaoke sessions every Thursday.",
      "ophours": "Mondays to Sundays - 4pm to 12am"
    },
    {
      "id": "8",
      "name": "Kult Yard",
      "image": "https://media.timeout.com/images/105538417/image.jpg",
      "directions": "https://maps.google.com/?q=Kult+Yard",
      "website": "https://www.facebook.com/kultyard/",
      "description": "A cool outdoor space with art, music, and good vibes. Kult Yard is a hidden gem that hosts various art events, live music, and markets, providing a laid-back and creative environment for visitors. Enjoy their weekend art markets every Saturday and Sunday from 2pm to 8pm.",
      "ophours": "Saturdays and Sundays - 2pm to 10pm"
    },
    {
      "id": "9",
      "name": "Sixteen Ounces",
      "image": "https://static.wixstatic.com/media/698657_d1520e8e4c874261bee27442d42c518d~mv2.jpg/v1/fill/w_960,h_640,al_c/698657_d1520e8e4c874261bee27442d42c518d~mv2.jpg",
      "directions": "https://maps.google.com/?q=Sixteen+Ounces",
      "website": "https://www.sixteenouncesbistro.com/",
      "description": "A craft beer bar with a wide selection of local and international brews. Sixteen Ounces offers a welcoming atmosphere with a focus on quality beers, making it a great spot for beer enthusiasts and casual drinkers alike. Don't miss their beer tasting sessions every Thursday from 6pm to 8pm.",
      "ophours": "Tuesdays to Sundays - 3pm to 11pm"
    },
    {
      "id": "10",
      "name": "Wheeler’s Estate",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRybl4g968AHEOpkw5ia5EkcPHQBZ635yZ0sg&s",
      "directions": "https://maps.google.com/?q=Wheeler’s+Estate",
      "website": "https://wheelersestate.com/",
      "description": "A beautiful estate with a restaurant, bar, and plenty of outdoor space. Wheeler’s Estate combines rustic charm with modern elegance, offering a perfect escape from the city with its picturesque surroundings and delightful dining options. Enjoy their Sunday brunches with live music from 11am to 3pm.",
      "ophours": "Mondays to Sundays - 8am to 11pm"
    },
    {
      "id": "11",
      "name": "Maduro",
      "image": "https://hear65.s3.amazonaws.com/system/tinymce/image/file/2652/content_mceu_2723962821679034931757.jpg",
      "directions": "https://maps.google.com/?q=Maduro",
      "website": "https://www.maduro.sg/",
      "description": "A jazz lounge with a classy ambiance and live performances. Maduro offers an intimate and sophisticated environment, perfect for enjoying smooth jazz tunes and finely crafted drinks in a refined setting. Don't miss their special themed jazz nights every Thursday.",
      "ophours": "Thursdays to Sundays - 6pm to 12am"
    },
    {
      "id": "12",
      "name": "Level Up",
      "image": "https://hear65.s3.amazonaws.com/system/tinymce/image/file/2650/content_mceu_98989533511679034719185.jpg",
      "directions": "https://maps.google.com/?q=Level+Up",
      "website": "https://1-levelup.com/",
      "description": "An arcade bar with games, drinks, and fun for all ages. Level Up combines the nostalgia of arcade games with a modern bar atmosphere, offering a unique and entertaining experience for visitors of all ages. Join their retro gaming tournaments every Tuesday from 7pm to 10pm.",
    "ophours": "Mondays to Sundays - 5pm to 1am"
  }
];

async function uploadActivities() {
  const batch = db.batch();

  activities.forEach(activity => {
    const docRef = db.collection('activities').doc(activity.id);
    batch.set(docRef, activity);
  });

  await batch.commit();
  console.log('Activities uploaded to Firestore');
}

uploadActivities().catch(console.error);
