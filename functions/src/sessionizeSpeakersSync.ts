import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { getFirestore } from 'firebase-admin/firestore';

interface Speaker {
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
  socials: Social[];
  title: string;
}

interface Social {
  name: string;
  link: string;
}

export const syncSessionizeSpeakers = functions.pubsub
  .schedule('every 5 minutes')
  .timeZone('America/Edmonton')
  .onRun(async () => {
    try {
      const sessionizeUrl = 'https://sessionize.com/api/v2/o824blhv/view/Speakers';
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(sessionizeUrl, { headers });
      const responseData = await response.json();

      const db = getFirestore();
      const batch = db.batch();

      if (Array.isArray(responseData)) {
        responseData.forEach((speakerData: any) => {
          const socialsData = speakerData.links || [];
          const socials: Social[] = socialsData.map((socialData: any) => {
            return {
              name: socialData.title,
              link: socialData.url,
            };
          });

          const companyLogo =
            speakerData.questionAnswers.find((answer: any) => answer.question === 'Logo')?.answer ||
            '';

          const speaker: Speaker = {
            bio: speakerData.bio || '',
            company:
              speakerData.questionAnswers.find(
                (q: any) => q.question === 'Current Company/ Organization Name'
              )?.answer || '',
            companyLogo: companyLogo || '',
            companyLogoUrl: '',
            featured: speakerData.isTopSpeaker || false,
            name: speakerData.fullName || '',
            order: 0,
            photo: speakerData.profilePicture || '',
            photoUrl: speakerData.profilePicture || '',
            shortBio: '',
            socials: socials,
            title: speakerData.tagLine || '',
          };

          const speakerRef = db.collection('speakers').doc();
          batch.set(speakerRef, speaker);
        });
      }

      await batch.commit();
      console.log('Speakers synced successfully.');
      return null;
    } catch (error) {
      console.error('Error syncing speakers:', error);
      return null;
    }
  });
