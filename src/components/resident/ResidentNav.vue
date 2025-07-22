<template>
  <nav class="app-navbar">
    <div class="navbar-container">
      <router-link class="navbar-brand" to="/resident/dashboard">
        <div class="brand-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <span class="brand-text">Resident Portal</span>
      </router-link>
      
      <button class="navbar-toggler" @click="toggleMenu" :class="{ 'active': menuOpen }">
        <span class="toggler-icon"></span>
      </button>
      
      <div class="navbar-menu" :class="{ 'active': menuOpen }">
        <ul class="nav-links">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/resident/dashboard" @click="closeMenu">
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/resident/profile" @click="closeMenu">
              <span>Profile</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/resident/request" @click="closeMenu">
              <span>Requests</span>
            </router-link>
          </li>
          <li class="nav-item">
            <button class="nav-link logout-button" @click="logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from '@/firebase/config';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      menuOpen: false
    }
  },
  setup() {
    const router = useRouter();

    const logout = async () => {
      try {
        await auth.signOut();
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return { logout };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    }
  }
};
</script>

<style scoped>
.app-navbar {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.8rem 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  text-decoration: none;
  z-index: 1001;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo svg {
  width: 24px;
  height: 24px;
}

.navbar-toggler {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  z-index: 1001;
}

.toggler-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: white;
  position: relative;
  transition: all 0.3s ease;
}

.toggler-icon::before,
.toggler-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease;
}

.toggler-icon::before {
  transform: translateY(-6px);
}

.toggler-icon::after {
  transform: translateY(6px);
}

.navbar-toggler.active .toggler-icon {
  background-color: transparent;
}

.navbar-toggler.active .toggler-icon::before {
  transform: rotate(45deg);
}

.navbar-toggler.active .toggler-icon::after {
  transform: rotate(-45deg);
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link svg {
  width: 18px;
  height: 18px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-button svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .navbar-toggler {
    display: block;
  }
  
  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #4361ee;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-150%);
    opacity: 0;
    transition: all 0.3s ease;
    flex-direction: column;
    z-index: 1000;
  }
  
  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
  }
  
  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.25rem;
  }
  
  .nav-item {
    width: 100%;
  }
  
  .nav-link, .logout-button {
    padding: 1rem;
    border-radius: 0.5rem;
    justify-content: flex-start;
  }
}
</style>