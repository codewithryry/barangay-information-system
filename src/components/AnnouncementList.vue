<template>
  <div v-if="showPopup && announcements.length > 0" class="overlay">
    <!-- Announcement Cards -->
    <transition-group name="slide-fade" tag="div" class="announcement-list">
      <div
        v-for="(announcement, index) in announcements"
        :key="announcement.id"
        :class="['announcement-card', announcement.isImportant ? 'important' : 'normal']"
      >
        <div class="card-header">
          <div class="urgency-tag" v-if="announcement.isImportant">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            Important
          </div>
          <h3 class="card-title">{{ announcement.title }}</h3>
          <div class="card-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
            {{ formatDate(announcement.createdAt?.toDate?.() || announcement.createdAt) }}
          </div>
        </div>
        <div class="card-content">
          <p>{{ announcement.content }}</p>
        </div>
        <button class="close-btn" @click="dismissAnnouncement(index)" aria-label="Close announcement">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'

export default {
  name: 'AnnouncementList',
  props: {
    currentUserId: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'resident' // or 'admin', 'sk', 'official'
    }
  },
  data() {
    return {
      announcements: [],
      loading: false,
      showPopup: true
    }
  },
  methods: {
    async fetchAnnouncements() {
      this.loading = true
      try {
        const snapshot = await getDocs(collection(db, 'announcements'))
        const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        // Filter by recipient or show if it's for everyone
        this.announcements = all
          .filter(a => !a.recipientIds?.length || a.recipientIds.includes(this.currentUserId))
          .sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0
            const dateB = b.createdAt?.seconds || 0
            return dateB - dateA
          })
          .slice(0, 3) // Limit to 3 recent announcements for popup
      } catch (error) {
        console.error('Failed to load announcements:', error)
        this.$toast?.error('Could not load announcements')
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    dismissAnnouncement(index) {
      this.announcements.splice(index, 1)
      if (this.announcements.length === 0) {
        this.showPopup = false
      }
    }
  },
  mounted() {
    this.fetchAnnouncements()
  }
}
</script>

<style scoped>
/* Overlay to cover entire viewport with semi-transparent background */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
}

/* Announcement list styles */
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
}

/* Announcement card styles */
.announcement-card {
  position: relative;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
  width: 100%;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Important card styling */
.announcement-card.important {
  border-left: 4px solid #ef4444;
  background-color: #fff5f5;
}

/* Normal card styling */
.announcement-card.normal {
  border-left: 4px solid #3b82f6;
  background-color: #f8fafc;
}

/* Card header styles */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.urgency-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ef4444;
  background: #fee2e2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
}

/* Card content styles */
.card-content {
  color: #334155;
  line-height: 1.6;
  font-size: 0.95rem;
}

.card-content p {
  margin: 0;
  white-space: pre-line;
}

/* Close button styles */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0.25rem;
  transition: color 0.2s ease;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #64748b;
  background: #f1f5f9;
}

/* Transition animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Scrollbar styling */
.announcement-list::-webkit-scrollbar {
  width: 6px;
}
.announcement-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.announcement-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.announcement-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .announcement-list {
    padding: 0.5rem;
  }
  
  .announcement-card {
    padding: 1.25rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-content {
    font-size: 0.9rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>