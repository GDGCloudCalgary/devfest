import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { getFirestore } from 'firebase-admin/firestore';

interface Speaker {
  bio:string;
  company:string;
  companyLogo:string;
  companyLogoUrl:string;
  featured:boolean;
  id:string;
  name:string;
  order:number;
  photo:string;
  photoUrl:string;
  sessionizeId:string;
  shortBio:string;
  socials: Social[];
  title:string;
  year:string[];

}

interface Social {
  icon:string;
  link:string
  name: string;
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
              icon: socialData.linkType,
              link: socialData.url,
              name: socialData.title,
            };
          });


          const speaker: Speaker = {
            bio:speakerData.bio || '',
            company: speakerData.questionAnswers.find((q: any) => q.question === 'Current Company/ Organization Name')?.answer || '',
            companyLogo: speakerData.questionAnswers.find((answerExtra: any) => answerExtra.question === 'Logo')?.answerExtra ||'',
            companyLogoUrl: speakerData.questionAnswers.find((answer: any) => answer.question === 'Logo')?.answer ||'',
            featured: speakerData.isTopSpeaker || false,
            id: speakerData.firstName+'_'+speakerData.lastName || '',
            name: speakerData.fullName || '',
            order: 0,
            photo: speakerData.profilePicture || '',
            photoUrl: speakerData.profilePicture || '',
            sessionizeId: speakerData.id,
            shortBio: speakerData.bio || '',
            socials: socials,
            title: speakerData.tagLine || '',
            year:["2023"]
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
