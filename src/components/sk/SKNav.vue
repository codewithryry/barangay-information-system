<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/sk/dashboard">
        <div class="sk-logo me-2">
          <i class="fas fa-users"></i>
        </div>
        <span class="brand-text">SK Portal</span>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <!-- <li class="nav-item mx-lg-1">
            <router-link class="nav-link position-relative" active-class="active" to="/sk/dashboard">
              <i class="me-1"></i> Dashboard
            </router-link>
          </li> -->
            <li class="nav-item mx-lg-1">
            <router-link class="nav-link" active-class="active" to="/sk/members">
              <i class=" me-1"></i> Members
            </router-link>
          </li>
          <li class="nav-item mx-lg-1">
            <router-link class="nav-link" active-class="active" to="/sk/forum">
              <i class=" me-1"></i> Forum
            </router-link>
          </li>
          <li class="nav-item ms-lg-2">
            <button class="nav-link" @click="logout">
              <i class=" me-1"></i> Logout
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
import { ref } from 'vue';

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
.navbar {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #28a745, #218838);
}

.sk-logo {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.sk-logo i {
  font-size: 1.1rem;
}

.brand-text {
  font-weight: 700;
  letter-spacing: 0.5px;
}

.nav-link {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active {
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.15);
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #28a745;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
  }
  
  .nav-item {
    margin: 0.25rem 0;
  }
  
  .dropdown-menu {
    border: none;
    box-shadow: none;
  }
}
</style>