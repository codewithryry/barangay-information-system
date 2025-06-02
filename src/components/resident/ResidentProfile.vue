
<template>
  <div class="profile-container">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="header-content">
        <h1 class="profile-title">My Profile</h1>
        <p class="profile-subtitle">Manage your personal information and ID</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="profile-content">
      <!-- Profile Card -->
      <div class="profile-card glass-card">
        <div class="profile-actions">
          <button v-if="!editMode" @click="editMode = true" class="edit-button">
            <i class="fas fa-edit"></i> Edit Profile
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="!editMode && profile" class="profile-view">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <img v-if="profile.photoURL" :src="profile.photoURL" alt="Profile photo">
              <i v-else class="fas fa-user"></i>
            </div>
            <div class="profile-info">
              <h2 class="profile-name">{{ profile.name || 'Not Provided' }}</h2>
              <p class="profile-email">{{ profile.email || 'Not Provided' }}</p>
              <div class="profile-status">
                <span class="status-badge" :class="profile.status || 'inactive'">
                  {{ profile.status || 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <div class="profile-details">
            <div class="detail-card" v-for="(detail, key) in profileDetails" :key="key">
              <div class="detail-icon">
                <i :class="detail.icon"></i>
              </div>
              <div class="detail-content">
                <span class="detail-label">{{ detail.label }}</span>
                <span class="detail-value">{{ detail.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-if="editMode" class="profile-edit">
          <form @submit.prevent="updateProfile">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input v-model="editProfile.name" type="text" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="profile.email" type="email" class="form-input" disabled>
                <p class="form-note">Email cannot be changed</p>
              </div>
              
              <div class="form-group full-width">
                <label class="form-label">Address</label>
                <input v-model="editProfile.address" type="text" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Birthdate</label>
                <input v-model="editProfile.birthdate" type="date" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Contact Number</label>
                <input v-model="editProfile.contact" type="tel" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">Gender</label>
                <select v-model="editProfile.gender" class="form-input" required>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Civil Status</label>
                <select v-model="editProfile.civilStatus" class="form-input" required>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Barangay Name</label>
                <input v-model="editProfile.barangayName" type="text" class="form-input" required>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="editMode = false" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="save-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- ID Card Section -->
        <div v-if="profile && profile.role === 'resident'" class="id-card-section">
          <div class="section-header">
            <h3><i class="fas fa-id-card"></i> Barangay ID</h3>
            <button 
              v-if="!profile.residentId && canGenerateID" 
              @click="generateID" 
              class="generate-id-button"
              :disabled="generatingID"
            >
              <i class="fas fa-plus-circle"></i> 
              {{ generatingID ? 'Generating...' : 'Generate ID' }}
            </button>
          </div>

          <div v-if="profile.residentId" class="id-card-wrapper">
            <div class="id-card">
              <div class="id-header">
                <div class="bis-logo">
                  <img src="@/assets/bis-logo.png" alt="BIS Logo">
                </div>
                <div class="id-title">
                  <h4>Republic of the Philippines</h4>
                  <p>BARANGAY {{ profile.barangayName || '[BARANGAY NAME]' }}</p>
                  <p class="id-subtitle">BARANGAY IDENTIFICATION CARD</p>
                </div>
                <div class="philippine-seal">
                  <img src="@/assets/ph-seal.png" alt="Philippine Seal">
                </div>
              </div>

              <div class="id-body">
                <div class="id-photo">
                  <img :src="profile.photoURL || require('@/assets/avatar.jpg')" alt="ID Photo" class="photo-frame">
                  <div class="lamination-effect"></div>
                  <strong>{{ profile.name || 'N/A' }}</strong>
                  <div class="photo-signature">Authorized Signature</div>
                </div>
                <div class="id-details">
                  <div class="detail-row id-number">
                    <span class="label">ID No:</span>
                    <strong>{{ profile.residentId }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="label">Birthdate:</span>
                    <strong>{{ formatDate(profile.birthdate) }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="label">Gender:</span>
                    <strong>{{ capitalize(profile.gender) || 'N/A' }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="label">Civil Status:</span>
                    <strong>{{ capitalize(profile.civilStatus) || 'N/A' }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="label">Address:</span>
                    <strong>{{ profile.address || 'N/A' }}</strong>
                  </div>
                </div>
                <div class="id-qr">
                  <div class="qr-container">
                    <qr-code :text="qrCodeText" :size="80"></qr-code>
                    <div class="holographic-overlay"></div>
                  </div>
                  <p class="qr-text">SCAN TO VERIFY</p>
                </div>
              </div>

              <div class="id-footer">
                <div class="signature">
                  <div class="signature-line"></div>
                  <p>BARANGAY CAPTAIN</p>
                </div>
                <div class="validity-stamp">
                  <p>VALID UNTIL: {{ formatDate(profile.idExpiresAt, 'MM/DD/YYYY') }}</p>
                </div>
              </div>
            </div>

            <div class="id-actions">
              <button @click="printID" class="action-button print-button">
                <i class="fas fa-print"></i> Print
              </button>
              <button @click="downloadID" class="action-button download-button">
                <i class="fas fa-download"></i> Download
              </button>
              <button @click="verifyID" class="action-button verify-button">
                <i class="fas fa-qrcode"></i> Verify
              </button>
            </div>
          </div>

          <div v-else-if="!profile.residentId" class="no-id-message">
            <i class="fas fa-id-card-alt"></i>
            <p>No Barangay ID has been generated yet.</p>
            <p v-if="!canGenerateID" class="requirements">
              Complete your profile information to generate an ID.
            </p>
          </div>
        </div>

        <!-- Status Message -->
        <transition name="fade">
          <div v-if="message" :class="`status-message ${messageType}`">
            <i :class="messageIcon"></i>
            <span>{{ message }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { db, storage } from '@/firebase/config'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import QRCode from 'qrcode.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
  components: {
    'qr-code': QRCode
  },
  data() {
    return {
      profile: null,
      editMode: false,
      editProfile: {
        name: '',
        address: '',
        birthdate: '',
        contact: '',
        gender: '',
        civilStatus: '',
        barangayName: ''
      },
      message: '',
      messageType: '',
      generatingID: false,
      qrCodeText: '',
      profileDetails: [],
      currentDate: new Date('2025-06-03T02:58:00-07:00') // 02:58 AM PST, June 03, 2025
    }
  },
  computed: {
    canGenerateID() {
      return this.profile && 
             this.profile.name && 
             this.profile.address &&
             this.profile.birthdate &&
             this.profile.gender &&
             this.profile.civilStatus &&
             this.profile.barangayName
    },
    messageIcon() {
      return {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
      }[this.messageType]
    }
  },
  async created() {
    await this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      try {
        const user = this.$store.state.auth.user
        if (!user) throw new Error('User not authenticated')
        
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          this.profile = docSnap.data()
          this.editProfile = {
            name: this.profile.name || '',
            address: this.profile.address || '',
            birthdate: this.profile.birthdate || '',
            contact: this.profile.contact || '',
            gender: this.profile.gender || '',
            civilStatus: this.profile.civilStatus || '',
            barangayName: this.profile.barangayName || ''
          }

          if (this.profile.residentId) {
            this.qrCodeText = `BRGYID:${this.profile.residentId}|VERIFY:${window.location.origin}/verify/${this.profile.residentId}`
          }

          this.updateProfileDetails()
        } else {
          throw new Error('Profile not found')
        }
      } catch (error) {
        this.showMessage('Error loading profile: ' + error.message, 'error')
      }
    },
    updateProfileDetails() {
      this.profileDetails = [
        {
          icon: 'fas fa-map-marker-alt',
          label: 'Address',
          value: this.profile.address || 'Not provided'
        },
        {
          icon: 'fas fa-birthday-cake',
          label: 'Birthdate',
          value: this.formatDate(this.profile.birthdate) || 'Not provided'
        },
        {
          icon: 'fas fa-phone',
          label: 'Contact Number',
          value: this.profile.contact || 'Not provided'
        },
        {
          icon: 'fas fa-venus-mars',
          label: 'Gender',
          value: this.capitalize(this.profile.gender) || 'Not provided'
        },
        {
          icon: 'fas fa-heart',
          label: 'Civil Status',
          value: this.capitalize(this.profile.civilStatus) || 'Not provided'
        },
        {
          icon: 'fas fa-calendar-check',
          label: 'Member Since',
          value: this.formatDate(this.profile.createdAt) || 'June 03, 2025'
        },
        {
          icon: 'fas fa-map',
          label: 'Barangay',
          value: this.profile.barangayName || 'Not provided'
        }
      ]
    },
    async updateProfile() {
      try {
        const user = this.$store.state.auth.user
        if (!user) throw new Error('User not authenticated')
        
        const docRef = doc(db, 'users', user.uid)
        
        await updateDoc(docRef, {
          name: this.editProfile.name,
          address: this.editProfile.address,
          birthdate: this.editProfile.birthdate,
          contact: this.editProfile.contact,
          gender: this.editProfile.gender,
          civilStatus: this.editProfile.civilStatus,
          barangayName: this.editProfile.barangayName,
          updatedAt: this.currentDate
        })
        
        this.showMessage('Profile updated successfully!', 'success')
        this.editMode = false
        await this.fetchProfile()
      } catch (error) {
        this.showMessage('Error updating profile: ' + error.message, 'error')
      }
    },
    async generateID() {
      if (!this.canGenerateID) {
        this.showMessage('Please complete your profile before generating an ID', 'error')
        return
      }
      
      this.generatingID = true
      
      try {
        const idNumber = 'BRGY-' + Math.floor(10000000 + Math.random() * 90000000)
        const expiresAt = new Date(this.currentDate)
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        
        const user = this.$store.state.auth.user
        const docRef = doc(db, 'users', user.uid)
        
        await updateDoc(docRef, {
          residentId: idNumber,
          issuedAt: this.currentDate,
          idExpiresAt: expiresAt,
          status: 'active',
          updatedAt: this.currentDate
        })
        
        const idIssuanceRef = doc(db, 'id_issuance', idNumber)
        await setDoc(idIssuanceRef, {
          userId: user.uid,
          issuedAt: this.currentDate,
          expiresAt: expiresAt,
          status: 'active'
        })
        
        this.showMessage('Barangay ID generated successfully!', 'success')
        await this.fetchProfile()
      } catch (error) {
        console.error('Error generating ID:', error)
        this.showMessage('Failed to generate ID: ' + error.message, 'error')
      } finally {
        this.generatingID = false
      }
    },
    async printID() {
      try {
        const element = document.querySelector('.id-card')
        if (!element) throw new Error('ID card element not found')
        
        const canvas = await html2canvas(element, {
          scale: 3,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        })
        
        const link = document.createElement('a')
        link.download = `Barangay-ID-${this.profile.residentId}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (error) {
        this.showMessage('Error preparing ID for printing: ' + error.message, 'error')
      }
    },
    async downloadID() {
      try {
        const element = document.querySelector('.id-card')
        if (!element) throw new Error('ID card element not found')
        
        const canvas = await html2canvas(element, {
          scale: 3,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        })
        
        const pdf = new jsPDF('l', 'mm', [86, 54])
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 86, 54)
        pdf.save(`Barangay-ID-${this.profile.residentId}.pdf`)
      } catch (error) {
        this.showMessage('Error generating PDF: ' + error.message, 'error')
      }
    },
    verifyID() {
      if (!this.profile.residentId) {
        this.showMessage('No ID to verify', 'error')
        return
      }
      this.$router.push(`/verify/${this.profile.residentId}`)
    },
    formatDate(date, format = 'long') {
      if (!date) return 'N/A'
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      
      if (format === 'MM/DD/YYYY') {
        return dateObj.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    capitalize(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    showMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
      setTimeout(() => {
        this.message = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Arial', sans-serif;
}

.profile-header {
  background: linear-gradient(to right, #004aad, #0066cc);
  color: white;
  padding: 3rem 2rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
}

.profile-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.profile-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0;
  font-weight: 400;
}

.profile-content {
  max-width: 1200px;
  margin: -1.5rem auto 3rem;
  padding: 0 1.5rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-actions {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #004aad;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background: #00397a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-avatar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6f0ff 0%, #c3daff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #004aad;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  aspect-ratio: 1 / 1;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.avatar-circle i {
  font-size: 2.5rem;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.profile-email {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0 0 0.5rem;
}

.profile-status .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.profile-status .active {
  background: #dcfce7;
  color: #15803d;
}

.profile-status .inactive {
  background: #fee2e2;
  color: #b91c1c;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
}

.detail-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6f0ff 0%, #c3daff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #004aad;
  font-size: 1.25rem;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
}

.profile-edit {
  margin-top: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #004aad;
  box-shadow: 0 0 0 3px rgba(0, 74, 173, 0.2);
}

.form-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}

.form-note {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.25rem 0 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #e5e7eb;
}

.save-button {
  background: #004aad;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button:hover {
  background: #00397a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.id-card-section {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.generate-id-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-id-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.generate-id-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.id-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 10px;
}

.id-card {
  width: 86mm;
  height: 54mm;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  font-family: 'Helvetica Neue', sans-serif;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
}

.id-header {
  background: #004aad;
  color: white;
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.bis-logo {
  width: 18mm;
  height: 11mm;
  display: flex;
  align-items: center;
  position: absolute;
  left: 5px;
}

.bis-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.id-title {
  flex: 1;
  text-align: center;
  padding: 0 5px;
}

.id-title h4 {
  margin: 0;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.id-title p {
  margin: 2px 0 0;
  font-size: 7px;
  font-weight: 500;
  text-transform: uppercase;
}

.id-title .id-subtitle {
  margin: 2px 0 0;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.philippine-seal {
  width: 11mm;
  height: 11mm;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 5px;
}

.philippine-seal img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.id-body {
  display: flex;
  padding: 4px 6px;
  height: 68%;
  gap: 4px;
  background: white;
}

.id-photo {
  flex: 0 0 18mm;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.id-photo .photo-frame {
  width: 18mm;
  height: 18mm;
  border-radius: 3px;
  object-fit: cover;
  object-position: center;
  border: 1px solid #ddd;
}

.id-photo .photo-signature {
  font-size: 0.5rem;
  margin-top: 1px;
  text-align: center;
  font-style: italic;
  color: #666;
}

.id-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  background: white;
  border-radius: 4px;
}

.detail-row {
  display: flex;
  gap: 4px;
  align-items: flex-start;
  line-height: 1.2;
  font-size: 0.6rem;
}

.detail-row.id-number {
  font-size: 0.95rem;
  font-weight: 900;
  color: #004aad;
  margin-bottom: 4px;
  letter-spacing: 0.1em;
}

.detail-row .label {
  color: #666;
  width: 60px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.8rem;
}

.detail-row strong {
  color: #333;
  font-weight: 500;
  flex: 1;
  word-break: break-word;
  max-width: 100%;
  font-size: 0.8rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 6px;
  flex: 1;
}

.detail-row.address-row {
  grid-column: 1 / -1;
}

.id-qr {
  flex: 0 0 18mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.qr-container {
  position: relative;
  padding: 2px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.qr-text {
  font-size: 0.5rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
  color: #333;
}

.id-footer {
  height: 14%;
  padding: 3px 6px;
  background: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
}

.signature {
  text-align: center;
  flex: 1;
}

.signature-line {
  width: 40mm;
  height: 1px;
  background: #999;
  margin: 0 auto 1px;
}

.signature p {
  margin: 0;
  font-size: 0.6rem;
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
}

.validity-stamp {
  text-align: right;
}

.validity-stamp p {
  margin: 0;
  font-size: 0.6rem;
  color: #333;
  font-weight: 700;
}

.id-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.print-button {
  background: #e6f0ff;
  color: #004aad;
}

.print-button:hover {
  background: #c3daff;
}

.download-button {
  background: #dcfce7;
  color: #15803d;
}

.download-button:hover {
  background: #bbf7d0;
}

.verify-button {
  background: #ede9fe;
  color: #6d28d9;
}

.verify-button:hover {
  background: #ddd6fe;
}

.no-id-message {
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  color: #6b7280;
}

.no-id-message i {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: #d1d5db;
}

.no-id-message p {
  margin: 0.5rem 0;
}

.requirements {
  font-size: 0.85rem;
  color: #9ca3af;
}

.status-message {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease-out;
}

.status-message.success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.status-message.error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.status-message.info {
  background: #e6f0ff;
  color: #004aad;
  border: 1px solid #c3daff;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Carbon Copy Effect */
.carbon-copy {
  position: relative;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px #ddd, 0 0 5px rgba(0,0,0,0.1);
}

.carbon-copy::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border: 1px dashed rgba(0,0,0,0.1);
  pointer-events: none;
}

.carbon-copy::after {
  content: "COPY";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 3rem;
  font-weight: bold;
  color: rgba(0,0,0,0.05);
  z-index: 0;
  pointer-events: none;
}

/* Original ID Card Styling */
.original-id {
  position: relative;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.original-id::before {
  content: "ORIGINAL";
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.6rem;
  font-weight: bold;
  color: #004aad;
  background: rgba(0,74,173,0.1);
  padding: 2px 5px;
  border-radius: 3px;
}

.id-card-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 2rem 1rem;
    text-align: center;
  }
  
  .profile-content {
    padding: 0 1rem 2rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
  
  .profile-avatar {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-details {
    grid-template-columns: 1fr;
  }
  
  .id-card {
    transform: scale(0.8);
    transform-origin: center;
  }
  
  .id-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-title {
    font-size: 1.75rem;
  }
  
  .profile-subtitle {
    font-size: 0.9rem;
  }
  
  .avatar-circle {
    width: 80px;
    height: 80px;
  }
  
  .profile-name {
    font-size: 1.25rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .save-button {
    width: 100%;
  }
  
  .id-card {
    transform: scale(0.6);
  }
}
</style>

