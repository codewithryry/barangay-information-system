<template>
  <nav class="navbar-modern">
    <div class="container">
      <!-- Brand Logo -->
      <router-link to="/" class="navbar-brand" @click="isOpen = false">
        <img 
          src="@/assets/bis-logo.png" 
          alt="BIS Logo" 
          class="brand-logo"
        >
      </router-link>
      <!-- Hamburger menu (for mobile) -->
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="isOpen = !isOpen"
        aria-label="Toggle navigation"
      >
        <div class="hamburger" :class="{ 'active': isOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <!-- Navigation Content -->
      <div class="navbar-content" :class="{ 'show': isOpen }">
        <ul class="nav-links">
          <li class="nav-item" v-for="link in mainLinks" :key="link.to">
            <router-link 
              :to="link.to" 
              class="nav-link" 
              :class="{ 'active': $route.path === link.to }"
              @click="isOpen = false"
            >
              {{ link.text }}
            </router-link>
          </li>
        </ul>

        <!-- Auth Section -->
        <div class="auth-section">
          <template v-if="isAuthenticated && user">
            <!-- User Dropdown -->
            <div class="user-dropdown" v-click-outside="() => showUserMenu = false">
              <button 
                class="user-btn"
                @click="toggleUserMenu"
                aria-label="User menu"
              >
                <div class="user-avatar">
                  {{ userInitials }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name || user.email }}</span>
                  <span class="user-role">{{ roleDisplayName }}</span>
                </div>
                <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              
              <div class="dropdown-menu" :class="{ 'show': showUserMenu }">
                <div class="dropdown-header">
                  <div class="user-avatar large">
                    {{ userInitials }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.name || user.email }}</div>
                    <div class="user-role">{{ roleDisplayName }}</div>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <router-link 
                  v-for="link in authLinks" 
                  :key="link.to"
                  :to="link.to" 
                  class="dropdown-item"
                  @click="closeMenus"
                >
                  <span>{{ link.text }}</span>
                </router-link>
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-item logout" @click="handleLogout">
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link 
              to="/login" 
              class="auth-link login"
              @click="isOpen = false"
            >
              <span>Login</span>
            </router-link>
            <router-link 
              to="/register" 
              class="auth-link register"
              @click="isOpen = false"
            >
              <span>Register</span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ModernNavbar',
  data() {
    return {
      isOpen: false,
      showUserMenu: false,
      mainLinks: [
        { to: '/', text: 'Home' },
        { to: '/about', text: 'About' },
        { to: '/services', text: 'Services' },
        { to: '/announcements', text: 'Announcements' },
        { to: '/contact', text: 'Contact' },
      ],
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated,
    }),
    authLinks() {
      if (!this.isAuthenticated || !this.user?.role) return [];
      
      const userRole = this.user.role;
      const baseLinks = [
        { to: `/${userRole}/dashboard`, text: 'Dashboard' },
      ];
      
      if (userRole === 'resident') {
        baseLinks.push(
          { to: '/resident/profile', text: 'My Profile' },
          { to: '/resident/request', text: 'My Requests' },
        );
      } else if (userRole === 'official') {
        baseLinks.push(
          { to: '/official/residents', text: 'Residents' },
          { to: '/official/requests', text: 'Requests' },
        );
      } else if (userRole === 'sk') {
        baseLinks.push(
          { to: '/sk/projects', text: 'Projects' },
          { to: '/sk/youth', text: 'Youth Programs' },
        );
      } else if (userRole === 'admin') {
        baseLinks.push(
          { to: '/admin/dashboard', text: 'Admin Dashboard' },
        );
      }
      
      return baseLinks;
    },
    userInitials() {
      if (!this.user) return 'U';
      const displayName = this.user.name || this.user.email || 'User';
      const names = displayName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    },
    roleDisplayName() {
      if (!this.user?.role) return 'User';
      const roles = {
        resident: 'Resident',
        official: 'Barangay Official',
        sk: 'SK Official',
        admin: 'Administrator',
      };
      return roles[this.user.role] || this.user.role;
    },
  },
  methods: {
    ...mapActions(['logout']),
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    closeMenus() {
      this.isOpen = false;
      this.showUserMenu = false;
    },
    async handleLogout() {
      try {
        await this.$store.dispatch('logout');
        this.closeMenus();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        this.$store.commit('setNotification', {
          message: 'Logout failed. Please try again.',
          type: 'error',
        });
      }
    },
  },
  directives: {
    'click-outside': {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped>
/* Modern Navbar Base */
.navbar-modern {
background: linear-gradient(135deg, #bcc4dd 0%, #0d6efd 100%);
  color: white;
  padding: 0.75rem 0;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
   height: 45px;
}

.navbar-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  height: 80px; /* Adjust based on your logo's aspect ratio */
  width: auto;
}

.brand-text {
  font-weight: 700;
  font-size: 1.4rem;
  color: white;
  letter-spacing: -0.5px;
}

/* Hamburger Menu (Mobile) */
.navbar-toggler {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: none;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: white;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Navigation Content */
.navbar-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  position: relative;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-link.active {
  color: white;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Auth Section */
.auth-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auth-link {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login {
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.register {
  background: white;
  color: #0d6efd;
}

.register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

/* User Dropdown */
.user-dropdown {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3a5ccc 0%, #1e3c8f 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1.1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: white;
}

.user-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 240px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details .user-name {
  color: #212529;
  font-weight: 600;
}

.user-details .user-role {
  color: #6c757d;
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0.5rem 0;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(58, 12, 163, 0.05);
  color: #3a0ca3;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background-color: rgba(220, 53, 69, 0.05);
}

/* Mobile Responsiveness */
@media (max-width: 992px) {
  .navbar-toggler {
    display: block;
  }
  
  .navbar-content {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-height: calc(100vh - 72px);
    overflow-y: auto;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    transform: translateY(-20px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .navbar-content.show {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .auth-section {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .user-dropdown {
    margin-top: 1rem;
  }
  
  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 0.5rem;
  }
}

</style>