<template>

  <div class="pending-approval-page">
    <br>
    <br>
    <br>
    <!-- Hero Section -->
    <section class="hero-section bg-primary-gradient py-3">
      <div class="container py-3">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2 text-lg-start text-center">
            <div class="official-badge mb-2">
              <span class="badge bg-white text-primary py-1 px-2 fw-medium rounded-pill">
                <i class="bi" :class="statusIcon"></i> Account Status
              </span>
            </div>
            <h1 class="display-5 fw-bold text-white mb-2">
              <span class="text-warning">{{ statusTitle }}</span>
            </h1>
            <p class="text-white mb-3 opacity-75">
              Your <strong>{{ formattedRole }}</strong> account is {{ statusDescription }}
            </p>
          </div>

        </div>
      </div>
    </section>


    <!-- Content Section -->
    <section class="content-section py-5 bg-light">
            <br>
  <br>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 p-lg-5 text-center">
                <p class="text-muted mb-4">
                  <template v-if="isPending">
                    Your <strong class="text-primary">{{ formattedRole }}</strong> account registration is currently being processed. 
                    You'll receive an email notification once your account has been approved by our administrators.
                  </template>
                  <template v-else-if="isApproved">
                    Congratulations! Your <strong class="text-success">{{ formattedRole }}</strong> account has been approved.
                    You can now access all features available for your role.
                  </template>
                  <template v-else>
                    Your account review is still in progress. Please check back later or contact support for more information.
                  </template>
                </p>
                
                <!-- Process Steps -->
                <div class="process-steps mb-5">
                  <div class="d-flex justify-content-between position-relative">
                    <!-- Step 1: Registration -->
                    <div class="step completed">
                      <div class="step-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                        <i class="bi bi-check-lg"></i>
                      </div>
                      <div class="step-content mt-3">
                        <div class="step-badge bg-primary text-white px-2 py-1 rounded-pill small mb-1">Step 1</div>
                        <div class="step-label fw-medium">Registration</div>
                        <div class="step-time small text-muted">Completed</div>
                      </div>
                    </div>
                    
                    <!-- Step 2: Review -->
                    <div class="step" :class="{ 'active': isPending, 'completed': isApproved }">
                      <div class="step-icon rounded-circle d-flex align-items-center justify-content-center" 
                           :class="isApproved ? 'bg-success text-white' : 'bg-primary text-white'">
                        <i class="bi" :class="isApproved ? 'bi-check-lg' : 'bi-hourglass-split'"></i>
                      </div>
                      <div class="step-content mt-3">
                        <div class="step-badge px-2 py-1 rounded-pill small mb-1" 
                             :class="isApproved ? 'bg-success text-white' : 'bg-primary text-white'">Step 2</div>
                        <div class="step-label fw-medium">Review</div>
                        <div class="step-time small" :class="isApproved ? 'text-success' : 'text-primary'">
                          {{ isApproved ? 'Completed' : 'In Progress' }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Step 3: Approval -->
                    <div class="step" :class="{ 'active': isApproved }">
                      <div class="step-icon rounded-circle d-flex align-items-center justify-content-center" 
                           :class="isApproved ? 'bg-success text-white' : 'bg-light border border-secondary text-secondary'">
                        <i class="bi" :class="isApproved ? 'bi-check-lg' : 'bi-person-check'"></i>
                      </div>
                      <div class="step-content mt-3">
                        <div class="step-badge px-2 py-1 rounded-pill small mb-1" 
                             :class="isApproved ? 'bg-success text-white' : 'bg-light text-secondary'">Step 3</div>
                        <div class="step-label fw-medium">Approval</div>
                        <div class="step-time small" :class="isApproved ? 'text-success' : 'text-muted'">
                          {{ isApproved ? 'Completed' : 'Pending' }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="progress position-absolute w-100" style="height: 6px; top: 20px; z-index: 0;">
                      <div class="progress-bar" 
                           :class="isApproved ? 'bg-success' : 'bg-primary'" 
                           role="progressbar" 
                           :style="`width: ${isApproved ? '100%' : '50%'}`"
                           style="transition: width 0.6s ease">
                      </div>
                    </div>
                  </div>
                </div>

                <button v-if="isPending" @click="logout" class="btn btn-primary rounded-pill px-4">
                  <i class=" me-2"></i>Sign Out
                </button>
                <button v-else @click="proceedToDashboard" class="btn btn-success rounded-pill px-4">
                  <i class="t me-2"></i>Continue to Dashboard
                </button>
                
                <p class="small text-muted mt-3 mb-0">
                  Need help? <a href="#" class="text-primary">Contact support</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { auth } from '@/firebase/config'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export default {
  data() {
    return {
      userRole: '',
      approvalStatus: 'pending', // 'pending', 'approved', or 'rejected'
      checkInterval: null
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    formattedRole() {
      if (this.user?.role) {
        return this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1)
      }
      return this.$route.params.role || 'Account'
    },
    isPending() {
      return this.approvalStatus === 'pending'
    },
    isApproved() {
      return this.approvalStatus === 'approved'
    },
    statusTitle() {
      return this.isApproved ? 'Account Approved!' : 'Account Under Review'
    },
    statusDescription() {
      return this.isApproved ? 'has been approved' : 'under review'
    },
    statusIcon() {
      return this.isApproved ? 'bi-check-circle-fill' : 'bi-hourglass-split'
    },
    statusColor() {
      return this.isApproved ? 'text-success' : 'text-primary'
    },
    statusAnimation() {
      return this.isApproved ? 'approved-animation' : 'pending-animation'
    }
  },
  created() {
    this.checkApprovalStatus()
    this.checkInterval = setInterval(this.checkApprovalStatus, 30000)
  },
  beforeUnmount() {
    clearInterval(this.checkInterval)
  },
  methods: {
    async checkApprovalStatus() {
      try {
        if (!auth.currentUser) return

        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()

          if (userData.isApproved === true) {
            this.approvalStatus = 'approved'
            this.$store.commit('auth/SET_USER', {
              ...this.user,
              isApproved: true
            })
            clearInterval(this.checkInterval)
          } else {
            this.approvalStatus = 'pending'
          }
        }
      } catch (error) {
        console.error('Error checking approval status:', error)
      }
    },
    async logout() {
      try {
        await signOut(auth)
        this.$store.commit('auth/CLEAR_USER')
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    proceedToDashboard() {
      if (this.user?.role) {
        const dashboardRoutes = {
          resident: 'resident-dashboard',
          official: 'official-dashboard',
          sk: 'sk-dashboard',
          admin: 'admin-dashboard'
        }
        this.$router.push({ name: dashboardRoutes[this.user.role] || 'home' })
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  position: relative;
  overflow: hidden;
}

.official-badge .badge {
  font-size: 0.85rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Status Icon Animations */
.status-icon-container {
  display: inline-block;
  border-radius: 50%;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.status-icon-container:hover {
  transform: scale(1.05);
}

.pending-animation {
  background-color: rgba(255, 255, 255, 0.15);
  animation: pulse 2s infinite;
}

.approved-animation {
  background-color: rgba(34, 197, 94, 0.2);
  animation: bounce 1s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
}

/* Content Section */
.content-section {
  min-height: calc(100vh - 300px);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Process Steps */
.process-steps {
  max-width: 500px;
  margin: 0 auto;
}

.step {
  position: relative;
  z-index: 2;
  text-align: center;
  flex: 1;
}

.step-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.step.active .step-icon {
  animation: bounce 1s infinite alternate;
}

.step.completed .step-icon {
  background-color: var(--bs-success) !important;
}

.step-label {
  font-weight: 500;
  transition: all 0.3s ease;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .hero-section {
    text-align: center;
    padding-bottom: 2rem;
  }
  
  .card {
    margin-top: -30px;
  }
  
  .status-icon-container {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .process-steps {
    max-width: 100%;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-section p {
    font-size: 0.9rem;
  }
}

@media (max-width: 575.98px) {
  .hero-section h1 {
    font-size: 1.8rem;
  }
  
  .hero-section p {
    font-size: 0.85rem;
  }
  
  .status-icon-container {
    padding: 0.8rem;
  }
  
  .step-icon {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
  
  .step-label {
    font-size: 0.7rem;
  }
}

/* Modern Process Steps Styling */
.process-steps {
  max-width: 600px;
  margin: 2rem auto;
}

.step {
  position: relative;
  z-index: 2;
  text-align: center;
  flex: 1;
  padding: 0 10px;
}

.step-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step.active .step-icon {
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 0 8px rgba(13, 110, 253, 0.2);
}

.step.completed .step-icon {
  box-shadow: 0 4px 10px rgba(25, 135, 84, 0.3);
}

.step-content {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.step.active .step-content {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(13, 110, 253, 0.1);
}

.step-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
}

.step-label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.step-time {
  font-size: 0.75rem;
}

.progress {
  background-color: #f0f0f0;
  border-radius: 3px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .step {
    padding: 0 5px;
  }
  
  .step-icon {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
  
  .step-content {
    padding: 8px;
  }
  
  .step-label {
    font-size: 0.8rem;
  }
  
  .step-time {
    font-size: 0.7rem;
  }
}
</style>