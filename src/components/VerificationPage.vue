<template>

  <br>
  <br>
  <div class="verification-page bg-gradient">
    <div class="container py-4 py-lg-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <div class="card glass-card border-0 overflow-hidden">
            <div
              class="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom"
            >
              <div class="d-flex align-items-center">
                <div class="icon-wrapper bg-primary-soft">
                  <i class="bi bi-shield-check text-primary"></i>
                </div>
                <h5 class="mb-0 ms-3 fw-bold text-dark">ID Verification</h5>
              </div>
              <button
                class="btn btn-icon"
                @click="toggleScanner"
                :aria-pressed="scannerActive"
                :title="scannerActive ? 'Turn off scanner' : 'Turn on scanner'"
              >
                <i
                  :class="scannerActive
                    ? 'bi bi-camera-video-off text-danger'
                    : 'bi bi-camera-video text-primary'"
                ></i>
              </button>
            </div>

            <div class="card-body p-4">
              <transition name="fade">
                <qrcode-stream
                  v-if="scannerActive"
                  @decode="onDecode"
                  @init="onInit"
                  class="mb-4 rounded-3 overflow-hidden"
                  style="height: 300px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
                />
              </transition>

              <form @submit.prevent="verifyID" autocomplete="off">
                <div class="mb-4">
                  <label for="idNumber" class="form-label fw-semibold small text-uppercase text-muted"
                    >Barangay ID Number</label
                  >
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-person-badge text-muted"></i>
                    </span>
                    <input
                      v-model.trim="idNumber"
                      type="text"
                      class="form-control border-start-0"
                      id="idNumber"
                      placeholder="BRGY-12345678"
                      pattern="BRGY-\d{8}"
                      title="Format: BRGY- followed by 8 digits"
                      required
                    />
                  </div>
                  <div
                    v-if="verificationResult && !verificationResult.valid && !loading"
                    class="text-danger small mt-2 animate-fade-in"
                  >
                    <i class="bi bi-exclamation-circle me-1"></i>
                    {{ verificationResult.message }}
                  </div>
                </div>

                <div class="d-flex gap-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg flex-grow-1 shadow-sm"
                    :disabled="loading || !isIdNumberValid"
                  >
                    <span v-if="!loading" class="d-flex align-items-center justify-content-center">
                      <i class="bi bi-search me-2"></i> Verify ID
                    </span>
                    <span v-else class="d-flex align-items-center justify-content-center">
                      <span
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verifying...
                    </span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-lg"
                    @click="clearForm"
                    :disabled="loading"
                  >
                    Clear
                  </button>
                </div>
              </form>

              <transition name="slide-fade">
                <div v-if="verificationResult" class="mt-4">
                  <div
                    v-if="verificationResult.valid"
                    class="alert alert-success border-0 rounded-4 shadow-sm"
                  >
                    <div class="d-flex align-items-center mb-3">
                      <div class="icon-wrapper bg-success-soft me-3">
                        <i class="bi bi-check-circle-fill text-success"></i>
                      </div>
                      <h5 class="mb-0 fw-bold">VALID ID</h5>
                    </div>
                    
                    <div class="row mt-3 align-items-center">
                      <div class="col-md-4 text-center mb-3 mb-md-0">
                        <div class="qr-container p-3 bg-white rounded-3 shadow-sm">
                          <qr-code :text="qrCodeText" :size="140" />
                        </div>
                        <button class="btn btn-sm btn-outline-primary mt-3" @click="downloadQR">
                          <i class="bi bi-download me-1"></i> Download
                        </button>
                      </div>
                      <div class="col-md-8">
                        <div class="resident-info">
                          <h5 class="fw-bold mb-2 text-truncate">
                            {{
                              verificationResult.resident.name ||
                                (verificationResult.resident.lastName +
                                  ', ' +
                                  verificationResult.resident.firstName)
                            }}
                          </h5>
                          <div class="info-item">
                            <span class="label">ID Number:</span>
                            <span class="value">{{ verificationResult.resident.residentId }}</span>
                          </div>
                          <div class="info-item">
                            <span class="label">Status:</span>
                            <span class="badge bg-success rounded-pill text-uppercase">
                              {{ verificationResult.status }}
                            </span>
                          </div>
                          <div class="info-item">
                            <span class="label">Valid until:</span>
                            <span class="value">{{ formatDate(verificationResult.resident.idExpiresAt) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else
                    class="alert alert-danger border-0 rounded-4 shadow-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <div class="d-flex align-items-center">
                      <div class="icon-wrapper bg-danger-soft me-3">
                        <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                      </div>
                      <h5 class="mb-0 fw-bold">INVALID ID</h5>
                    </div>
                    <p class="mt-2 mb-0">
                      {{ verificationResult.message || 'This ID number is not valid or not found.' }}
                    </p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import QRCodeVue from 'qrcode.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import html2canvas from 'html2canvas'

export default {
  name: 'VerificationPage',
  components: {
    'qr-code': QRCodeVue,
    QrcodeStream
  },
  data() {
    return {
      idNumber: '',
      verificationResult: null,
      loading: false,
      qrCodeText: '',
      scannerActive: false
    }
  },
  computed: {
    isIdNumberValid() {
      return /^BRGY-\d{8}$/.test(this.idNumber.trim())
    }
  },
  watch: {
    idNumber() {
      this.verificationResult = null
    }
  },
  mounted() {
    const idParam = this.$route.params.idNumber
    if (idParam) {
      this.idNumber = idParam
      if (this.isIdNumberValid) {
        this.verifyID()
      }
    }
  },
  methods: {
    toggleScanner() {
      this.scannerActive = !this.scannerActive
      if (!this.scannerActive) {
        this.verificationResult = null
      }
    },
    onDecode(result) {
      if (result.includes('BRGYID:')) {
        const match = result.match(/BRGYID:(BRGY-\d{8})/)
        if (match) {
          this.idNumber = match[1]
          this.scannerActive = false
          this.verifyID()
        } else {
          this.showToast('Invalid QR code format', 'error')
        }
      } else {
        this.showToast('Invalid QR code format', 'error')
      }
    },
    onInit(promise) {
      promise.catch(err => {
        console.error('Camera error:', err)
        this.showToast('Cannot access camera. Please check permissions.', 'error')
        this.scannerActive = false
      })
    },
    async verifyID() {
      if (!this.isIdNumberValid) {
        this.verificationResult = {
          valid: false,
          message: 'ID number format is invalid.'
        };
        return;
      }

      this.loading = true;
      this.verificationResult = null;

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('residentId', '==', this.idNumber.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          this.verificationResult = { 
            valid: false, 
            message: 'ID number not found.' 
          };
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (!userData) {
          this.verificationResult = { 
            valid: false, 
            message: 'User data not found.' 
          };
          return;
        }

        if (userData.isApproved === false) {
          this.verificationResult = { 
            valid: false, 
            message: 'ID is not approved.' 
          };
          return;
        }

        let expiryDate;
        try {
          expiryDate = userData.idExpiresAt?.toDate 
            ? userData.idExpiresAt.toDate() 
            : new Date(userData.idExpiresAt);
        } catch (e) {
          console.error('Error parsing expiry date:', e);
          this.verificationResult = {
            valid: false,
            message: 'Invalid expiry date format.'
          };
          return;
        }

        const now = new Date();
        if (now > expiryDate) {
          this.verificationResult = { 
            valid: false, 
            message: 'This ID has expired.' 
          };
          return;
        }

        this.qrCodeText = `BRGYID:${this.idNumber}|VERIFY:${
          window.location.origin
        }/verify/${this.idNumber}`;

        this.verificationResult = {
          valid: true,
          status: userData.status || 'approved',
          resident: userData
        };
      } catch (err) {
        console.error('Verification failed:', err);
        this.verificationResult = {
          valid: false,
          message: 'Verification service unavailable. Please try again later.'
        };
      } finally {
        this.loading = false;
      }
    },
    clearForm() {
      this.idNumber = ''
      this.verificationResult = null
      this.qrCodeText = ''
      this.scannerActive = false
    },
    formatDate(timestamp) {
      if (!timestamp) return 'N/A'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    downloadQR() {
      const qrElement = document.querySelector('.qr-container');
      
      html2canvas(qrElement).then(canvas => {
        const link = document.createElement('a');
        link.download = `brgy-id-${this.idNumber}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    },
    showToast(message, type = 'info') {
      // Implement your toast notification here
      // You can use a library like vue-toastification or create your own
      console.log(`${type}: ${message}`);
    }
  }
}
</script>

<style scoped>
/* Modern gradient background */
.bg-gradient {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: 100vh;
}

/* Glass card effect */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Icon wrapper for status icons */
.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-soft {
  background-color: rgba(13, 110, 253, 0.1);
}

.bg-success-soft {
  background-color: rgba(25, 135, 84, 0.1);
}

.bg-danger-soft {
  background-color: rgba(220, 53, 69, 0.1);
}

/* Form input styling */
.form-control {
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
  border-color: rgba(13, 110, 253, 0.3);
}

/* Button styling */
.btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 110, 253, 0.1);
  border: none;
}

.btn-icon:hover {
  background: rgba(13, 110, 253, 0.2);
}

/* Resident info styling */
.resident-info {
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 12px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-item .label {
  font-weight: 500;
  color: #6c757d;
  min-width: 100px;
}

.info-item .value {
  color: #212529;
}

/* QR container */
.qr-container {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: inline-block;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
  
  .btn {
    padding: 10px 16px;
  }
}
</style>