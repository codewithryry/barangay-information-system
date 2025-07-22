<template>
  <div class="profile-container">
    <!-- Profile Header -->
           <br>
      <br>
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
                <label class="form-label">Address(Sitio)</label>
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


       <!-- Enhanced ID Card Section -->
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

          <div class="id-card-container">
            <div v-if="profile.residentId" class="id-card-wrapper">
              <div class="id-card-stack">
                <!-- Front ID Card -->
                <div class="id-card front-card">
                <div class="id-header">
                  <div>
                  </div>
                  <div class="id-title">
                    <p class="id-subtitle">RESIDENT IDENTIFICATION CARD</p>
                  </div>
                  <div >
                  </div>
                </div>
                <div class="id-body">
                  <div class="id-left">
                    <div class="id-photo">
                      <div class="photo-frame">
                        <img :src="profile.photoURL || 'https://via.placeholder.com/120x150'" alt="ID Photo">
                      </div>
                    </div>
                  </div>
                  <div class="id-right">
                    <div class="detail-row id-number">
                      <span class="label">ID No:</span>
                      <strong><b>{{ profile.residentId }}</b></strong>
                    </div>
                    <div class="detail-row">
                      <span class="label">Full Name:</span>
                      <strong>{{ profile.name || 'N/A' }}</strong>
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
                      <span class="label">Valid Until:</span>
                      <strong>{{ formatDate(profile.idExpiresAt, 'MM/DD/YYYY') }}</strong>
                    </div>
         
                    <div class="detail-row address-row">
                      <span class="label">Address:</span>
                      <strong>{{ profile.address || 'N/A' }}</strong>
                    </div>
                  </div>
                </div>
                <div class="id-footer">
                  <div class="footer-notice">
                   
                  </div>
                </div>
              </div>

              <!-- Back ID Card -->
              <div class="id-card back-card">
               <div class="back-header">
                  <h4></h4>
                  <p>BARANGAY IDENTIFICATION CARD</p>
                </div>
                <div class="back-body">
                  <div class="terms-section">
                    <h5>TERMS AND CONDITIONS</h5>
                    <ol class="terms-list">
                      <li>This ID is property of the Barangay and must be surrendered upon request.</li>
                      <li>Report lost or stolen IDs immediately to the Barangay Office.</li>
                      <li>Present this ID when availing of Barangay services.</li>
                      <li>Valid for one year from date of issue unless otherwise specified.</li>
                    </ol>
                  </div>
                </div>
                <div class="id-footer">
                  <div class="footer-notice">
                    <p>This ID is non-transferable and remains property of {{ profile.barangayName || 'Barangay' }}</p>
                  </div>
                </div>
              </div>
            </div>

              <div class="id-actions">
                <button @click="printID" class="action-button print-button">
                  <i class="fas fa-print"></i> Print ID
                </button>
                <button @click="downloadID" class="action-button download-button">
                  <i class="fas fa-file-pdf"></i> Save as PDF
                </button>
                <button @click="verifyID" class="action-button verify-button">
                  <i class="fas fa-qrcode"></i> Verify Online
                </button>
              </div>
            </div>
        

            <div v-else-if="!profile.residentId" class="no-id-message">
              <div class="no-id-icon">
                <i class="fas fa-id-card-alt"></i>
              </div>
              <h4>No Barangay ID Generated</h4>
              <p v-if="!canGenerateID" class="requirements">
                Please complete your profile information to generate your Barangay ID
              </p>
              <button 
                v-if="canGenerateID" 
                @click="generateID" 
                class="generate-id-button primary"
                :disabled="generatingID"
              >
                <i class="fas fa-id-card"></i> 
                {{ generatingID ? 'Generating...' : 'Generate My ID Now' }}
              </button>
            </div>
          </div>
        </div>
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
      currentDate: new Date('2025-06-03T10:15:00-07:00') // 10:15 AM PST, June 03, 2025
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
          this.profile = { ...docSnap.data(), email: user.email }
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
          // Initialize new profile with createdAt
          this.profile = {
            email: user.email,
            role: 'resident',
            status: 'inactive',
            createdAt: this.currentDate
          }
          await setDoc(docRef, this.profile)
          this.editProfile = {
            name: '',
            address: '',
            birthdate: '',
            contact: '',
            gender: '',
            civilStatus: '',
            barangayName: ''
          }
          this.updateProfileDetails()
        }
      } catch (error) {
        this.showMessage('Error loading profile: ' + error.message, 'error')
      }
    },
    updateProfileDetails() {
      this.profileDetails = [
        {
          icon: 'fas fa-map-marker-alt',
          label: 'Address(Sitio)',
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
          value: this.formatDate(this.profile.createdAt) || 'Not provided'
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
        
        const updatedProfile = {
          name: this.editProfile.name,
          address: this.editProfile.address,
          birthdate: this.editProfile.birthdate,
          contact: this.editProfile.contact,
          gender: this.editProfile.gender,
          civilStatus: this.editProfile.civilStatus,
          barangayName: this.editProfile.barangayName,
          updatedAt: this.currentDate,
          status: this.canGenerateID ? 'active' : 'inactive'
        }
        
        await updateDoc(docRef, updatedProfile)
        this.profile = { ...this.profile, ...updatedProfile }
        
        this.showMessage('Profile updated successfully!', 'success')
        this.editMode = false
        this.updateProfileDetails()
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
        if (!user) throw new Error('User not authenticated')
        
        const docRef = doc(db, 'users', user.uid)
        
        const idData = {
          residentId: idNumber,
          issuedAt: this.currentDate,
          idExpiresAt: expiresAt,
          status: 'active',
          updatedAt: this.currentDate
        }
        
        await updateDoc(docRef, idData)
        this.profile = { ...this.profile, ...idData }
        
        const idIssuanceRef = doc(db, 'id_issuance', idNumber)
        await setDoc(idIssuanceRef, {
          userId: user.uid,
          issuedAt: this.currentDate,
          expiresAt: expiresAt,
          status: 'active'
        })
        
        this.qrCodeText = `BRGYID:${idNumber}|VERIFY:${window.location.origin}/verify/${idNumber}`
        this.showMessage('Barangay ID generated successfully!', 'success')
        this.updateProfileDetails()
      } catch (error) {
        console.error('Error generating ID:', error)
        this.showMessage('Failed to generate ID: ' + error.message, 'error')
      } finally {
        this.generatingID = false
      }
    },
    async printID() {
      try {
        const element = document.querySelector('.front-card')
        if (!element) throw new Error('ID card element not found')
        
        element.style.setProperty('--front-label-display', 'none')
        
        const canvas = await html2canvas(element, {
          scale: 3,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        })
        
        element.style.removeProperty('--front-label-display')
        
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
        const elements = document.querySelectorAll('.id-card')
        if (!elements.length) throw new Error('ID card element not found')
        
        const pdf = new jsPDF('l', 'mm', [86, 54])
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          const labelType = element.classList.contains('front-card') ? 'front' : 'back'
          element.style.setProperty(`--${labelType}-label-display`, 'none')
          
          const canvas = await html2canvas(element, {
            scale: 3,
            logging: false,
            useCORS: true,
            backgroundColor: '#ffffff'
          })
          
          element.style.removeProperty(`--${labelType}-label-display`)
          
          const imgData = canvas.toDataURL('image/png')
          pdf.addImage(imgData, 'PNG', 0, 0, 86, 54)
          if (i < elements.length - 1) {
            pdf.addPage([86, 54], 'l')
          }
        }
        
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
      const dateObj = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date)
      if (isNaN(dateObj.getTime())) return 'N/A'
      
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
  font-family: 'Inter', sans-serif; /* Updated to a modern sans-serif font */
}

.profile-header {
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
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
  background: #1e3a8a;
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
  background: #172554;
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
  color: #1e3a8a;
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
  color: #1e3a8a;
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
  border-color: #1e3a8a;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.2);
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
  background: #1e3a8a;
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
  background: #172554;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.id-card {
  width: 100%;
  max-width: 340px;
  height: auto;
  aspect-ratio: 86/54;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', sans-serif;
  position: relative;
  border: 2px solid #e2e8f0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><path fill="none" stroke="rgba(30,58,138,0.1)" stroke-width="0.5" d="M0,50a50,50 0 1,0 100,0a50,50 0 1,0 -100,0M50,0a50,50 0 1,0 0,100a50,50 0 1,0 0,-100" /></svg>');
  background-size: 20px 20px;
}

.front-card {
  background: linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
}

.front-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
  opacity: 0.5;
}

.back-card {
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.back-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
  opacity: 0.5;
}

.id-header {
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  color: white;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 18%;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
}

.id-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 60%
  );
  animation: shimmer 3s infinite;
}

.official-seal {
  width: 50px;
  height: 50px;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  text-align: center;
  padding: 0.2rem;
  background: radial-gradient(circle, #ffffff 10%, transparent 60%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.seal-text {
  transform: rotate(-15deg);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.id-title {
  flex: 1;
  text-align: center;
  padding: 0 0.5rem;
}

.id-title h4 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.id-title p {
  margin: 0.15rem 0 0;
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
}

.id-title .id-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.qr-mini {
  width: 32px;
  height: 32px;
  background: white;
  padding: 3px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.id-body {
  display: flex;
  padding: 0.6rem;
  height: 72%;
}

.id-left {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 0.6rem;
  border-right: 1px dashed #d1d5db;
}

.id-photo {
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.6rem;
}

.photo-frame {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid #d1d5db;
  background: #f8fafc;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.photo-frame img {
  width: 50%;
  height: 50%;
  object-fit: cover;
}

.signature-line {
  width: 80%;
  height: 1px;
  background: #1e293b;
  margin: 0.3rem 0;
}

.signature-text {
  font-size: 0.55rem;
  font-style: italic;
  color: #475569;
  font-weight: 500;
}

.blood-type {
  width: 100%;
  padding: 0.3rem;
  background: #fef2f2;
  border-radius: 4px;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #b91c1c;
  border: 1px solid #fee2e2;
}

.id-right {
  flex: 1;
  padding-left: 0.6rem;
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: flex;
  margin-bottom: 0.3rem;
  line-height: 1.3;
}

.detail-row.id-number {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.4rem;
  justify-content: center;
  background: #e6f0ff;
  padding: 0.0rem;
  border-radius: 4px;

}

.detail-row .label {
  color: #475569;
  font-weight: 600;
  font-size: 0.65rem;
  min-width: 70px;
}

.detail-row strong {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.7rem;
  flex: 1;
}

.address-row strong {
  word-break: break-word;
}

.issued-date {
  margin-top: auto;
  font-size: 0.55rem;
  color: #475569;
  text-align: right;
  padding-right: 0.5rem;
}

.id-footer {
  height: 10%;
  padding: 0.4rem 0.6rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  border-top: 2px solid #e2e8f0;
  position: relative;
}

.footer-notice {
  font-size: 0.5rem;
  color: #475569;
  text-align: center;
  margin: 0;
  font-weight: 500;
}

.holographic-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.4),
    rgba(0, 255, 0, 0.4),
    rgba(0, 0, 255, 0.4),
    rgba(255, 0, 255, 0.4)
  );
  animation: shimmer 5s infinite;
}

/* Back ID Card Styles */
.back-header {
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  color: white;
  padding: 0.5rem;
  text-align: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
}

.back-header h4 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.back-header p {
  margin: 0.15rem 0 0;
  font-size: 0.65rem;
  font-weight: 500;
}

.back-body {
  padding: 0.6rem;
  height: 72%;
  display: flex;
  flex-direction: column;
}

.terms-section {
  margin-bottom: 0.6rem;
}

.terms-section h5 {
  margin: 0 0 0.4rem;
  font-size: 0.65rem;
  color: #1e3a8a;
  text-transform: uppercase;
  font-weight: 700;
}

.terms-list {
  padding-left: 0.9rem;
  margin: 0;
  font-size: 0.55rem;
  color: #475569;
  line-height: 1.4;
}

.terms-list li {
  margin-bottom: 0.3rem;
}

.contact-section {
  margin-bottom: 0.6rem;
}

.contact-section h5 {
  margin: 0 0 0.4rem;
  font-size: 0.65rem;
  color: #1e3a8a;
  text-transform: uppercase;
  font-weight: 700;
}

.contact-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  margin-bottom: 0.2rem;
}

.contact-row span {
  color: #475569;
  font-weight: 500;
}

.contact-row strong {
  color: #1e293b;
  font-weight: 600;
}

.qr-large {
  align-self: center;
  margin-top: auto;
  text-align: center;
}

.qr-large .qr-notice {
  margin: 0.3rem 0 0;
  font-size: 0.55rem;
  color: #475569;
  font-weight: 500;
}

.back-footer {
  height: 10%;
  padding: 0.4rem 0.6rem;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #e2e8f0;
  font-size: 0.55rem;
  color: #475569;
}

.barcode {
  display: flex;
  align-items: center;
  height: 100%;
}

.barcode-line {
  width: 2px;
  margin-right: 1.5px;
  background: #1e293b;
  border-radius: 1px;
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
  color: #1e3a8a;
  border: 1px solid #bfdbfe;
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
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
    max-width: 300px;
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
    max-width: 100%;
  }
  
  .id-body {
    flex-direction: column;
    height: auto;
    padding-bottom: 3.5rem;
  }
  
  .id-left {
    padding-right: 0;
    margin-bottom: 0.4rem;
  }
  
  .id-right {
    padding-left: 0;
  }
  
  .photo-frame {
    max-width: 50px;
  }
}
</style>
<style scoped>
/* ... (keep previous styles the same until the ID card section) ... */

/* ID Card Section */
.id-card-section {
  margin-top: 3rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
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
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header h3 i {
  color: #3b82f6;
}

.id-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.id-card-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.id-card-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  perspective: 1000px;
}

.id-card {
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.id-card:hover {
  transform: rotateY(10deg);
}

.id-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;
}

.action-button i {
  font-size: 1rem;
}

.print-button {
  background: linear-gradient(to right, #3b82f6, #1e40af);
  color: white;
}

.print-button:hover {
  background: linear-gradient(to right, #2563eb, #1e3a8a);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 64, 175, 0.3);
}

.download-button {
  background: linear-gradient(to right, #ef4444, #b91c1c);
  color: white;
}

.download-button:hover {
  background: linear-gradient(to right, #dc2626, #991b1b);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(185, 28, 28, 0.3);
}

.verify-button {
  background: linear-gradient(to right, #10b981, #047857);
  color: white;
}

.verify-button:hover {
  background: linear-gradient(to right, #059669, #065f46);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(4, 120, 87, 0.3);
}

.generate-id-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: linear-gradient(to right, #8b5cf6, #6d28d9);
  color: white;
  font-size: 0.9rem;
}

.generate-id-button:hover:not(:disabled) {
  background: linear-gradient(to right, #7c3aed, #5b21b6);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(109, 40, 217, 0.3);
}

.generate-id-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.generate-id-button.primary {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  background: linear-gradient(to right, #8b5cf6, #6d28d9);
}

.no-id-message {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
  border: 1px dashed #cbd5e1;
}

.no-id-icon {
  font-size: 3rem;
  color: #8b5cf6;
  margin-bottom: 1rem;
}

.no-id-message h4 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.no-id-message p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.requirements {
  color: #ef4444 !important;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .id-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .id-card-stack {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .id-card-section {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .generate-id-button {
    width: 100%;
    justify-content: center;
  }
}
</style>