/* eslint-disable */
import { getData, saveData } from './utils';

// const [, , source, destination] = process.argv;

// if (!source || !destination) {
//   throw new Error('source and destination parameters are required');
// }

// getData(source)
//   .then((data) => saveData(data, destination))
//   .then(() => console.log('Success! 🔥'))
//   .catch((error) => console.log('Error! 💩', error));

console.log(`CAUTION: This overwrites the data in Firestore.
    Only run this on a new Firebase project or if you know what you are doing.
    Uncomment the code in scripts/firestore-copy/index.ts to run this script.`);
