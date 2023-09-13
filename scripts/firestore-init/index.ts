/* eslint-disable */
import { importBlog } from './blog';
import { importConfig } from './config';
import { importGallery } from './gallery';
import { importPartners } from './partners';
import { importPreviousSpeakers } from './previous-speakers';
import { importSchedule } from './schedule';
import { importSessions } from './sessions';
import { importSpeakers } from './speakers';
import { importTeam } from './team';
import { importTickets } from './tickets';
import { importVideos } from './videos';

// importConfig() // Should always be first
//   .then(() => importBlog())
//   .then(() => importGallery())
//   .then(() => importPartners())
//   .then(() => importPreviousSpeakers())
//   .then(() => importSchedule())
//   .then(() => importSessions())
//   .then(() => importSpeakers())
//   .then(() => importTeam())
//   .then(() => importTickets())
//   .then(() => importVideos())
//   .then(() => {
//     console.log('Finished');
//     process.exit();
//   })
//   .catch((err: Error) => {
//     console.log(err);
//     process.exit();
//   });

console.log(`CAUTION: This overwrites the data in Firestore.
    Only run this on a new Firebase project or if you know what you are doing.
    Uncomment the code in scripts/firestore-init/index.ts to run this script.`);
