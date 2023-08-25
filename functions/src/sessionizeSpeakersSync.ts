import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const syncSessionizeSpeakers = functions.pubsub
  .schedule('every 3 minutes')
  .timeZone('America/Edmonton')
  .onRun(async (context) => {
    try {
      const sessionizeUrl = 'https://sessionize.com/api/v2/o824blhv/view/Speakers';
      const headers = {
        'Content-Type': 'application/json'
      };

      interface Speaker {
        // Define your Speaker properties here
        bio: string;
        company: string;
        companyLogo: string;
        companyLogoUrl: string;
        featured: boolean;
        name: string;
        order: number;
        photo: string;
        photoUrl: string;
        shortBio: string;
        socials: Social[]; // Use the Social type here
        title: string;
      }

      interface Social {
        // Define your Social properties here
        name: string;
        link: string;
        // ... other social properties
      }

      // Inside your function
      const response = await fetch(sessionizeUrl, { headers });
      const responseData = await response.json();

      let speakers: Speaker[] = [];

      if (Array.isArray(responseData)) {
        speakers = responseData.map((speakerData: any) => {
          const socialsData = speakerData.socials || []; // Default to empty array if no socials
          const socials: Social[] = socialsData.map((socialData: any) => {
            return {
              // Mapping for social properties
              name: socialData.name,
              link: socialData.link,
              // ... other social properties
            };
          });

          return {
            // Mapping for speaker data
            bio: speakerData.bio,
            company: speakerData.company,
            companyLogo: speakerData.companyLogo,
            companyLogoUrl: speakerData.companyLogoUrl,
            featured: speakerData.featured,
            name: speakerData.name,
            order: speakerData.order,
            photo: speakerData.photo,
            photoUrl: speakerData.photoUrl,
            shortBio: speakerData.shortBio,
            socials: socials,
            title: speakerData.title,
          };
        });
      }

      const batch = db.batch();
      speakers.forEach((speaker: Speaker) => {
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
