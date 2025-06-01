<template>

       <br>
    <br>


  <div class="profile-wrapper">
    <div class="profile-header">
      <div class="header-content">
        <h1 class="profile-title">My Profile</h1>
        <p class="profile-subtitle">Manage your personal information</p>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="profile-actions">
          <button v-if="!editMode" @click="editMode = true" class="edit-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>

        <div v-if="!editMode && profile" class="profile-view">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 class="profile-name">{{ profile.name }}</h2>
            <p class="profile-email">{{ profile.email }}</p>
          </div>

          <div class="profile-details">
            <div class="detail-item">
              <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">Address</span>
                <span class="detail-value">{{ profile.address }}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">Birthdate</span>
                <span class="detail-value">{{ formatDate(profile.birthdate) }}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">Contact Number</span>
                <span class="detail-value">{{ profile.contact }}</span>
              </div>
            </div>
          </div>
        </div>

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

        <div v-if="message" :class="`alert-message ${messageType}`">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      profile: null,
      editMode: false,
      editProfile: {
        name: '',
        address: '',
        birthdate: '',
        contact: ''
      },
      message: '',
      messageType: ''
    }
  },
  async created() {
    await this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      const user = this.$store.state.auth.user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        this.profile = docSnap.data()
        this.editProfile = {
          name: this.profile.name,
          address: this.profile.address,
          birthdate: this.profile.birthdate,
          contact: this.profile.contact
        }
      }
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async updateProfile() {
      try {
        const user = this.$store.state.auth.user
        const docRef = doc(db, 'users', user.uid)
        
        await updateDoc(docRef, {
          name: this.editProfile.name,
          address: this.editProfile.address,
          birthdate: this.editProfile.birthdate,
          contact: this.editProfile.contact,
          updatedAt: new Date()
        })
        
        this.message = 'Profile updated successfully!'
        this.messageType = 'success'
        this.editMode = false
        await this.fetchProfile()
        
        setTimeout(() => {
          this.message = ''
        }, 3000)
      } catch (error) {
        this.message = 'Error updating profile: ' + error.message
        this.messageType = 'error'
      }
    }
  }
}
</script>

<style scoped>
.profile-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.profile-header {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  color: white;
  padding: 3rem 2rem 4rem;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.profile-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0;
  font-weight: 400;
}

.profile-content {
  max-width: 900px;
  margin: -3rem auto 0;
  padding: 0 2rem 3rem;
  position: relative;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.profile-actions {
  position: absolute;
  top: 2rem;
  right: 2rem;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-button:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-button svg {
  width: 16px;
  height: 16px;
  stroke: white;
}

.profile-view {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border: 4px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  text-align: center;
}

.profile-email {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

.profile-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 10px;
  transition: all 0.2s;
  background: #f8fafc;
}

.detail-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.detail-icon {
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-icon svg {
  color: #4f46e5;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 500;
}

.profile-edit {
  margin-top: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.form-input {
  padding: 0.875rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.3);
  background: white;
}

.form-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}

.form-note {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0.25rem 0 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #e2e8f0;
}

.save-button {
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.save-button:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.alert-message {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.alert-message.success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.alert-message.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 2rem 1.5rem 3rem;
  }
  
  .profile-content {
    padding: 0 1.5rem 2rem;
  }
  
  .profile-card {
    padding: 1.75rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .detail-item {
    gap: 1rem;
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .save-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-title {
    font-size: 2rem;
  }
  
  .profile-subtitle {
    font-size: 1rem;
  }
  
  .profile-avatar {
    margin-bottom: 0.5rem;
  }
  
  .avatar-circle {
    width: 100px;
    height: 100px;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
}
</style>