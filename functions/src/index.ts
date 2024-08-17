// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { initializeApp } from 'firebase-admin/app';
import { saveUserData } from './save-user-data.js';
import { mailchimpSubscribe } from './mailchimp-subscribe.js';
import { sendGeneralNotification } from './notifications.js';
import { optimizeImages } from './optimize-images.js';
import { scheduleNotifications } from './schedule-notifications.js';
import { sessionizeSync } from './sessionize-sync.js';
import { scheduledTasks } from './tasks.js';

initializeApp();

export {
  saveUserData,
  sendGeneralNotification,
  scheduleNotifications,
  optimizeImages,
  mailchimpSubscribe,
  sessionizeSync,
  scheduledTasks
};
