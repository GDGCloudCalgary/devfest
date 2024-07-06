import { firestore } from './firebase-config';
import { importConfig } from './firestore-init/config';

const newSpeakers: { [key: string]: object } = {};
const newSessions: { [key: string]: object } = {};
const newSchedule: { [key: string]: object } = {};

const sessionizeSpeakers: any[] = [];

const sessionizeSessions: any[] = [];

const sessionizeSchedule: any[] = [];

interface Social {
  name: string;
  link: string;
  icon: string;
}

const teams: any[] = [];

export const importSchedule = () => {
  for (const scheduleData of sessionizeSchedule) {
    const scheduleId = scheduleData.date.substring(0, 10);
    const date = new Date(scheduleId);
    const timeslots: any[] = [];
    let tracks: any[] = [];
    const timeslotMap: { [key: string]: any } = {};
    for (const timeSlot of scheduleData.timeSlots) {
      for (const room of timeSlot.rooms) {
        tracks.push(room.name);
        if (
          !timeslotMap[
          room.session.startsAt.substring(11, 16) + '/' + room.session.endsAt.substring(11, 16)
          ]
        ) {
          timeslotMap[
            room.session.startsAt.substring(11, 16) + '/' + room.session.endsAt.substring(11, 16)
          ] = [];
        }
        timeslotMap[
          room.session.startsAt.substring(11, 16) + '/' + room.session.endsAt.substring(11, 16)
        ].push({
          items: [room.session.id],
        });
      }
    }
    for (const time of Object.keys(timeslotMap)) {
      timeslots.push({
        endTime: time.split('/')[1],
        sessions: timeslotMap[time],
        startTime: time.split('/')[0],
      });
    }
    tracks = [...new Set(tracks)];
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    newSchedule[scheduleId] = {
      date: scheduleId,
      dateReadable: DAYS[date.getDay()] + ' ' + date.getUTCDate(),
      timeslots,
      tracks,
    };
  }
  const docs: { [key: string]: object } = newSchedule;
  if (!Object.keys(docs).length) {
    return Promise.resolve();
  }
  console.log('Importing schedule...');

  const batch = firestore.batch();

  Object.keys(docs).forEach((docId) => {
    batch.set(firestore.collection('schedule').doc(docId), {
      ...docs[docId],
      date: docId,
    });
  });

  return batch.commit().then(() => {
    console.log('Imported data for', Object.keys(docs).length, 'days');
  });
};

export const importSessions = () => {
  for (const sessionData of sessionizeSessions) {
    const sessionId = sessionData.id;
    newSessions[sessionId] = {
      complexity:
        sessionData.categories?.find((c: any) => c.name.includes('Level'))?.categoryItems?.[0]
          ?.name || '',
      description: sessionData.description || '',
      language:
        sessionData.categories?.find((c: any) => c.name.includes('Language'))?.categoryItems?.[0]
          ?.name || '',
      sessionFormat:
        sessionData.categories?.find((c: any) => c.name.includes('Session format'))
          ?.categoryItems?.[0]?.name || '',
      speakers:
        sessionData.speakers?.map((speaker: any) => speaker.name.toLowerCase().replace(' ', '_')) ||
        [],
      mainTag:
        sessionData.categories?.find((c: any) => c.name.includes('Track'))?.categoryItems?.[0]
          ?.name || '',
      tags: sessionData.categories?.find((c: any) => c.name.includes('Track'))?.categoryItems?.[0]
        ?.name
        ? [
          sessionData.categories?.find((c: any) => c.name.includes('Track'))?.categoryItems?.[0]
            ?.name,
        ]
        : [],
      title: sessionData.title || '',
      id: sessionId || '',
      roomId: sessionData.roomId || '',
      room: sessionData.room || '',
      status: sessionData.status || '',
      startsAt: sessionData.startsAt,
      endsAt: sessionData.endsAt,
      year: ['2024'],
    };
  }
  const docs: { [key: string]: object } = newSessions;
  if (!Object.keys(docs).length) {
    return Promise.resolve();
  }
  console.log('Importing sessions...');

  const batch = firestore.batch();

  Object.keys(docs).forEach((docId) => {
    batch.set(firestore.collection('sessions').doc(docId), docs[docId]);
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'sessions');
  });
};

export const importSpeakers = async () => {
  for (const speakerData of sessionizeSpeakers) {
    const speakerId = speakerData.fullName.toLowerCase().replace(' ', '_');
    let speakerDoc = await firestore.collection('speakers').doc(speakerId).get();
    const socialsData = speakerData.links || [];
    const socials: Social[] = socialsData.map((socialData: any) => {
      return {
        icon: socialData.linkType.toLowerCase(),
        name: socialData.title,
        link: socialData.url,
      };
    });
    newSpeakers[speakerId] = {
      bio: speakerData.bio || '',
      company:
        speakerData.questionAnswers.find((q: any) => q.question.includes('Current Organization'))
          ?.answer || '',
      companyLogo:
        speakerData.questionAnswers.find((answer: any) => answer.question.includes('Company Logo'))
          ?.answerExtra || '',
      companyLogoUrl:
        speakerData.questionAnswers.find((answer: any) => answer.question.includes('Company Logo'))
          ?.answer || '',
      featured: speakerData.isTopSpeaker || false,
      name: speakerData.fullName || '',
      photo: speakerData.profilePicture || '',
      photoUrl: speakerData.profilePicture || '',
      shortBio: speakerData.bio || '',
      socials: socials,
      title: speakerData.tagLine || '',
      id: speakerId || '',
      sessionizeId: speakerData.id || '',
      year: speakerDoc.exists ? [...new Set([...(speakerDoc.data() as any).year, '2024'])] : ['2024'],
    };
  }
  const speakers: { [key: string]: object } = newSpeakers;
  if (!Object.keys(speakers).length) {
    return Promise.resolve();
  }
  console.log('Importing', Object.keys(speakers).length, 'speakers...');

  const batch = firestore.batch();

  Object.keys(speakers).forEach((speakerId, order) => {
    batch.set(firestore.collection('speakers').doc(speakerId), {
      ...speakers[speakerId],
      order,
    });
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'speakers');
  });
};

export const importTeams = async () => {
  const batch = firestore.batch();

  Object.keys(teams).forEach((teamId) => {
    const team = teams[Number(teamId)];
    if (team) {
      batch.set(firestore.collection('team').doc(teamId), {
        title: team.title,
      });

      team.members.forEach((member: any, id: number) => {
        batch.set(
          firestore.collection('team').doc(`${teamId}`).collection('members').doc(`${id}`),
          member
        );
      });
    } else {
      console.warn(`Skipping missing team ${teamId}`);
    }
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'documents');
  });
}

importConfig() // Should always be first
  .then(() => importSchedule())
  .then(() => importSessions())
  .then(() => importSpeakers())
  // .then(() => importTeams())
  .then(() => {
    console.log('Finished');
    process.exit();
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit();
  });
