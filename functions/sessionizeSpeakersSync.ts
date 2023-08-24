import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const syncSessionizeSpeakers = functions.pubsub
  .schedule('every 3 minutes') // Adjust the cron expression for every 3 minutes
  .timeZone('America/Edmonton') // Set the time zone to Calgary, Canada (which is in the America/Edmonton time zone)
  .onRun(async (context) => {
    try {
      const sessionizeApiKey = 'YOUR_SESSIONIZE_API_KEY';
      const sessionizeUrl = 'https://sessionize.com/api/v2/devfestyyc-2023/speakers';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionizeApiKey}`
      };

      const response = await fetch(sessionizeUrl, { headers });
      const data = await response.json();

      const speakers = data.map((speaker: any) => {

        const socials = speaker.socials.map((social: any) => {
            return {
              icon: social.icon,
              link: social.link,
              name: social.name
            };
          });

        return {
            bio: speaker.bio,
            company: speaker.company,
            companyLogo: speaker.companyLogo,
            companyLogoUrl: speaker.companyLogoUrl,
            featured: speaker.featured,
            name: speaker.name,
            order: speaker.order,
            photo: speaker.photo,
            photoUrl: speaker.photoUrl,
            shortBio: speaker.shortBio,
            socials: socials,
            title: speaker.title
        };
      });

      const batch = db.batch();
      speakers.forEach((speaker: any) => {
        const speakerRef = db.collection('speakers').doc();
        batch.set(speakerRef, speaker);
      });

      await batch.commit();
      console.log('Speakers synced successfully.');
      return null;
    } catch (error) {
      console.error('Error syncing speakers:', error);
      return null;
    }
  });
