import { register } from 'register-service-worker';
import { store } from './store';
import { queueComplexSnackbar, queueSnackbar } from './store/snackbars';
import { CONFIG, getConfig } from './utils/config';
import {
  refresh,
  serviceWorkerAvailable,
  serviceWorkerError,
  serviceWorkerInstalled,
  serviceWorkerInstalling,
} from './utils/data';

register('service-worker.js', {
  registrationOptions: { scope: getConfig(CONFIG.BASEPATH) },
  cached() {
    // store.dispatch(queueSnackbar(serviceWorkerInstalled));
    console.log(serviceWorkerInstalled);
  },
  updated() {
    store.dispatch(
      queueComplexSnackbar({
        label: serviceWorkerAvailable,
        action: {
          title: refresh,
          callback: () => window.location.reload(),
        },
      })
    );
  },
  updatefound() {
    // store.dispatch(queueSnackbar(serviceWorkerInstalling));
    console.log(serviceWorkerInstalling);
  },
  error(e) {
    console.error('Service worker registration failed:', e);
    console.log(serviceWorkerError);
    // store.dispatch(queueSnackbar(serviceWorkerError));
  },
});
