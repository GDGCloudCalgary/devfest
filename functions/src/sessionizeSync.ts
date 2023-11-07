import * as functions from 'firebase-functions';
import fetch, { Response } from 'node-fetch';
import { getFirestore } from 'firebase-admin/firestore';

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
            const headers = {
                'Content-Type': 'application/json',
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
        } catch (error) {
            functions.logger.error('Error syncing speakers:', error);
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
            dateReadable: `${DAYS[date.getDay() - 1]} ${date.getUTCDate()}, ${date.getFullYear()}`,
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

    const batch = db.batch();

    Object.keys(docs).forEach((docId) => {
        batch.set(db.collection('sessions').doc(docId), docs[docId]);
    });

    return batch.commit().then((results) => {
        functions.logger.log('Imported data for', results.length, 'sessions');
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
        });
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
