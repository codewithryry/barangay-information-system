<template>
  <transition name="fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal" @click.stop role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div class="modal-header">
          <h3 id="modalTitle">{{ mode === 'view' ? 'Announcement Details' : editingAnnouncement ? 'Edit Announcement' : 'Create Announcement' }}</h3>
          <button class="modal-close" @click="$emit('close')" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="mode === 'view'" class="view-mode">
            <div class="announcement-meta">
              <span class="created-at">Created: {{ formatDate(localAnnouncement.createdAt) }}</span>
              <span v-if="localAnnouncement.updatedAt" class="updated-at">Updated: {{ formatDate(localAnnouncement.updatedAt) }}</span>
              <span v-if="localAnnouncement.isImportant" class="important-tag">Important</span>
            </div>
            <div class="announcement-meta">
              <span class="posted-by">Posted by: {{ getAdminName(localAnnouncement.adminId) }}</span>
            </div>
            <h4 class="announcement-title">{{ localAnnouncement.title }}</h4>
            <div class="announcement-content">{{ localAnnouncement.content }}</div>
            <div class="recipients-section">
              <h5>Recipients:</h5>
              <div v-if="localAnnouncement.recipientIds.length > 0">
                <ul class="recipients-list">
                  <li v-for="recipient in getRecipientNames(localAnnouncement.recipientIds)" :key="recipient.id">
                    {{ recipient.name }}
                  </li>
                </ul>
              </div>
              <div v-else>
                <p>No specific recipients (visible to all residents)</p>
              </div>
            </div>
          </div>
          <div v-else class="edit-mode">
            <div class="form-group">
              <label for="announcementTitle">Title</label>
              <input
                id="announcementTitle"
                v-model="localAnnouncement.title"
                class="form-control"
                placeholder="Enter announcement title"
                required
                :class="{ 'is-invalid': !localAnnouncement.title && formSubmitted }"
                @focus="formSubmitted = false"
              >
              <div v-if="!localAnnouncement.title && formSubmitted" class="error-text">Title is required</div>
            </div>
            <div class="form-group">
              <label for="announcementContent">Content</label>
              <textarea
                id="announcementContent"
                v-model="localAnnouncement.content"
                class="form-control"
                rows="5"
                placeholder="Enter announcement content"
                required
                :class="{ 'is-invalid': !localAnnouncement.content && formSubmitted }"
                @focus="formSubmitted = false"
              ></textarea>
              <div v-if="!localAnnouncement.content && formSubmitted" class="error-text">Content is required</div>
            </div>
            <div class="form-group">
              <label for="recipientUsers">Resident Recipients (optional)</label>
              <div class="multiselect-wrapper">
                <multiselect
                  v-model="localAnnouncement.recipientIds"
                  :options="residentOptions"
                  :multiple="true"
                  :searchable="true"
                  :close-on-select="false"
                  :loading="loadingUsers"
                  placeholder="Select residents"
                  label="name"
                  track-by="id"
                ></multiselect>
              </div>
              <small class="form-hint">Start typing to search residents (leave empty for all residents)</small>
            </div>
            <div class="form-group form-group-important">
              <label>
                <input type="checkbox" v-model="localAnnouncement.isImportant" class="important-checkbox">
                <span>Mark as important</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="mode === 'view'" class="btn btn-close" @click="$emit('close')">Close</button>
          <template v-else>
            <button class="btn btn-cancel" @click="$emit('close')">Cancel</button>
            <button class="btn btn-confirm" @click="handleSave" :disabled="loadingUsers || saving">
              <span v-if="loadingUsers || saving" class="spinner"></span>
              {{ loadingUsers || saving ? 'Saving...' : 'Save' }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { db, auth } from '@/firebase/config'
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import Multiselect from 'vue-multiselect'

export default {
  name: 'AnnouncementModal',
  components: { Multiselect },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    announcement: {
      type: Object,
      default: () => ({ 
        title: '', 
        content: '', 
        recipientIds: [], 
        isImportant: false,
        createdAt: null,
        updatedAt: null,
        adminId: null
      })
    },
    editingAnnouncement: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'edit', 
      validator: value => ['edit', 'view'].includes(value)
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      localAnnouncement: { 
        title: '', 
        content: '', 
        recipientIds: [], 
        isImportant: false,
        createdAt: null,
        updatedAt: null,
        adminId: null
      },
      residents: [],
      admins: [],
      loadingUsers: false,
      formSubmitted: false,
      saving: false,
      saveStatus: null
    }
  },
  computed: {
    residentOptions() {
      return this.residents.map(user => ({
        id: user.id,
        name: `${user.name} (${user.email})`
      }))
    }
  },
  watch: {
    announcement: {
      handler(newVal) {
        this.localAnnouncement = { 
          ...this.localAnnouncement,
          ...newVal,
          recipientIds: newVal.recipientIds || [],
          isImportant: newVal.isImportant || false,
          adminId: newVal.adminId || null
        }
      },
      deep: true,
      immediate: true
    },
    isVisible(newVal) {
      if (newVal) {
        this.localAnnouncement = { 
          ...this.announcement,
          recipientIds: this.announcement.recipientIds || [],
          isImportant: this.announcement.isImportant || false,
          adminId: this.announcement.adminId || (auth.currentUser ? auth.currentUser.uid : null)
        }
        this.formSubmitted = false
        this.saveStatus = null
        this.fetchUsers()
      }
    }
  },
  methods: {
    async fetchUsers() {
      this.loadingUsers = true
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const users = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || 'Unknown',
            email: data.email || 'N/A',
            role: data.role || ''
          }
        })
        this.residents = users.filter(user => user.role === 'resident')
        this.admins = users.filter(user => user.role === 'admin')
      } catch (error) {
        console.error('Error fetching users:', error)
        if (this.$toast) {
          this.$toast.error('Failed to load users')
        } else {
          console.error('Failed to load users')
        }
      } finally {
        this.loadingUsers = false
      }
    },
    async handleSave() {
      this.formSubmitted = true
      if (!this.localAnnouncement.title || !this.localAnnouncement.content) {
        if (this.$toast) {
          this.$toast.error('Title and content are required')
        } else {
          console.error('Title and content are required')
        }
        return
      }

      this.saving = true
      this.saveStatus = null
      try {
        const announcementData = {
          title: this.localAnnouncement.title,
          content: this.localAnnouncement.content,
          recipientIds: this.localAnnouncement.recipientIds.map(u => u.id || u),
          isImportant: this.localAnnouncement.isImportant || false,
          adminId: auth.currentUser ? auth.currentUser.uid : null,
          updatedAt: new Date()
        }

        if (this.editingAnnouncement) {
          await updateDoc(doc(db, 'announcements', this.editingAnnouncement.id), announcementData)
          if (this.$toast) {
            this.$toast.success('Announcement updated successfully')
          }
          this.saveStatus = 'success'
        } else {
          const id = uuidv4()
          announcementData.createdAt = new Date()
          await setDoc(doc(db, 'announcements', id), announcementData)
          if (this.$toast) {
            this.$toast.success('Announcement created successfully')
          }
          this.saveStatus = 'success'
        }

        this.$emit('save')
        this.$emit('close')
      } catch (error) {
        console.error('Error saving announcement:', error)
        if (this.$toast) {
          this.$toast.error('Failed to save announcement')
        }
        this.saveStatus = 'error'
      } finally {
        this.saving = false
      }
    },
    formatDate(date) {
      if (!date) return 'N/A'
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toLocaleString()
    },
    getRecipientNames(recipientIds) {
      return recipientIds.map(id => {
        const user = this.residents.find(u => u.id === id)
        return user || { id, name: 'Unknown resident' }
      })
    },
    getAdminName(adminId) {
      if (!adminId) return 'Unknown admin'
      const admin = this.admins.find(u => u.id === adminId)
      return admin ? `${admin.name} (${admin.email})` : 'Unknown admin'
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal {
  background: #ffffff;
  border-radius: 1rem;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  animation: fadeInScale 0.3s ease;
  transform: scale(1);
  
  display: block !important;
  opacity: 1 !important;
}

@keyframes fadeInScale {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 70vh;
}

.view-mode {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.announcement-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;
}

.important-tag {
  color: #ef4444;
  font-weight: 500;
}

.posted-by {
  font-size: 0.875rem;
  color: #6b7280;
}

.announcement-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.announcement-content {
  white-space: pre-line;
  line-height: 1.6;
}

.recipients-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.recipients-section h5 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.recipients-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group-important {
  margin-bottom: 0;
  text-align: end;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-control,
textarea.form-control {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  background-color: #f9fafb;
  color: #111827;
}

.form-control:focus {
  border-color: #3b82f6;
  outline: none;
  background-color: #fff;
}

.form-control.is-invalid {
  border-color: #ef4444;
}

.error-text {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.important-checkbox {
  margin-right: 0.5rem;
  accent-color: #3b82f6;
}

.multiselect-wrapper {
  margin-bottom: 0.25rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  border: none;
}

.btn-close {
  background-color: #3b82f6;
  color: white;
}

.btn-close:hover {
  background-color: #2563eb;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  background-color: #3b82f6;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-confirm:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .modal {
    max-width: 100%;
    border-radius: 0.75rem;
  }

  .modal-body,
  .modal-header,
  .modal-footer {
    padding: 1rem;
  }
}
</style>