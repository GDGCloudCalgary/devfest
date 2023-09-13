import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { getFirestore } from 'firebase-admin/firestore';

export const syncSessionizeSessions = functions.pubsub
  .schedule('every 5 minutes')
  .timeZone('America/Edmonton')
  .onRun(async () => {
    try {
      const sessionizeUrl = 'https://sessionize.com/api/v2/o824blhv/view/Sessions';
      const headers = {
        'Content-Type': 'application/json',
      };

      interface SessionizeSession {
        description: string;
        icon: string;
        image: string;
        presentation: string;
        room: string;
        roomId: number;
        speakers: any[]; // Update with actual type
        tags: any[]; // Update with actual type
        title: string;
        videoID: string;
      }

      const response = await fetch(sessionizeUrl, { headers });
      const responseData = await response.json();

      let sessions: SessionizeSession[] = [];

      if (Array.isArray(responseData)) {
        sessions = responseData.map((session: any) => {
          return {
            description: session.description || 'No description available',
            icon: session.icon || '',
            image: session.image || '',
            presentation: session.presentation || '',
            room: session.room || '',
            roomId: session.roomId || 0,
            speakers: session.speakers || [],
            tags: session.tags || [],
            title: session.title || '',
            videoID: session.videoID || '',
          };
        });
      }

      const db = getFirestore();
      const batch = db.batch();
      sessions.forEach((session: SessionizeSession) => {
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
