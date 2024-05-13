// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { initializeApp } from 'firebase-admin/app';
import { mailchimpSubscribe } from './mailchimp-subscribe.js';
import { sendGeneralNotification } from './notifications.js';
import { optimizeImages } from './optimize-images.js';
import { scheduleNotifications } from './schedule-notifications.js';
import { sessionizeSync } from './sessionizeSync.js';

initializeApp();

export {
  sendGeneralNotification,
  scheduleNotifications,
  optimizeImages,
  mailchimpSubscribe,
  sessionizeSync
};
