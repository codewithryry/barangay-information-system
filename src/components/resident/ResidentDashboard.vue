<template>
  <div class="dashboard-container">
    <!-- Header Section -->
       <br>
        <br>
          <br>
        <br>
    <div class="dashboard-header">
      <div class="header-content">
        <div>
          <h1 class="greeting">Welcome back, <span class="text-gradient">{{ userDisplayName }}</span></h1>
          <p class="subtext">Here's what's happening in your barangay today</p>
        </div>
        <div class="date-display">
          <div class="date-card">
            <span class="day">{{ formattedDate }}</span>
            <span class="time">{{ formattedTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="section-title">
      <h2>Quick Actions</h2>
      <div class="title-decoration"></div>
    </div>
    
    <div class="card-grid">
      <!-- Profile Card -->
      <div class="dashboard-card profile-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3>My Profile</h3>
        </div>
        <p>Manage your personal information and settings</p>
        <router-link to="/resident/profile" class="card-action">
          View Profile <span>→</span>
        </router-link>
      </div>

      <!-- Request Documents Card -->
      <div class="dashboard-card documents-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3>Request Documents</h3>
        </div>
        <p>Request barangay certificates and official documents</p>
        <router-link to="/resident/request" class="card-action">
          Make Request <span>→</span>
        </router-link>
      </div>

      <!-- My Requests Card -->
      <div class="dashboard-card requests-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>My Requests</h3>
        </div>
        <p>Track the status of your submitted requests</p>
        <a href="#" class="card-action" @click.prevent="openRequestModal">
          View Requests <span>→</span>
        </a>
      </div>
    </div>

    <!-- Resident-Specific Announcements Section -->
    <div class="section-title">
      <h2>Latest Announcements for You</h2>
      <div class="title-decoration"></div>
    </div>
    
    <div class="announcements-grid">
      <div v-for="announcement in filteredResidentSpecificAnnouncements" :key="announcement.id" class="announcement-card">
        <div class="announcement-badge" :class="announcement.type.toLowerCase()">
          {{ announcement.type }}
        </div>
        <h3>{{ announcement.title }}</h3>
        <p>{{ announcement.content }}</p>
        <div class="announcement-footer">
          <span class="date">{{ formatAnnouncementDate(announcement.createdAt) }}</span>
          <a href="#" class="read-more" @click.prevent="openAnnouncementModal(announcement)">Read more</a>
        </div>
      </div>
    </div>

    <!-- Empty State (if no resident-specific announcements) -->
    <div v-if="filteredResidentSpecificAnnouncements.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <circle cx="10" cy="16" r="2"></circle>
        <polyline points="10 10 10 12 16 12 16 10"></polyline>
        <line x1="16" y1="6" x2="16" y2="8"></line>
        <line x1="8" y1="6" x2="8" y2="8"></line>
      </svg>
      <h3>No announcements for you yet</h3>
      <p>Check back later for personalized updates from your barangay</p>
    </div>

    <!-- Request Status Modal -->
    <div v-if="showRequestModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Request Status</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <!-- Search Form -->
          <div class="form-group">
            <label for="requestId">Enter Request ID</label>
            <input 
              type="text" 
              id="requestId" 
              v-model="requestIdInput" 
              placeholder="e.g. BRGY-000000-0000"
              @keyup.enter="checkRequestStatus"
            >
          </div>

          <!-- Request Details -->
          <div v-if="requestDetails" class="status-result">
            <!-- Status Message -->
            <div class="status-message-container" :class="requestDetails.status">
              <div>
                <h4 class="status-title">
                  <span v-if="requestDetails.status === 'approved'">Ready for Pickup</span>
                  <span v-else-if="requestDetails.status === 'pending'">Processing Request</span>
                  <span v-else-if="requestDetails.status === 'rejected'">Request Rejected</span>
                </h4>
                <p class="status-message">
                  <span v-if="requestDetails.status === 'approved'">
                    Your document is ready for pickup at the barangay hall. Please bring a valid ID.
                  </span>
                  <span v-else-if="requestDetails.status === 'pending'">
                    Your request is being processed. Typically takes 2-3 business days.
                  </span>
                  <span v-else-if="requestDetails.status === 'rejected'">
                    Your request was not approved. Contact the barangay office for details.
                  </span>
                </p>
              </div>
            </div>

            <!-- Pickup Instructions (if approved) -->
            <div v-if="requestDetails.status === 'approved'" class="pickup-instructions">
              <h5>Pickup Instructions:</h5>
              <ul>
                <li>Bring a valid government-issued ID</li>
                <li>Office hours: 8:00 AM - 5:00 PM (Monday to Friday)</li>
                <li>Location: Barangay Hall Main Office</li>
                <li>Contact: (02) 123-4567 if you have questions</li>
              </ul>
            </div>
          </div>
          
          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Close</button>
          <button class="btn-primary" @click="checkRequestStatus">
            {{ requestDetails ? 'Check Another' : 'Check Status' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Announcement Details Modal -->
    <div v-if="showAnnouncementModal" class="modal-overlay" @click.self="closeAnnouncementModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Announcement Details</h3>
          <button class="modal-close" @click="closeAnnouncementModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedAnnouncement" class="announcement-details">
            <div class="announcement-badge" :class="selectedAnnouncement.type.toLowerCase()">
              {{ selectedAnnouncement.type }}
            </div>
            <h4 class="announcement-title">{{ selectedAnnouncement.title }}</h4>
            <p class="announcement-content">{{ selectedAnnouncement.content }}</p>
            <p class="announcement-date">Posted on: {{ formatAnnouncementDate(selectedAnnouncement.createdAt) }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeAnnouncementModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default {
  name: 'ResidentDashboard',
  data() {
    return {
      currentDate: new Date(),
      announcements: [],
      timeInterval: null,
      showRequestModal: false,
      requestIdInput: '',
      requestDetails: null,
      errorMessage: '',
      userRequests: [],
      userProfile: null,
      loadingAnnouncements: false,
      showAnnouncementModal: false,
      selectedAnnouncement: null
    };
  },
  computed: {
    formattedDate() {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return this.currentDate.toLocaleDateString('en-US', options);
    },
    formattedTime() {
      const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      return this.currentDate.toLocaleTimeString('en-US', options);
    },
    userDisplayName() {
      return this.userProfile?.name || this.$store.state.auth.user?.displayName || 'User';
    },
    currentUserId() {
      return this.$store.state.auth.user?.uid || '';
    },
    filteredResidentSpecificAnnouncements() {
      return this.announcements
        .filter(a => {
          // Only include announcements specifically targeted to this resident via recipientIds
          return a.recipientIds?.length && a.recipientIds.includes(this.currentUserId);
        })
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const dateB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return dateB - dateA;
        });
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    formatAnnouncementDate(date) {
      if (!date) return '';
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatRequestDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate();
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    },
    formatDocumentType(type) {
      if (!type) return 'N/A';
      return type.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    async fetchUserProfile() {
      try {
        const user = this.$store.state.auth.user;
        if (!user?.uid) return;
        
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          this.userProfile = docSnap.data();
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    async fetchUserRequests() {
      try {
        const user = this.$store.state.auth.user;
        if (!user?.uid) return;
        
        const requestsRef = collection(db, 'requests');
        const q = query(requestsRef, where('userId', '==', this.currentUserId));
        const querySnapshot = await getDocs(q);
        
        this.userRequests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error fetching user requests:", error);
        this.errorMessage = 'Failed to load your requests. Please try again later.';
      }
    },
    async fetchAnnouncements() {
      this.loadingAnnouncements = true;
      try {
        const snapshot = await getDocs(collection(db, 'announcements'));
        this.announcements = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: doc.data().type || 'General'
        }));
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        this.errorMessage = 'Failed to load announcements. Please try again.';
      } finally {
        this.loadingAnnouncements = false;
      }
    },
    startDateTimeUpdate() {
      this.currentDate = new Date();
      this.timeInterval = setInterval(() => {
        this.currentDate = new Date();
      }, 60000);
    },
    openRequestModal() {
      this.showRequestModal = true;
      this.requestIdInput = '';
      this.requestDetails = null;
      this.errorMessage = '';
    },
    closeModal() {
      this.showRequestModal = false;
    },
    async checkRequestStatus() {
      if (!this.requestIdInput.trim()) {
        this.errorMessage = 'Please enter a request ID';
        return;
      }
      
      try {
        const foundRequest = this.userRequests.find(
          request => request.id === this.requestIdInput.trim()
        );
        
        if (foundRequest) {
          this.requestDetails = foundRequest;
          this.errorMessage = '';
          return;
        }

        const requestRef = doc(db, 'requests', this.requestIdInput.trim());
        const requestDoc = await getDoc(requestRef);
        
        if (!requestDoc.exists()) {
          this.requestDetails = null;
          this.errorMessage = 'Request ID not found. Please check and try again.';
          return;
        }

        const requestData = requestDoc.data();
        const user = this.$store.state.user;
        if (requestData.userId !== user.uid) {
          this.requestDetails = null;
          this.errorMessage = 'Request ID not found in your records.';
          return;
        }

        this.requestDetails = {
          id: requestDoc.id,
          ...requestData
        };
        this.errorMessage = '';
      } catch (error) {
        console.error("Error checking request status:", error);
        this.requestDetails = null;
        this.errorMessage = 'An error occurred while checking the request status. Please try again.';
      }
    },
    openAnnouncementModal(announcement) {
      this.selectedAnnouncement = announcement;
      this.showAnnouncementModal = true;
    },
    closeAnnouncementModal() {
      this.showAnnouncementModal = false;
      this.selectedAnnouncement = null;
    }
  },
  async mounted() {
    await this.fetchUserProfile();
    await this.fetchUserRequests();
    await this.fetchAnnouncements();
    this.startDateTimeUpdate();
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
</script>

<style scoped>
/* Base Styles */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Styles */
.dashboard-header {
  margin-bottom: 3rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.greeting {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a202c;
  line-height: 1.2;
}

.text-gradient {
  background: linear-gradient(90deg, #4f46e5, #10b981);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtext {
  color: #4a5568;
  font-size: 1.125rem;
  max-width: 600px;
}

.date-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.date-card {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: right;
}

.date-card .day {
  font-size: 1rem;
  color: #4a5568;
  font-weight: 500;
  display: block;
}

.date-card .time {
  font-size: 1.25rem;
  color: #2d3748;
  font-weight: 600;
}

/* Section Titles */
.section-title {
  position: relative;
  margin: 3rem 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-title h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.title-decoration {
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(90deg, #e2e8f0, transparent);
}

.view-all {
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.view-all:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-card .card-icon {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.documents-card .card-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.requests-card .card-icon {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.dashboard-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1a202c;
}

.dashboard-card p {
  color: #4a5568;
  margin-bottom: 1.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
}

.card-action {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  color: #4f46e5;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.card-action span {
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
}

.card-action:hover {
  color: #4338ca;
}

.card-action:hover span {
  transform: translateX(3px);
}

/* Announcements Grid */
.announcements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.announcement-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.announcement-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e0;
}

.announcement-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.35rem 1rem;
  border-bottom-left-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.announcement-badge.event {
  background-color: #8b5cf6;
}

.announcement-badge.policy {
  background-color: #4f46e5;
}

.announcement-badge.service {
  background-color: #10b981;
}

.announcement-badge.general {
  background-color: #6b7280;
}

.announcement-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1a202c;
  padding-right: 2rem;
}

.announcement-card p {
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.announcement-footer .date {
  color: #718096;
}

.read-more {
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.read-more:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px dashed #cbd5e0;
  margin: 2rem 0;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #a0aec0;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
  max-width: 400px;
  margin: 0 auto;
}

/* Modal Styles (Shared) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a202c;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.2rem 0.5rem;
}

.modal-close:hover {
  color: #4a5568;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Request Status Modal Specific */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.status-result {
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.status-message-container {
  padding: 1.25rem;
}

.status-message-container.approved {
  background-color: #f0fdf4;
}

.status-message-container.pending {
  background-color: #fffbeb;
}

.status-message-container.rejected {
  background-color: #fef2f2;
}

.status-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #1a202c;
  font-weight: 600;
}

.status-message {
  margin: 0;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
}

.pickup-instructions {
  padding: 1rem 1.25rem;
  background-color: white;
  border-top: 1px solid #e2e8f0;
}

.pickup-instructions h5 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #2d3748;
  font-weight: 500;
}

.pickup-instructions ul {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.85rem;
  color: #4a5568;
}

.pickup-instructions li {
  margin-bottom: 0.25rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e53e3e;
  margin: 1rem 0 0;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 8px;
}

.error-message svg {
  flex-shrink: 0;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary {
  background-color: white;
  color: #4a5568;
  border: 1px solid #cbd5e0;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f7fafc;
  border-color: #a0aec0;
}

/* Announcement Modal Specific Styles */
.announcement-details {
  position: relative;
  padding-top: 1rem;
}

.announcement-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #1a202c;
  font-weight: 600;
}

.announcement-content {
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
}

.announcement-date {
  margin: 0;
  font-size: 0.9rem;
  color: #718096;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  
  .date-display {
    align-items: flex-start;
  }
  
  .date-card {
    text-align: left;
  }
  
  .greeting {
    font-size: 1.75rem;
  }
  
  .card-grid,
  .announcements-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 1.5rem 1rem;
  }
  
  .greeting {
    font-size: 1.5rem;
  }
  
  .subtext {
    font-size: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>