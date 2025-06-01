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
        <!-- <p class="loading-text">Welcome! Getting things ready for you…</p> -->
      </div>
    </div>

    <!-- Main App Content -->
    <template v-else>
      <!-- Debug info for development -->
      <!-- <div
        style="position: fixed; top: 0; left: 0; background: #f9f9f9; padding: 10px; font-size: 14px; z-index: 10000; max-width: 320px; border: 1px solid #ccc;"
      >
        <strong>Debug Info:</strong><br />
        <b>Route Name:</b> {{ $route.name }}<br />
        <b>showNav:</b> {{ showNav }}<br />
        <b>showFooter:</b> {{ showFooter }}<br />
        <b>userRole:</b> {{ userRole }}<br />
        <b>loading:</b> {{ loading }}<br />
        <b>roleLoading:</b> {{ roleLoading }}<br />
        <b>Show ResidentNav:</b> {{ showNav && userRole === 'resident' }}<br />
        <b>Show OfficialNav:</b> {{ showNav && userRole === 'official' }}<br />
        <b>Show SKNav:</b> {{ showNav && userRole === 'sk' }}<br />
        <b>Show AdminNav:</b> {{ showNav && userRole === 'admin' }}<br />
        <b>Show Public NavBar:</b> {{ showNav && userRole === null }}<br />
      </div> -->

      <!-- Role-specific navbars -->
      <ResidentNav v-if="showNav && userRole === 'resident'" />
      <OfficialNav v-if="showNav && userRole === 'official'" />
      <SKNav v-if="showNav && userRole === 'sk'" />
      <AdminNav v-if="showNav && userRole === 'admin'" />
      <!-- Public navbar when not logged in -->
      <NavBar v-if="showNav && userRole === null" />

      <!-- Notifications -->
      <Notification />

      <!-- Router outlet -->
      <main>
        <router-view />
      </main>

      <!-- Footer -->
      <Footer v-if="showFooter" />
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

export default {
  components: {
    NavBar,
    ResidentNav,
    OfficialNav,
    SKNav,
    AdminNav,
    Footer,
    Notification
  },
  data() {
    return {
      loading: true,
      roleLoading: true,
      // routes where loading overlay should NOT show
    hideLoadingRoutes: [
    'home',
    'about',
    'services',
    'announcements',
    'login',
    'register',
    'NotFound'
  ]

    }
  },
  computed: {
    showNav() {
      return this.$route.name !== 'login' && this.$route.name !== 'register' && this.$route.name !== 'NotFound';
    },
    showFooter() {
      const noFooterRoutes = ['login', 'register', 'admin-dashboard', 'NotFound'];
      return !noFooterRoutes.includes(this.$route.name);
    },
    userRole() {
      return this.$store.state.auth.user?.role ?? null;
    }
  },
  watch: {
    userRole(newVal) {
      console.log('[Watcher] userRole changed:', newVal);
      if (newVal !== undefined && newVal !== null) {
        this.roleLoading = false;
      }
    }
  },
  async created() {
    console.log('[Created] Initializing auth...');
    try {
      await this.$store.dispatch('auth/initializeAuth');
      console.log('[Created] Auth initialized');
    } catch (e) {
      console.error('[Created] Error initializing auth:', e);
    }

    this.loading = false;

    // If userRole already available after init
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

.loading-text {
  font-size: 1.2rem;
  margin-top: 20px;
  color: #333;
  font-weight: 500;
  font-family: 'Segoe UI', sans-serif;
  animation: fadeIn 1s ease-in-out;
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
