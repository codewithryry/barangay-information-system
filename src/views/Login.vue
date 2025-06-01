<template>
  <div class="login-page">
    <!-- Error Modal -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-octagon-fill me-2"></i> Login Error
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ error }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle-fill me-2"></i> Login Successful
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ success }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="redirectBasedOnRole">Continue</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section bg-primary-gradient">
      <div class="container h-100">
        <div class="row align-items-center h-100">
          <div class="col-lg-6 text-lg-start text-center">
            <div class="official-badge mb-3">
              <span class="badge bg-white text-primary py-2 px-3 fw-normal">
                <i class="bi bi-shield-lock me-2"></i> Secure Portal
              </span>
            </div>
            <h1 class="display-4 fw-bold text-white mb-3">
              Welcome to <span class="text-warning">Barangay Portal</span>
            </h1>
            <p class="lead text-white mb-4">
              Sign in to access personalized services and community updates
            </p>
          </div>
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-body p-4 p-lg-5">
                <div class="text-start mb-4">
                  <h2 class="h3 fw-bold text-dark mb-1">
                    <i class="bi bi-person-circle text-primary me-2"></i> Log In
                  </h2>
                  <p class="text-muted small">Enter your credentials to continue</p>
                </div>

                <!-- Role Selection -->
                <div class="mb-4">
                  <label class="form-label small fw-medium text-muted">LOGIN AS</label>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm flex-grow-1"
                      :class="{ 'active': selectedRole === 'resident' }"
                      @click="selectedRole = 'resident'"
                    >
                      <i class="bi bi-house-door me-1"></i> Resident
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm flex-grow-1"
                      :class="{ 'active': selectedRole === 'official' }"
                      @click="selectedRole = 'official'"
                    >
                      <i class="bi bi-person-badge me-1"></i> Official
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm flex-grow-1"
                      :class="{ 'active': selectedRole === 'sk' }"
                      @click="selectedRole = 'sk'"
                    >
                      <i class="bi bi-people me-1"></i> SK Member
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm flex-grow-1"
                      :class="{ 'active': selectedRole === 'admin' }"
                      @click="selectedRole = 'admin'"
                    >
                      <i class="bi bi-shield-lock me-1"></i> Admin
                    </button>
                  </div>
                </div>

                <form @submit.prevent="login" class="needs-validation" novalidate>
                  <div class="mb-3">
                    <label for="email" class="form-label small fw-medium text-muted">EMAIL ADDRESS</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        v-model="email"
                        type="email"
                        class="form-control form-control-sm"
                        id="email"
                        placeholder="your@email.com"
                        required
                      >
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label small fw-medium text-muted">PASSWORD</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        v-model="password"
                        type="password"
                        class="form-control form-control-sm"
                        id="password"
                        placeholder="••••••••"
                        required
                      >
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="remember"
                      >
                      <label class="form-check-label small text-muted" for="remember">
                        Remember me
                      </label>
                    </div>
                    <router-link to="/forgot-password" class="small text-primary text-decoration-none">
                      Forgot password?
                    </router-link>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100 py-2 mb-3 fw-bold"
                    :disabled="loading"
                  >
                    <span v-if="!loading">
                      <i class=" me-2"></i> Log In as {{ roleDisplayName }}
                    </span>
                    <span v-else>
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Authenticating...
                    </span>
                  </button>

                  <div class="text-center mt-4 pt-2 border-top">
                    <p class="small text-muted mb-0">Don't have an account?
                      <router-link to="/register" class="text-primary fw-semibold text-decoration-none">
                        Register here
                      </router-link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Modal } from 'bootstrap';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      success: '',
      loading: false,
      selectedRole: 'resident',
      errorModal: null,
      successModal: null,
    };
  },
  computed: {
    roleDisplayName() {
      const roleNames = {
        resident: 'Resident',
        official: 'Official',
        sk: 'SK Member',
        admin: 'Admin',
      };
      return roleNames[this.selectedRole] || 'Resident';
    },
  },
  mounted() {
    this.errorModal = new Modal(document.getElementById('errorModal'));
    this.successModal = new Modal(document.getElementById('successModal'));
    this.checkAuthState();
  },
  methods: {
    async checkAuthState() {
      try {
        await auth.authStateReady();
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (!userDoc.exists()) {
            await auth.signOut();
            return;
          }

          const userData = userDoc.data();
          if (userData.isApproved === false) {
            this.$router.push({ name: 'pending-approval' });
            return;
          }

          this.$store.commit('setAuth', {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            name: userData.name,
            approved: userData.isApproved,
            role: userData.role,
          });
          this.redirectBasedOnRole();
        }
      } catch (error) {
        await auth.signOut();
      }
    },
    async login() {
      this.error = '';
      this.success = '';
      this.loading = true;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User data not found in database');
        }

        const userData = userDoc.data();

        if (userData.role !== this.selectedRole) {
          throw new Error(`Please login using the ${userData.role} portal`);
        }

        if (userData.isApproved === false) {
          this.$router.push('/pending-approval');
          return;
        }

        this.$store.commit('setAuth', {
          uid: user.uid,
          email: user.email,
          name: userData.name,
          approved: userData.isApproved,
          role: userData.role,
        });

        this.success = 'Login successful! Click continue to proceed to your dashboard.';
        this.successModal.show();

      } catch (err) {
        this.error = this.getFriendlyError(err.message);
        this.errorModal.show();
      } finally {
        this.loading = false;
      }
    },
    getDashboardRoute(role) {
      const routes = {
        resident: { name: 'resident-dashboard' },
        official: { name: 'official-dashboard' },
        sk: { name: 'sk-dashboard' },
        admin: { name: 'admin-dashboard' },
      };
      return routes[role] || { name: 'home' };
    },
    redirectBasedOnRole() {
      const user = this.$store.state.auth.user;
      if (!user || !user.role) {
        this.$router.push({ name: 'home' });
        return;
      }

      const route = this.getDashboardRoute(user.role);
      this.$router.push(route);
    },
    getFriendlyError(error) {
      const errorMap = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Account temporarily locked due to too many failed attempts. Please try again later or reset your password.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
      };

      for (const [code, message] of Object.entries(errorMap)) {
        if (error.includes(code)) return message;
      }

      if (error.includes('permission-denied')) {
        return 'You don\'t have permission to access this resource.';
      }

      return error || 'An unknown error occurred. Please try again.';
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  overflow: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  height: 100%;
  padding: 0;
}

.container.h-100 {
  height: 100%;
  display: flex;
  align-items: center;
}

.official-badge .badge {
  font-size: 0.9rem;
}

.card {
  border-radius: 0.5rem;
}

.btn-outline-primary.active {
  background-color: rgba(13, 110, 253, 0.1);
  border-color: #0d6efd;
  color: #0d6efd;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  border: none;
}

.input-group-text {
  transition: all 0.3s ease;
}

.form-control:focus ~ .input-group-text {
  color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.05);
}

.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}

@media (max-width: 767.98px) {
  .hero-section {
    text-align: center;
    padding: 2rem 0;
  }
  
  .container.h-100 {
    height: auto;
    padding: 2rem 0;
  }
  
  .row.align-items-center.h-100 {
    height: auto;
  }
}
</style>