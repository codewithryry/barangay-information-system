<template>
  <div class="id-generator">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0">
          <i class="bi bi-person-badge me-2"></i>Barangay ID
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 text-center">
            <div class="mb-3">
              <img :src="resident.photoURL || '/default-avatar.png'" 
                   class="img-thumbnail rounded-circle" 
                   style="width: 150px; height: 150px; object-fit: cover;">
            </div>
            <div class="qr-code-container p-2 border rounded bg-white">
              <qr-code :text="qrCodeText" :size="150"></qr-code>
            </div>
          </div>
          <div class="col-md-8">
            <div class="id-details">
              <h4 class="fw-bold">{{ resident.lastName }}, {{ resident.firstName }} {{ resident.middleName }}</h4>
              <hr>
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Birthdate:</strong> {{ formatDate(resident.birthdate) }}</p>
                  <p class="mb-1"><strong>Gender:</strong> {{ resident.gender }}</p>
                  <p class="mb-1"><strong>Civil Status:</strong> {{ resident.civilStatus }}</p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1"><strong>Address:</strong> {{ resident.address }}</p>
                  <p class="mb-1"><strong>Contact:</strong> {{ resident.contact }}</p>
                  <p class="mb-1"><strong>ID Number:</strong> {{ resident.residentId }}</p>
                </div>
              </div>
              <hr>
              <p class="text-muted small mb-0">
                <strong>Valid until:</strong> {{ formatDate(resident.idExpiresAt) }}
              </p>
              <p class="text-muted small mb-0">
                <i class="bi bi-info-circle me-1"></i>
                Scan QR code to verify authenticity
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-end">
        <button class="btn btn-sm btn-primary me-2" @click="printID">
          <i class="bi bi-printer me-1"></i> Print ID
        </button>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-download me-1"></i> Download
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import QRCode from 'qrcode.vue'

export default {
  name: 'IDGenerator',
  components: {
    'qr-code': QRCode
  },
  props: {
    residentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      resident: null,
      qrCodeText: ''
    }
  },
  async mounted() {
    await this.fetchResidentData()
  },
  methods: {
    async fetchResidentData() {
      const docRef = doc(db, 'residents', this.residentId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        this.resident = docSnap.data()
        this.qrCodeText = `BRGYID:${this.residentId}|VERIFY:${window.location.origin}/verify/${this.residentId}`
      }
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
    printID() {
      window.print()
    }
  }
}
</script>

<style scoped>
.id-generator {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.id-details {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.qr-code-container {
  display: inline-block;
  border: 1px solid #dee2e6;
}

@media print {
  .card-footer {
    display: none;
  }
  
  .card {
    border: none;
    box-shadow: none;
  }
}
</style>