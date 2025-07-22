import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import store from '@/store';
import UnderMaintenance from '@/components/UnderMaintenance.vue';

// Public views
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import About from '@/views/About.vue';
import Services from '@/views/Services.vue';
import Announcements from '@/views/Announcements.vue';
import PendingApproval from '@/views/PendingApproval.vue';

// Resident components
import ResidentDashboard from '@/components/resident/ResidentDashboard.vue';
import ResidentProfile from '@/components/resident/ResidentProfile.vue';
import RequestForm from '@/components/resident/RequestForm.vue';

// Barangay Official components
import OfficialDashboard from '@/components/official/OfficialDashboard.vue';
import ManageResidents from '@/components/official/ManageResidents.vue';
import ManageRequests from '@/components/official/ManageRequests.vue';

// SK Official components
import SKDashboard from '@/components/sk/SKDashboard.vue';
import SKProjects from '@/components/sk/SKProjects.vue';
import SKMember from '@/components/sk/SKMember.vue';

// Admin components
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home, 
    meta: { 
      title: 'Home',
      showLayout: true 
    } 
  },
  { 
    path: '/login', 
    name: 'login', 
    component: Login, 
    meta: { 
      requiresGuest: true, 
      title: 'Login',
      showLayout: true 
    } 
  },
  { 
    path: '/register', 
    name: 'register', 
    component: Register, 
    meta: { 
      requiresGuest: true, 
      title: 'Register',
      showLayout: true 
    } 
  },
  { 
    path: '/about', 
    name: 'about', 
    component: About, 
    meta: { 
      title: 'About',
      showLayout: true 
    } 
  },
  { 
    path: '/services', 
    name: 'services', 
    component: Services, 
    meta: { 
      title: 'Services',
      showLayout: true 
    } 
  },
  { 
    path: '/announcements', 
    name: 'announcements', 
    component: Announcements, 
    meta: { 
      title: 'Announcements',
      showLayout: true 
    } 
  },
  { 
    path: '/pending-approval', 
    name: 'pending-approval', 
    component: PendingApproval, 
    meta: { 
      requiresAuth: true, 
      title: 'Pending Approval',
      showLayout: true 
    } 
  },

  // Resident routes
  { 
    path: '/resident/dashboard', 
    name: 'resident-dashboard', 
    component: ResidentDashboard, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['resident'], 
      title: 'Resident Dashboard',
      showLayout: true 
    } 
  },
  { 
    path: '/resident/profile', 
    name: 'resident-profile', 
    component: ResidentProfile, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['resident'], 
      title: 'Resident Profile',
      showLayout: true 
    } 
  },
  { 
    path: '/resident/request', 
    name: 'resident-request', 
    component: RequestForm, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['resident'], 
      title: 'Resident Request Form',
      showLayout: true 
    } 
  },

  // Barangay Official routes
  { 
    path: '/official/dashboard', 
    name: 'official-dashboard', 
    component: OfficialDashboard, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['official'], 
      title: 'Official Dashboard',
      showLayout: true 
    } 
  },
  { 
    path: '/official/residents', 
    name: 'official-residents', 
    component: ManageResidents, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['official'], 
      title: 'Manage Residents',
      showLayout: true 
    } 
  },
  { 
    path: '/official/requests', 
    name: 'official-requests', 
    component: ManageRequests, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['official'], 
      title: 'Manage Requests',
      showLayout: true 
    } 
  },

  // SK Official routes
  { 
    path: '/sk/dashboard', 
    name: 'sk-dashboard', 
    component: SKDashboard, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['sk'], 
      title: 'SK Dashboard',
      showLayout: true 
    } 
  },
  { 
    path: '/sk/forum', 
    name: 'sk-forum', 
    component: SKProjects, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['sk'], 
      title: 'SK forum',
      showLayout: true 
    } 
  },
  { 
    path: '/sk/members', 
    name: 'sk-member', 
    component: SKMember, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['sk'], 
      title: 'SK Member',
      showLayout: true 
    } 
  },

  // Admin routes
  { 
    path: '/admin/dashboard', 
    name: 'admin-dashboard', 
    component: AdminDashboard, 
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['admin'], 
      title: 'Admin Dashboard',
      showLayout: true 
    } 
  },

  // Maintenance route
  { 
    path: '/maintenance', 
    name: 'maintenance', 
    component: UnderMaintenance, 
    meta: { 
      title: 'Under Maintenance',
      showLayout: false 
    } 
  },

  // Catch-all
  { 
    path: '/404', 
    name: 'NotFound', 
    component: NotFound,
    meta: {
      showLayout: true
    } 
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/404' 
  },

  {
    path: '/id/:residentId',
    name: 'id-generator',
    component: () => import('@/components/IDGenerator.vue'),
    meta: { 
      requiresAuth: true,
      showLayout: true 
    }
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import('@/components/VerificationPage.vue'),
    meta: {
      showLayout: true
    }
  },
  {
    path: '/verify/:idNumber',
    name: 'verify-id',
    component: () => import('@/components/VerificationPage.vue'),
    meta: {
      showLayout: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Dashboard route redirect helper
function getDashboardRoute(role) {
  const routes = {
    resident: { name: 'resident-dashboard' },
    official: { name: 'official-dashboard' },
    sk: { name: 'sk-dashboard' },
    admin: { name: 'admin-dashboard' },
  };
  return routes[role] || { name: 'home' };
}

// Router guard
router.beforeEach(async (to, from, next) => {
  // First check maintenance status
  let maintenanceEnabled = false;
  try {
    const maintenanceDoc = await getDoc(doc(db, 'system', 'maintenance'));
    if (maintenanceDoc.exists()) {
      maintenanceEnabled = maintenanceDoc.data().enabled || false;
    }
    // Store maintenance status in Vuex
    store.commit('setMaintenance', maintenanceEnabled);
  } catch (err) {
    console.error('Error checking maintenance status:', err);
  }

  await auth.authStateReady();
  const currentUser = auth.currentUser;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const allowedRoles = to.meta.allowedRoles || [];

  // Set document title
  document.title = to.meta.title ? `${to.meta.title} | Barangay Information System` : 'Barangay Information System';

  // Check if user is admin
  let isAdmin = false;
  if (currentUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        isAdmin = userDoc.data().role === 'admin';
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  }

  // Maintenance mode handling
  if (maintenanceEnabled && !isAdmin && to.name !== 'maintenance') {
    // Force showLayout to false when redirecting to maintenance
    to.meta.showLayout = false;
    return next({ name: 'maintenance' });
  }

  if (!maintenanceEnabled && to.name === 'maintenance') {
    return next({ name: 'home' });
  }

  // Not logged in and route needs auth
  if (requiresAuth && !currentUser) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // Logged in but on guest-only page (login/register)
  if (requiresGuest && currentUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        store.commit('setAuth', {
          uid: currentUser.uid,
          email: currentUser.email,
          name: userData.name,
          approved: userData.isApproved,
          role: userData.role,
        });
        
        // If user is not approved, allow them to stay on pending-approval
        if (!userData.isApproved && to.name === 'pending-approval') {
          return next();
        }
        
        return next(getDashboardRoute(userData.role));
      }
    } catch (err) {
      console.error('Error on guest redirect:', err);
    }
    return next({ name: 'home' });
  }

  // Refresh case: logged in but store is empty
  if (currentUser && !store.state.auth.user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        store.commit('setAuth', {
          uid: currentUser.uid,
          email: currentUser.email,
          name: userData.name,
          approved: userData.isApproved,
          role: userData.role,
        });

        // If user is not approved and trying to access other routes
        if (!userData.isApproved && to.name !== 'pending-approval') {
          return next({ name: 'pending-approval' });
        }

        // If on home page after refresh, redirect to dashboard
        if (to.path === '/') {
          return next(getDashboardRoute(userData.role));
        }
      } else {
        await auth.signOut();
        return next({ name: 'login' });
      }
    } catch (err) {
      console.error('Error on refresh:', err);
      await auth.signOut();
      return next({ name: 'login' });
    }
  }

  // Logged in user, checking approval & role
  if (requiresAuth && currentUser) {
    const user = store.state.auth.user;

    // If not approved yet and not already on pending-approval
    if (user && user.approved === false && to.name !== 'pending-approval') {
      return next({ name: 'pending-approval' });
    }

    // If approved but on pending-approval, redirect to dashboard
    if (user && user.approved === true && to.name === 'pending-approval') {
      return next(getDashboardRoute(user.role));
    }

    // Role not allowed for this route
    if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
      return next(getDashboardRoute(user.role));
    }
  }

  // Ensure showLayout is set for all routes
  if (to.meta.showLayout === undefined) {
    to.meta.showLayout = true;
  }

  next();
});

export default router;