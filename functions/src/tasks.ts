import * as functions from 'firebase-functions/v1';
import { DocumentData, FieldValue, getFirestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { transitionSiteStateTask, WebsiteState } from './models/tasks';

const workers = {
    transitionSiteState
};

async function transitionSiteState(task: transitionSiteStateTask) {
    // get the next state
    const currentState = task.currentState;
    const nextState = String(Number(currentState) + 1);

    const today = new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' });
    let [month, date] = today.split(',')[0].split('/');
    month = month.padStart(2, '0');
    date = date.padStart(2, '0');

    // get the next state doc
    const nextStateRef = getFirestore().doc(`config/site/States/${nextState}`);
    const nextStateSnap = await nextStateRef.get();
    const nextStateData = nextStateSnap.data();
    const nextStateDate = nextStateData?.date; // format MM-DD

    // if next state doesn't exist or this is the last state, return
    if (!nextStateSnap.exists) {
        functions.logger.log('No next state found, current state:', currentState, 'next state:', nextState);
        return;
    }

    // if today is before the next state date, return
    if (`${month}-${date}` < nextStateDate) {
        functions.logger.log('Today is before the next state date', `${month}-${date}`, nextStateDate);
        return;
    }

    // if today is the next state date, update the current state
    const currentDocRef = getFirestore().doc(`config/site/States/current`);
    await currentDocRef.update({ ...nextStateData });
    functions.logger.log('Updated current state to', nextStateSnap.id, 'today:', `${month}-${date}`, 'next state date:',
        nextStateDate);

    return { currentState: nextStateSnap.id as WebsiteState };
}

async function execute(taskSnapshot: QueryDocumentSnapshot<DocumentData>) {

    const task = taskSnapshot.data();
    const key = taskSnapshot.id;
    const ref = getFirestore().collection('tasks').doc(key);

    try {

        // execute worker for task
        let update = await workers[task.worker](task);

        update = {
            ...(update ?? {}),
            time: task.time + (task.interval ?? 0),
            runs: (task.runs || 0) + 1,
            interval: (task.interval ?? 0)
        };

        if (task.cursor !== null && typeof task.cursor !== 'undefined') {
            update.cursor = task.cursor;
        } else if (task.cursor === null) {
            update.cursor = null;
        }

        if (task.failedUpdates?.length > 0) {
            update.failedUpdates = task.failedUpdates;
        } else if (task.failedUpdates?.length === 0) {
            update.failedUpdates = FieldValue.delete();
        }

        // If the task is ready to be deleted, delete it, otherwise update it
        if (task.delete) {
            await ref.delete();
            functions.logger.log('removed task:', task);
        } else {
            await ref.update(update);
            functions.logger.log('updated task');
        }

        return 1; // === success
    } catch (err) {
        // If error, update fail count and error message
        functions.logger.error(err);
        await ref.update({
            err: (err as any).message,
            failures: (task.failures || 0) + 1
        });

        return 0; // === error
    }
}

export function sum(acc: number, num: number): number {
    return acc + num;
}

/**
 * This function is used to get scheduledTasks
 */
export const scheduledTasks = functions.runWith({
    maxInstances: 2
}).pubsub
    .schedule('every 1 hours')
    .timeZone('America/Edmonton')
    .onRun(async () => {
        try {
            const queueRef = getFirestore().collection('tasks'); // This is a reference to the tasks collection
            // Get all tasks that with expired times
            const tasks = await queueRef.orderBy('time').endAt(Date.now()).get();
            let taskCount = 0;
            let message = '';
            const promises = [];
            for (const task of tasks.docs) {
                if (!task.data().active) {
                    continue;
                }
                taskCount += 1;
                promises.push(execute(task));
            }

            if (taskCount === 0) {
                message = `Task queue empty`;
                functions.logger.log(message);
                return Promise.resolve(message);
            } else {
                const results: number[] = (await Promise.allSettled(promises))
                    .map(promise => promise.status === 'rejected' ? 0 : 1);
                const successCount = results.reduce(sum);
                const failureCount = results.length - successCount;

                message = `Work completed successfully. ${successCount} succeeded, ${failureCount} failed`;
                functions.logger.log(message);
                return Promise.resolve(message);
            }
        } catch (err) {
            functions.logger.error(err);
            return Promise.reject('Internal server error');
        }
    });
