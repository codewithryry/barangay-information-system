<template>
  <div class="register-page">
    <!-- Error Modal -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-octagon-fill me-2"></i> Registration Error
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
              <i class="bi bi-check-circle-fill me-2"></i> Registration Successful
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ success }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Continue</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Code Modal -->
    <div class="modal fade" id="adminCodeModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-shield-lock me-2"></i> Admin Verification
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="adminCode" class="form-label">Enter Admin Registration Code</label>
              <input v-model="adminCode" type="password" class="form-control" id="adminCode" placeholder="Secret code">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="verifyAdminCode">Verify</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section bg-primary-gradient">
      <div class="container h-100">
        <div class="row align-items-center h-100">
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-body p-4 p-lg-5">
                <form @submit.prevent="register" class="needs-validation" novalidate>
                  <!-- Role Selection -->
                  <div class="mb-3">
                    <label class="form-label small fw-medium text-muted">REGISTER AS</label>
                    <div class="btn-group w-100" role="group">
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        :class="{ 'active': selectedRole === 'resident' }"
                        @click="selectedRole = 'resident'"
                      >
                        <i class="bi bi-house-door me-1"></i> Resident
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        :class="{ 'active': selectedRole === 'official' }"
                        @click="selectedRole = 'official'"
                      >
                        <i class="bi bi-person-badge me-1"></i> Official
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        :class="{ 'active': selectedRole === 'sk' }"
                        @click="selectedRole = 'sk'"
                      >
                        <i class="bi bi-people me-1"></i> SK
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        :class="{ 'active': selectedRole === 'admin' }"
                        @click="selectAdminRole"
                      >
                        <i class="bi bi-shield-lock me-1"></i> Admin
                      </button>
                    </div>
                  </div>

                  <!-- Personal Information -->
                  <div class="row g-2 mb-2">
                    <div class="col-12">
                      <label for="name" class="form-label small">Full Name <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light">
                          <i class="bi bi-person text-muted"></i>
                        </span>
                        <input
                          v-model="name"
                          type="text"
                          class="form-control form-control-sm"
                          id="name"
                          placeholder="Juan Dela Cruz"
                          required
                        >
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label for="email" class="form-label small">Email <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
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

                    <div class="col-md-6">
                      <label for="birthdate" class="form-label small">Birthdate <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light">
                          <i class="bi bi-calendar text-muted"></i>
                        </span>
                        <input
                          v-model="birthdate"
                          type="date"
                          class="form-control form-control-sm"
                          id="birthdate"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Contact and Address -->
                  <div class="row g-2 mb-2">
                    <div class="col-md-6">
                      <label for="contact" class="form-label small">Contact <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light">
                          <i class="bi bi-telephone text-muted"></i>
                        </span>
                        <input
                          v-model="contact"
                          type="tel"
                          class="form-control form-control-sm"
                          id="contact"
                          placeholder="09123456789"
                          required
                        >
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label for="address" class="form-label small">Address <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light">
                          <i class="bi bi-geo-alt text-muted"></i>
                        </span>
                        <input
                          v-model="address"
                          type="text"
                          class="form-control form-control-sm"
                          id="address"
                          placeholder="House #, Street"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Password Fields -->
                  <div class="row g-2 mb-2">
                    <div class="col-md-6">
                      <label for="password" class="form-label small">Password <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
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
                      <div class="form-text small">Min. 8 characters</div>
                    </div>

                    <div class="col-md-6">
                      <label for="confirmPassword" class="form-label small">Confirm <span class="text-danger">*</span></label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light">
                          <i class="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input
                          v-model="confirmPassword"
                          type="password"
                          class="form-control form-control-sm"
                          id="confirmPassword"
                          placeholder="••••••••"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Role-Specific Fields -->
                  <transition name="slide-fade">
                    <div class="mb-2" v-if="selectedRole !== 'resident'">
                      <label for="position" class="form-label small">
                        {{ 
                          selectedRole === 'official' ? 'Position' : 
                          selectedRole === 'sk' ? 'SK Position' :
                          'Admin Role'
                        }} 
                        <span class="text-danger">*</span>
                      </label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light">
                          <i class="bi bi-person-rolodex text-muted"></i>
                        </span>
                        <input
                          v-model="positionData"
                          type="text"
                          class="form-control form-control-sm"
                          :placeholder="
                            selectedRole === 'official' ? 'Barangay Captain' : 
                            selectedRole === 'sk' ? 'SK Chairman' :
                            'Administrator'
                          "
                          required
                        >
                      </div>
                    </div>
                  </transition>

                  <!-- Terms Agreement -->
                  <div class="form-check mt-3 mb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="terms"
                      v-model="terms"
                      required
                    >
                    <label class="form-check-label small" for="terms">
                      I agree to the <a href="#" class="text-primary">Terms</a> and <a href="#" class="text-primary">Privacy Policy</a>
                    </label>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    class="btn btn-primary w-100 py-2"
                    :disabled="loading"
                  >
                    <span v-if="!loading">
                      <i class=" me-2"></i> Register as {{ selectedRoleDisplayName }}
                    </span>
                    <span v-else>
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </span>
                  </button>
                </form>

                <!-- Login Link -->
                <div class="text-center mt-3 pt-3 border-top">
                  <p class="small text-muted mb-0">Already have an account?
                    <router-link to="/login" class="text-primary fw-semibold text-decoration-none">
                      Login
                    </router-link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Side - Welcome Content -->
          <div class="col-lg-6 text-lg-start text-center ps-lg-5">
            <div class="official-badge mb-3">
              <span class="badge bg-white text-primary py-2 px-3 fw-normal">
                <i class="bi bi-person-plus me-2"></i> New Account
              </span>
            </div>
            <h1 class="display-5 fw-bold text-white mb-3">
              Join <span class="text-warning">Barangay Portal</span>
            </h1>
            <p class="text-white mb-4">
              Register to access all community services and features
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { auth, db } from '@/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Modal } from 'bootstrap'

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      birthdate: '',
      contact: '',
      positionData: '',
      terms: false,
      error: '',
      success: '',
      loading: false,
      selectedRole: 'resident',
      errorModal: null,
      successModal: null,
      adminCodeModal: null,
      adminCode: '',
      adminRegistrationCode: 'ADMIN123', // Regular admin code
      superAdminRegistrationCode: 'SUPERADMIN123' // Super admin code
    }
  },
  computed: {
    selectedRoleDisplayName() {
      const roleNames = {
        resident: 'Resident',
        official: 'Official',
        sk: 'SK Member',
        admin: 'Administrator'
      }
      return roleNames[this.selectedRole]
    }
  },
  mounted() {
    this.errorModal = new Modal(document.getElementById('errorModal'))
    this.successModal = new Modal(document.getElementById('successModal'))
    this.adminCodeModal = new Modal(document.getElementById('adminCodeModal'))
  },
  methods: {
    selectAdminRole() {
      this.adminCodeModal.show()
    },
    verifyAdminCode() {
      if ([this.adminRegistrationCode, this.superAdminRegistrationCode].includes(this.adminCode)) {
        this.selectedRole = 'admin'
        this.adminCodeModal.hide()
      } else {
        this.error = 'Invalid admin registration code'
        this.errorModal.show()
        this.adminCodeModal.hide()
      }
      this.adminCode = ''
    },
    async register() {
      this.error = ''
      this.success = ''
      
      // Validation
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match'
        this.errorModal.show()
        return
      }
      
      if (this.password.length < 8) {
        this.error = 'Password must be at least 8 characters'
        this.errorModal.show()
        return
      }
      
      if (this.selectedRole !== 'resident' && !this.positionData) {
        this.error = `Please specify your ${
          this.selectedRole === 'official' ? 'position' : 
          this.selectedRole === 'sk' ? 'SK position' :
          'admin role'
        }`
        this.errorModal.show()
        return
      }
      
      if (!this.terms) {
        this.error = 'You must agree to the terms and conditions'
        this.errorModal.show()
        return
      }
      
      this.loading = true
      
      try {
        // Create Firebase auth user
        const res = await createUserWithEmailAndPassword(auth, this.email, this.password)
        
        // Prepare base user data
        const userData = {
          name: this.name,
          email: this.email,
          address: this.address,
          birthdate: this.birthdate,
          contact: this.contact,
          role: this.selectedRole,
          createdAt: new Date(),
          lastUpdated: new Date(),
          isApproved: this.selectedRole === 'admin', // Only admins are auto-approved
          status: this.selectedRole === 'admin' ? 'approved' : 'pending'
        }
        
        // Add role-specific data to user document
        if (this.selectedRole === 'official') {
          userData.position = this.positionData
          userData.roleType = 'barangay_official'
        } else if (this.selectedRole === 'sk') {
          userData.skPosition = this.positionData
          userData.roleType = 'sk_official'
        } else if (this.selectedRole === 'admin') {
          userData.adminRole = this.positionData
          userData.roleType = 'administrator'
          userData.isSuperAdmin = this.adminCode === this.superAdminRegistrationCode
        } else {
          userData.roleType = 'resident'
        }
        
        // Save to main users collection
        await setDoc(doc(db, 'users', res.user.uid), userData)
        
        // Save to role-specific collections
        if (this.selectedRole !== 'resident') {
          const roleData = {
            userId: res.user.uid,
            name: this.name,
            email: this.email,
            ...(this.selectedRole === 'official' 
              ? { position: this.positionData }
              : this.selectedRole === 'sk'
              ? { skPosition: this.positionData }
              : { adminRole: this.positionData }),
            registeredAt: new Date(),
            lastUpdated: new Date(),
            status: this.selectedRole === 'admin' ? 'approved' : 'pending'
          }
          
          const collectionName = 
            this.selectedRole === 'official' ? 'officials' : 
            this.selectedRole === 'sk' ? 'sk_members' : 
            'administrators'
          await setDoc(doc(db, collectionName, res.user.uid), roleData)
          
          // Create additional admin profile if user is admin
          if (this.selectedRole === 'admin') {
            const adminProfile = {
              userId: res.user.uid,
              email: this.email,
              name: this.name,
              adminRole: this.positionData,
              isSuperAdmin: this.adminCode === this.superAdminRegistrationCode,
              permissions: this.adminCode === this.superAdminRegistrationCode 
                ? ['full_access', 'user_management', 'content_management', 'settings']
                : ['user_management', 'content_management'],
              createdAt: new Date(),
              lastActive: null,
              lastUpdated: new Date()
            }
            await setDoc(doc(db, 'admin_profiles', res.user.uid), adminProfile)
          }
        }
        
        // Set success message based on role
        this.success = this.selectedRole === 'admin'
          ? 'Admin registration successful! You can now login with your credentials.'
          : 'Registration successful! Your account is pending approval. You will receive an email notification once approved.'
        
        this.successModal.show()
        
        // Redirect to login after modal closes
        const successModalEl = document.getElementById('successModal')
        const handler = () => {
          this.$router.push('/login')
          successModalEl.removeEventListener('hidden.bs.modal', handler)
        }
        successModalEl.addEventListener('hidden.bs.modal', handler)
        
      } catch (err) {
        console.error('Registration error:', err)
        this.error = this.getFriendlyError(err.message)
        this.errorModal.show()
        
        // Clean up if user was created but Firestore failed
        if (auth.currentUser) {
          try {
            await auth.currentUser.delete()
          } catch (deleteErr) {
            console.error('Error cleaning up failed registration:', deleteErr)
          }
        }
      } finally {
        this.loading = false
      }
    },
    getFriendlyError(error) {
      const errorMap = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password should be at least 8 characters',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/operation-not-allowed': 'Account creation is currently disabled',
        'auth/network-request-failed': 'Network error. Please check your internet connection'
      }
      
      for (const [code, message] of Object.entries(errorMap)) {
        if (error.includes(code)) return message
      }
      
      return 'Registration failed. Please try again later.'
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  flex: 1;
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  padding: 2rem 0;
}

.container.h-100 {
  height: 100%;
  display: flex;
  align-items: center;
}

.card {
  border-radius: 0.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 4rem);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-group-sm .input-group-text,
.input-group-sm .form-control {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.form-label.small {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.form-text.small {
  font-size: 0.75rem;
}

/* Transition effects */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .hero-section {
    padding: 1.5rem 0;
  }
  
  .container.h-100 {
    height: auto;
    padding: 1.5rem 0;
  }
  
  .ps-lg-5 {
    padding-left: 0 !important;
    margin-top: 1.5rem;
  }
  
  .display-5 {
    font-size: 2.2rem;
  }
}

@media (max-width: 767.98px) {
  .card {
    max-height: calc(100vh - 2rem);
  }
  
  .btn-group .btn {
    padding: 0.25rem;
    font-size: 0.75rem;
  }
  
  .hero-section {
    padding: 1rem 0;
  }
  
  .display-5 {
    font-size: 1.8rem;
  }
}
</style>