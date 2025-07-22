import { createApp, h } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from '@/firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Font Awesome Setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Import Notification components
import Notification from '@/components/Notification.vue';
import NotificationService from '@/services/notification';

// Add all solid icons to the library
library.add(fas);

const app = createApp(App);

// Register Font Awesome globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Register Notification component globally
app.component('Notification', Notification);

// Register Notification service
app.use(NotificationService);

// Wait for Firebase Auth before mounting
auth.authStateReady().then(() => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          store.commit('setAuth', {
            uid: user.uid,
            email: user.email,
            name: userData.name,
            approved: userData.isApproved,
            role: userData.role,
          });

          if (router.currentRoute.value.path === '/') {
            const dashboardRoute = getDashboardRoute(userData.role);
            router.push(dashboardRoute);
          }
        } else {
          console.warn('No user document found.');
          app.config.globalProperties.$notify.warning('Your profile is incomplete. Please contact support.');
        }
      } catch (err) {
        console.error('Error fetching user document:', err);
        app.config.globalProperties.$notify.error('Failed to load user data. Please try again.');
      }
    } else {
      store.commit('clearAuth');
    }
  });

  app.use(store);
  app.use(router);
  app.mount('#app');
});

// Dashboard route helper
function getDashboardRoute(role) {
  const routes = {
    resident: { name: 'resident-dashboard' },
    official: { name: 'official-dashboard' },
    sk:       { name: 'sk-dashboard' },
    admin:    { name: 'admin-dashboard' },
  };
  return routes[role] || { name: 'home' };
}