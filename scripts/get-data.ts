import { firestore } from "./firebase-config";
import { importConfig } from "./firestore-init/config";

export const getSubscribers = async () => {
    const subscribersDocs = await firestore.collection("/subscribers").get();
    const subscribers = subscribersDocs.docs.map((doc) => doc.data() as any);
    subscribers.forEach(i => console.log(i.email));
};

importConfig() // Should always be first
  .then(async () => await getSubscribers())
  .then(() => {
    console.log('Finished');
    process.exit();
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit();
  });
