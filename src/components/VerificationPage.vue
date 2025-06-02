<template>
  <div class="verification-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <div class="card border-0 shadow-sm rounded-4">
            <div
              class="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4"
            >
              <h5 class="mb-0">
                <i class="bi bi-shield-check me-2"></i>ID Verification
              </h5>
              <button
                class="btn btn-light btn-sm"
                @click="toggleScanner"
                :aria-pressed="scannerActive"
                :title="scannerActive ? 'Turn off scanner' : 'Turn on scanner'"
              >
                <i
                  :class="scannerActive
                    ? 'bi bi-camera-video-off'
                    : 'bi bi-camera-video'"
                ></i>
              </button>
            </div>

            <div class="card-body">
              <qrcode-stream
                v-if="scannerActive"
                @decode="onDecode"
                @init="onInit"
                class="mb-3 rounded-3 border"
                style="height: 300px; width: 100%;"
              />

              <form @submit.prevent="verifyID" autocomplete="off">
                <div class="mb-3">
                  <label for="idNumber" class="form-label fw-semibold"
                    >Enter Barangay ID Number</label
                  >
                  <input
                    v-model.trim="idNumber"
                    type="text"
                    class="form-control form-control-lg"
                    id="idNumber"
                    placeholder="BRGY-12345678"
                    pattern="BRGY-\d{8}"
                    title="Format: BRGY- followed by 8 digits"
                    required
                  />
                  <div
                    v-if="verificationResult && !verificationResult.valid && !loading"
                    class="text-danger small mt-2"
                  >
                    {{ verificationResult.message }}
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary flex-grow-1"
                    :disabled="loading || !isIdNumberValid"
                  >
                    <span v-if="!loading"
                      ><i class="bi bi-search me-2"></i> Verify ID</span
                    >
                    <span v-else>
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
                    class="btn btn-secondary"
                    @click="clearForm"
                    :disabled="loading"
                  >
                    Clear
                  </button>
                </div>
              </form>

              <div v-if="verificationResult" class="mt-4">
                <div
                  v-if="verificationResult.valid"
                  class="alert alert-success rounded-4"
                >
                  <h5><i class="bi bi-check-circle-fill me-2"></i>VALID ID</h5>
                  <div class="row mt-3 align-items-center">
                    <div class="col-md-4 text-center">
                      <img
                        :src="verificationResult.resident.photoURL || '/default-avatar.png'"
                        alt="Resident photo"
                        class="img-thumbnail rounded-circle mb-3"
                        style="width: 120px; height: 120px; object-fit: cover;"
                      />
                      <qr-code :text="qrCodeText" :size="120" />
                    </div>
                    <div class="col-md-8">
                      <h5 class="fw-bold mb-1">
                        {{
                          verificationResult.resident.name ||
                            (verificationResult.resident.lastName +
                              ', ' +
                              verificationResult.resident.firstName)
                        }}
                      </h5>
                      <p class="mb-1">
                        <strong>ID Number:</strong>
                        {{ verificationResult.resident.residentId }}
                      </p>
                      <p class="mb-1">
                        <strong>Status:</strong>
                        <span
                          class="badge bg-success text-uppercase"
                          >{{ verificationResult.status }}</span
                        >
                      </p>
                      <p class="mb-0">
                        <strong>Valid until:</strong>
                        {{ formatDate(verificationResult.resident.idExpiresAt) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="alert alert-danger rounded-4"
                  role="alert"
                  aria-live="polite"
                >
                  <h5>
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>INVALID ID
                  </h5>
                  <p>
                    {{ verificationResult.message || 'This ID number is not valid or not found.' }}
                  </p>
                </div>
              </div>
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
      // simple pattern check to enable button
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
          alert('Invalid QR code format.')
        }
      } else {
        alert('Invalid QR code format.')
      }
    },
    onInit(promise) {
      promise.catch(err => {
        console.error('Camera error:', err)
        alert(
          'Cannot access camera. Please check your device permissions and try again.'
        )
        this.scannerActive = false
      })
    },
    async verifyID() {
      if (!this.isIdNumberValid) {
        this.verificationResult = {
          valid: false,
          message: 'ID number format is invalid.'
        }
        return
      }

      this.loading = true
      this.verificationResult = null

      try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('residentId', '==', this.idNumber.trim()))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          this.verificationResult = { valid: false, message: 'ID number not found.' }
          return
        }

        const userDoc = querySnapshot.docs[0]
        const userData = userDoc.data()

        if (!userData.isApproved) {
          this.verificationResult = { valid: false, message: 'ID is not approved.' }
          return
        }

        if (!userData.idExpiresAt) {
          this.verificationResult = {
            valid: false,
            message: 'ID expiry date is missing.'
          }
          return
        }

        const now = new Date()
        const expiryDate = userData.idExpiresAt.toDate
          ? userData.idExpiresAt.toDate()
          : new Date(userData.idExpiresAt)

        if (now > expiryDate) {
          this.verificationResult = { valid: false, message: 'This ID has expired.' }
          return
        }

        this.qrCodeText = `BRGYID:${this.idNumber}|VERIFY:${window.location.origin}/verify/${this.idNumber}`

        this.verificationResult = {
          valid: true,
          status: userData.status || 'approved',
          resident: userData
        }
      } catch (err) {
        console.error('Verification failed:', err)
        this.verificationResult = {
          valid: false,
          message: err.message || 'An error occurred during verification.'
        }
      } finally {
        this.loading = false
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
    }
  }
}
</script>

<style scoped>
.verification-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  border-radius: 1rem;
}

.card-header {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.btn-light.btn-sm i {
  font-size: 1.25rem;
}
</style>