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
      const sessionizeUrl = 'https://sessionize.com/api/v2/o824blhv/view/Sessions';
      const headers = {
        'Content-Type': 'application/json'
      };

      interface SessionizeSession {
        // Define your SessionizeSession properties here
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

      // Inside your function
      const response = await fetch(sessionizeUrl, { headers });
      const responseData = await response.json();

      let sessions: SessionizeSession[] = [];

      if (Array.isArray(responseData)) {
        sessions = responseData.map((session: any) => {
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
      } else if (typeof responseData === 'object') {
        const sessionKeys = Object.keys(responseData);
        for (const key of sessionKeys) {
          // Extract session data based on the actual key structure
          const sessionData = responseData[key];
          sessions.push({
            // Mapping for session data
            description: sessionData.description,
            icon: sessionData.icon,
            image: sessionData.image,
            presentation: sessionData.presentation,
            room: sessionData.room,
            roomId: sessionData.roomId,
            speakers: sessionData.speakers,
            tags: sessionData.tags,
            title: sessionData.title,
            videoID: sessionData.videoID,
          });
        }
      }

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
