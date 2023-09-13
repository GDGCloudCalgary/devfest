/* eslint-disable */
import { firestore } from '../firebase-config';
import data from '../../docs/default-firebase-data.json';

export const importConfig = async () => {
  console.log(`CAUTION: This overwrites the data in Firestore.
    Only run this on a new Firebase project or if you know what you are doing.
    Uncomment the code in scripts/firestore-init/config.ts to run this script.`);
  // const docs: { [key: string]: object } = data.config;
  // if (!Object.keys(docs).length) {
  //   return Promise.resolve();
  // }
  // console.log('Importing config...');

  // const batch = firestore.batch();

  // Object.keys(docs).forEach((docId) => {
  //   batch.set(firestore.collection('config').doc(docId), docs[docId]);
  // });

  // return batch.commit().then((results) => {
  //   console.log('Imported data for', results.length, 'config');
  // });
  return true;
};
