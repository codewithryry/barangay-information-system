<template>
  <div id="app">
    <!-- Logo Loader during initial auth check -->
    <div
      v-if="(loading || roleLoading) && !hideLoadingRoutes.includes($route.name)"
      class="loading-overlay"
    >
      <div class="loading-content">
        <img
          src="@/assets/bis-logo.png"
          alt="Loading..."
          class="loading-logo"
        />
      </div>
    </div>

    <!-- Main App Content -->
    <template v-else>
      <!-- Maintenance mode check -->
      <template v-if="!maintenanceMode || isAdmin">
        <!-- Role-specific navbars -->
        <ResidentNav v-if="showNav && userRole === 'resident'" />
        <OfficialNav v-if="showNav && userRole === 'official'" />
        <SKNav v-if="showNav && userRole === 'sk'" />
        <AdminNav v-if="showNav && userRole === 'admin'" />
        <!-- Public navbar when not logged in -->
        <NavBar v-if="showNav && userRole === null && !$route.meta.hideLayout" />

        <!-- Notifications -->
        <Notification />

        <!-- Router outlet -->
        <main>
          <router-view />
        </main>

        <!-- Footer -->
        <Footer v-if="showFooter && !$route.meta.hideLayout" />
      </template>

      <!-- Maintenance mode content -->
      <UnderMaintenance v-if="maintenanceMode && !isAdmin" />
    </template>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar'
import ResidentNav from '@/components/resident/ResidentNav'
import OfficialNav from '@/components/official/OfficialNav'
import SKNav from '@/components/sk/SKNav'
import AdminNav from '@/components/admin/AdminNav'
import Footer from '@/components/common/Footer'
import Notification from '@/components/common/Notification'
import UnderMaintenance from '@/components/UnderMaintenance.vue'

export default {
  components: {
    NavBar,
    ResidentNav,
    OfficialNav,
    SKNav,
    AdminNav,
    Footer,
    Notification,
    UnderMaintenance
  },
  data() {
    return {
      loading: true,
      roleLoading: true,
      hideLoadingRoutes: [
        'home',
        'about',
        'services',
        'announcements',
        'login',
        'register',
        'NotFound',
        'maintenance'
      ]
    }
  },
  computed: {
    showNav() {
      return this.$route.name !== 'login' && 
             this.$route.name !== 'register' && 
             this.$route.name !== 'NotFound' &&
             !this.$route.meta.hideLayout;
    },
    showFooter() {
      const noFooterRoutes = ['login', 'register', 'admin-dashboard', 'NotFound'];
      return !noFooterRoutes.includes(this.$route.name) && !this.$route.meta.hideLayout;
    },
    userRole() {
      return this.$store.state.auth.user?.role ?? null;
    },
    maintenanceMode() {
      return this.$store.state.maintenance;
    },
    isAdmin() {
      return this.userRole === 'admin';
    }
  },
  watch: {
    userRole(newVal) {
      if (newVal !== undefined && newVal !== null) {
        this.roleLoading = false;
      }
    },
    '$route'(to) {
      // Update document title based on route meta
      document.title = to.meta.title ? 
        `${to.meta.title} | Barangay Information System` : 
        'Barangay Information System';
    }
  },
  async created() {
    try {
      await this.$store.dispatch('auth/initializeAuth');
      // Check maintenance status when app initializes
      await this.$store.dispatch('checkMaintenanceStatus');
    } catch (e) {
      console.error('Error initializing auth:', e);
    }

    this.loading = false;

    if (this.userRole !== undefined && this.userRole !== null) {
      this.roleLoading = false;
    }
  }
}
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  z-index: 9999;
  flex-direction: column;
}

.loading-content {
  text-align: center;
}

.loading-logo {
  width: 400px;
  height: auto;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>