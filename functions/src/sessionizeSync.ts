import * as functions from 'firebase-functions';
import fetch, { Response, HeadersInit } from 'node-fetch';
import { getFirestore } from 'firebase-admin/firestore';
import { sessionsSpeakersMap } from './schedule-generator/speakers-sessions-map.js';
import { sessionsSpeakersScheduleMap } from './schedule-generator/speakers-sessions-schedule-map.js';
import { isEmpty, ScheduleMap, SessionMap, snapshotToObject, SpeakerMap } from './utils.js';

interface Social {
    name: string;
    link: string;
    icon: string;
}

export const sessionizeSync = functions.pubsub
    .schedule('every 5 minutes')
    .timeZone('America/Edmonton')
    .onRun(async () => {
        try {
            const scheduleUrl = 'https://sessionize.com/api/v2/o824blhv/view/GridSmart';
            const sessionsUrl = 'https://sessionize.com/api/v2/o824blhv/view/Sessions';
            const speakersUrl = 'https://sessionize.com/api/v2/o824blhv/view/Speakers';
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                cache: "no-store"
            };

            const responses: Promise<Response>[] = [];
            responses.push(fetch(scheduleUrl, { headers }));
            responses.push(fetch(sessionsUrl, { headers }));
            responses.push(fetch(speakersUrl, { headers }));

            const [scheduleResponse, sessionsResponse, speakersResponse] = await Promise.all(responses);

            const scheduleResponseData = await scheduleResponse.json();
            const sessionsResponseData = await sessionsResponse.json();
            const speakersResponseData = await speakersResponse.json();

            const sessionizeSchedule = scheduleResponseData as any[];
            const sessionizeSessions = sessionsResponseData?.[0]?.sessions as any[];
            const sessionizeSpeakers = speakersResponseData as any[];

            await importSchedule(sessionizeSchedule);
            await importSessions(sessionizeSessions);
            await importSpeakers(sessionizeSpeakers);
            await generateAndSaveData();
        } catch (error) {
            functions.logger.error('Error syncing:', error);
            return null;
        }
    });

const importSchedule = async (sessionizeSchedule: any[] = []) => {
    const newSchedule: { [key: string]: object } = {};
    const db = getFirestore();

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
            dateReadable: `${DAYS[date.getUTCDay() - 1]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`,
            timeslots,
            tracks,
        };
    }
    const docs: { [key: string]: object } = newSchedule;
    if (!Object.keys(docs).length) {
        return Promise.resolve();
    }
    functions.logger.log('Importing schedule...');

    const batch = db.batch();

    Object.keys(docs).forEach((docId) => {
        batch.set(db.collection('schedule').doc(docId), {
            ...docs[docId],
            date: docId,
        });
    });

    return batch.commit().then(() => {
        functions.logger.log('Imported data for', Object.keys(docs).length, 'days');
    });
};

const importSessions = async (sessionizeSessions: any[] = []) => {
    const newSessions: { [key: string]: object } = {};
    const db = getFirestore();
    const batch = db.batch();
    const existingSessions = await db.collection('sessions').where('year', 'array-contains', '2023').get();
    const removedSessions = existingSessions.docs.filter((doc) => !sessionizeSessions.find((s) => s.id === doc.id));

    for (const session of removedSessions) {
        batch.delete(session.ref);
        batch.delete(db.doc(`${session.ref.path.replace('sessions', 'generatedSessions')}`));
    }

    for (const sessionData of sessionizeSessions) {
        const sessionId = sessionData.id;
        let icon: string;

        switch (true) {
            case sessionData.title?.toLowerCase()?.includes('registration'): icon = 'registration'; break;
            case sessionData.title?.toLowerCase()?.includes('lunch'): icon = 'lunch'; break;
            case sessionData.title?.toLowerCase()?.includes('coffee'): icon = 'coffee-break'; break;
            case sessionData.title?.toLowerCase()?.includes('opening'): icon = 'opening'; break;
            case sessionData.title?.toLowerCase()?.includes('party'):
            case sessionData.title?.toLowerCase()?.includes('nocturnal'): icon = 'party'; break;
        }

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
            liveUrl: sessionData.liveUrl || null,
            year: [`${new Date(sessionData.startsAt).getUTCFullYear()}`]
        };

        if (icon) {
            newSessions[sessionId]['icon'] = icon;
        }
    }
    const docs: { [key: string]: object } = newSessions;
    if (!Object.keys(docs).length) {
        return Promise.resolve();
    }
    functions.logger.log('Importing sessions...');

    Object.keys(docs).forEach((docId) => {
        batch.set(db.collection('sessions').doc(docId), docs[docId]);
    });

    return batch.commit().then((results) => {
        functions.logger.log('Imported data for', results.length, 'sessions');
        functions.logger.log('Removed data for', removedSessions.length, 'sessions');
    });
};

const importSpeakers = async (sessionizeSpeakers: any[] = []) => {
    const newSpeakers: { [key: string]: object } = {};
    const db = getFirestore();

    for (const speakerData of sessionizeSpeakers) {
        const speakerId = speakerData.fullName.toLowerCase().replace(' ', '_');
        let speakerDoc = await db.collection('speakers').doc(speakerId).get();
        const socialsData = speakerData.links || [];
        const socials: Social[] = socialsData.map((socialData: any) => {
            return {
                icon: socialData.linkType.toLowerCase(),
                name: socialData.title,
                link: socialData.url,
            };
        }).filter((value: any, index: number, self: any[]) =>
            index === self.findIndex((t) => (
                t.link === value.link
            ))
        );
        newSpeakers[speakerId] = {
            bio: speakerData.bio || '',
            company:
                speakerData.questionAnswers.find((q: any) => q.question.includes('Current Company'))
                    ?.answer || '',
            companyLogo:
                speakerData.questionAnswers.find((answer: any) => answer.question.includes('Logo'))
                    ?.answerExtra || '',
            companyLogoUrl:
                speakerData.questionAnswers.find((answer: any) => answer.question.includes('Logo'))
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
            year: speakerDoc.exists ? [...new Set([...(speakerDoc.data() as any).year, '2023'])] : ['2023'],
        };
    }
    const speakers: { [key: string]: object } = newSpeakers;
    if (!Object.keys(speakers).length) {
        return Promise.resolve();
    }
    functions.logger.log('Importing', Object.keys(speakers).length, 'speakers...');

    const batch = db.batch();

    Object.keys(speakers).forEach((speakerId, order) => {
        batch.set(db.collection('speakers').doc(speakerId), {
            ...speakers[speakerId],
            order,
        });
    });

    return batch.commit().then((results) => {
        functions.logger.log('Imported data for', results.length, 'speakers');
    });
};

const fetchData = () => {
    const sessionsPromise = getFirestore().collection('sessions').get();
    const schedulePromise = getFirestore().collection('schedule').orderBy('date', 'desc').get();
    const speakersPromise = getFirestore().collection('speakers').get();

    return Promise.all([sessionsPromise, schedulePromise, speakersPromise]);
};

async function generateAndSaveData(changedSpeaker?: any) {
    const [sessionsSnapshot, scheduleSnapshot, speakersSnapshot] = await fetchData();

    const sessions = snapshotToObject(sessionsSnapshot);
    const schedule = snapshotToObject(scheduleSnapshot);
    const speakers = snapshotToObject(speakersSnapshot);

    let generatedData: {
        sessions?: {};
        speakers?: {};
        schedule?: {};
    } = {};
    if (!Object.keys(sessions).length) {
        generatedData.speakers = { ...speakers };
    } else if (!(await isScheduleEnabled()) || !Object.keys(schedule).length) {
        generatedData = sessionsSpeakersMap(sessions, speakers);
    } else {
        generatedData = sessionsSpeakersScheduleMap(sessions, speakers, schedule);
    }

    // If changed speaker does not have assigned session(s) yet
    if (changedSpeaker && !generatedData.speakers[changedSpeaker.id]) {
        generatedData.speakers[changedSpeaker.id] = changedSpeaker;
    }

    saveGeneratedData(generatedData.sessions, 'generatedSessions');
    saveGeneratedData(generatedData.speakers, 'generatedSpeakers');
    saveGeneratedData(generatedData.schedule, 'generatedSchedule');
}

function saveGeneratedData(data: SessionMap | SpeakerMap | ScheduleMap, collectionName: string) {
    if (isEmpty(data)) {
        functions.logger.error(
            `Attempting to write empty data to Firestore collection: "${collectionName}".`
        );
        return;
    }

    for (let index = 0; index < Object.keys(data).length; index++) {
        const key = Object.keys(data)[index];
        getFirestore().collection(collectionName).doc(key).set(data[key]);
    }
}

const isScheduleEnabled = async (): Promise<boolean> => {
    const doc = await getFirestore().collection('config').doc('schedule').get();

    if (doc.exists) {
        return doc.data().enabled === 'true' || doc.data().enabled === true;
    } else {
        functions.logger.error(
            'Schedule config is not set. Set the `config/schedule.enabled=true` Firestore value.'
        );
        return false;
    }
};
