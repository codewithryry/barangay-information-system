<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/official/dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-building me-2" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"/>
          <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z"/>
        </svg>
        <span>SB Portal</span>
      </router-link>
      
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/official/dashboard">
              Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/official/residents">
              Residents
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/official/requests">
              Requests
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center logout-link" @click="logout">
              Logout
            </a>
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
};
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
}

.navbar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.nav-link, .dropdown-item {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.nav-link:hover, .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.logout-link {
  cursor: pointer;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
  }
  
  .nav-item {
    margin: 0.25rem 0;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
  }
}
</style>