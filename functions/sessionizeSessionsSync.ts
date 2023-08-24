import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const syncSessionizeSessions = functions.pubsub
  .schedule('every 3 minutes')
  .timeZone('America/Edmonton')
  .onRun(async (context) => {
    try {
      const sessionizeApiKey = 'SESSIONIZE_API_KEY';
      const sessionizeUrl = 'https://sessionize.com/api/v2/devfestyyc-2023/sessions';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionizeApiKey}`
      };

      const response = await fetch(sessionizeUrl, { headers });
      const data = await response.json();

      const sessions = data.map((session: any) => {
        return {
          description: session.description,
          icon: session.icon,
          image: session.image,
          presentation: session.presentation,
          room: session.room,
          roomId: session.roomId,
          speakers: session.speakers,
          tags: session.tags,
          title: session.title,
          videoID: session.videoID,
        };
      });

      const batch = db.batch();
      sessions.forEach((session: any) => {
        const sessionRef = db.collection('sessions').doc();
        batch.set(sessionRef, session);
      });

      await batch.commit();
      console.log('Sessions synced successfully.');
      return null;
    } catch (error) {
      console.error('Error syncing sessions:', error);
      return null;
    }
  });
