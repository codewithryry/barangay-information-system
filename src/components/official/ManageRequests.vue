<template>
  <div class="manage-requests">
    <div class="header">
      <h2><i class=""></i> Document Requests</h2>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading requests...
    </div>

    <div v-else class="stats-cards">
      <div class="stat-card" @click="filterByStatus('pending')" :class="{ active: currentFilter === 'pending' }">
        <div class="stat-value">{{ stats.pendingRequests }}</div>
        <div class="stat-label">Pending</div>
        <div class="stat-icon"><i class="fas fa-clock"></i></div>
      </div>
      <div class="stat-card" @click="filterByStatus('approved')" :class="{ active: currentFilter === 'approved' }">
        <div class="stat-value">{{ stats.approvedRequests }}</div>
        <div class="stat-label">Approved</div>
        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
      </div>
      <div class="stat-card" @click="filterByStatus('rejected')" :class="{ active: currentFilter === 'rejected' }">
        <div class="stat-value">{{ stats.rejectedRequests }}</div>
        <div class="stat-label">Rejected</div>
        <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
      </div>
      <div class="stat-card" @click="filterByStatus('all')" :class="{ active: currentFilter === 'all' }">
        <div class="stat-value">{{ stats.totalRequests }}</div>
        <div class="stat-label">Total</div>
        <div class="stat-icon"><i class="fas fa-file"></i></div>
      </div>
    </div>

    <div v-if="!isLoading" class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by resident name..."
          @input="searchRequests"
        >
        <i class="fas fa-search"></i>
      </div>
      <select v-model="documentTypeFilter" @change="filterRequests" class="form-select">
        <option value="">All Document Types</option>
        <option v-for="type in documentTypes" :value="type.value" :key="type.value">{{ type.label }}</option>
      </select>
    </div>

    <div v-if="!isLoading && filteredRequests.length > 0" class="requests-table">
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Document Type</th>
            <th>Date Requested</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request.id">
            <td>{{ request.id || request.documentId || 'N/A' }}</td>
            <td>{{ getDocumentTypeLabel(request.type || request.documentType) }}</td>
            <td>{{ formatDate(request.createdAt) }}</td>
            <td>{{ request.purpose || 'N/A' }}</td>
            <td>
              <span :class="`status-badge ${request.status}`">
                <i :class="statusIcons[request.status]"></i>
                {{ request.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" @click="viewRequest(request)">
                  <i class="fas fa-eye"></i>
                  <span class="btn-text">View</span>
                </button>
                <div class="approval-actions" v-if="request.status === 'pending'">
                  <button
                    class="action-btn approve"
                    @click="updateRequestStatus(request.id, 'approved')"
                    :disabled="isUpdating"
                  >
                    <i class="fas fa-check"></i>
                    <span class="btn-text">Approve</span>
                  </button>
                  <button
                    class="action-btn reject"
                    @click="updateRequestStatus(request.id, 'rejected')"
                    :disabled="isUpdating"
                  >
                    <i class="fas fa-times"></i>
                    <span class="btn-text">Reject</span>
                  </button>
                </div>
                <div class="status-indicator" v-else>
                  <span class="status-text">Action taken</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="empty-state">
      <i class="fas fa-inbox"></i>
      <p>No document requests found</p>
      <p class="subtext" v-if="currentFilter !== 'all' || searchQuery || documentTypeFilter">Try changing your filters</p>
    </div>

    <!-- Request Details Modal -->
    <div class="modal" :class="{ show: selectedRequest !== null }" v-if="selectedRequest">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Request Details</h3>
          <button class="close-btn" @click="closeModal" :disabled="isUpdating">×</button>
        </div>
        <div class="modal-body">
          <div v-if="modalError" class="error-message">
            <p>{{ modalError }}</p>
          </div>
          <div class="detail-row">
            <label>Request ID:</label>
            <div>{{ selectedRequest.id || selectedRequest.documentId || 'N/A' }}</div>
          </div>
          <div class="detail-row">
            <label>Resident:</label>
            <div>{{ selectedRequest.userName }}</div>
          </div>
          <div class="detail-row">
            <label>Contact:</label>
            <div>{{ selectedRequest.contact || 'N/A' }}</div>
          </div>
          <div class="detail-row">
            <label>Document Type:</label>
            <div>{{ getDocumentTypeLabel(selectedRequest.type || selectedRequest.documentType) }}</div>
          </div>
          <div class="detail-row">
            <label>Purpose:</label>
            <div>{{ selectedRequest.purpose || 'N/A' }}</div>
          </div>
          <div class="detail-row">
            <label>Date Requested:</label>
            <div>{{ formatDate(selectedRequest.createdAt) }}</div>
          </div>
          <div class="detail-row">
            <label>Status:</label>
            <div>
              <span :class="`status-badge ${selectedRequest.status}`">
                <i :class="statusIcons[selectedRequest.status]"></i>
                {{ selectedRequest.status }}
              </span>
            </div>
          </div>
          <div class="detail-row" v-if="selectedRequest.notes">
            <label>Notes:</label>
            <div>{{ selectedRequest.notes }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="action-btn approve"
            @click="updateRequestStatus(selectedRequest.id, 'approved')"
            v-if="selectedRequest.status === 'pending'"
            :disabled="isUpdating"
          >
            <i class="fas fa-check"></i> Approve
          </button>
          <button
            class="action-btn reject"
            @click="updateRequestStatus(selectedRequest.id, 'rejected')"
            v-if="selectedRequest.status === 'pending'"
            :disabled="isUpdating"
          >
            <i class="fas fa-times"></i> Reject
          </button>
          <button class="action-btn close" @click="closeModal" :disabled="isUpdating">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" :class="{ show: showToast, error: isToastError }">
      <div class="toast-content">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { format } from 'date-fns';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  getDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase/config';

export default {
  setup() {
    const requests = ref([]);
    const users = ref({});
    const stats = ref({
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      totalRequests: 0,
    });
    const isLoading = ref(true);
    const isUpdating = ref(false);
    const error = ref(null);
    const modalError = ref(null);
    const searchQuery = ref('');
    const documentTypeFilter = ref('');
    const currentFilter = ref('all');
    const selectedRequest = ref(null);
    
    // Toast notification
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastIcon = ref('');
    const isToastError = ref(false);
    
    const documentTypes = ref([
      { value: 'business-permit', label: 'Business Permit' },
      { value: 'barangay-clearance', label: 'Barangay Clearance' },
      { value: 'barangay-id', label: 'Barangay ID' },
      { value: 'residency-certificate', label: 'Certificate of Residency' },
      { value: 'indigency-certificate', label: 'Certificate of Indigency' },
      { value: 'other', label: 'Other' }
    ]);

    const statusIcons = {
      pending: 'fas fa-clock',
      approved: 'fas fa-check-circle',
      rejected: 'fas fa-times-circle',
    };

    let unsubscribe = null;
    const auth = getAuth();
    const user = ref(null);

    const getDocumentTypeLabel = (typeValue) => {
      const type = documentTypes.value.find(t => t.value === typeValue);
      return type ? type.label : typeValue;
    };

    const fetchUserData = async (userId) => {
      try {
        if (!userId) return null;
        if (users.value[userId]) return users.value[userId];
        
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          users.value[userId] = userDoc.data();
          return users.value[userId];
        }
        return null;
      } catch (err) {
        console.error('Error fetching user data:', err);
        return null;
      }
    };

    const fetchAllUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          users.value[doc.id] = doc.data();
        });
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const fetchRequests = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        await fetchAllUsers();

        const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc')); // Use 'requests' collection
        unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const requestsData = [];
            
            for (const doc of snapshot.docs) {
              const requestData = doc.data();
              const userId = requestData.userId;
              const userData = await fetchUserData(userId);
              
              requestsData.push({
                id: doc.id, // Firestore document ID
                documentId: requestData.id || doc.id, // Custom ID (e.g., BRGY-250601-7793)
                ...requestData,
                userName: requestData.userName || userData?.displayName || 'Unknown Resident',
                contact: userData?.contact || 'N/A',
                email: userData?.email || 'N/A',
                createdAt: requestData.createdAt?.toDate?.() || null,
                updatedAt: requestData.updatedAt?.toDate?.() || null
              });
            }

            requests.value = requestsData;
            
            stats.value = {
              pendingRequests: requests.value.filter((r) => r.status === 'pending').length,
              approvedRequests: requests.value.filter((r) => r.status === 'approved').length,
              rejectedRequests: requests.value.filter((r) => r.status === 'rejected').length,
              totalRequests: requests.value.length,
            };

            isLoading.value = false;
          },
          (err) => {
            console.error('Error fetching requests:', err);
            error.value = 'Failed to load requests. Please try again later.';
            isLoading.value = false;
          }
        );
      } catch (err) {
        console.error('Error setting up listener:', err);
        error.value = 'Failed to initialize request listener.';
        isLoading.value = false;
      }
    };

    const updateRequestStatus = async (requestId, status) => {
      if (!user.value) {
        showToastNotification(
          'You must be logged in to perform this action.',
          'fas fa-exclamation-circle',
          true
        );
        return;
      }
      
      try {
        isUpdating.value = true;
        
        // Query the 'requests' collection to find the document with the custom 'id' field
        const q = query(collection(db, 'requests'), where('id', '==', requestId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error(`Document with custom ID ${requestId} not found in Firestore`);
        }
        
        // Get the first matching document's Firestore ID
        const documentId = querySnapshot.docs[0].id;
        const requestRef = doc(db, 'requests', documentId);
        
        // Verify the document exists
        const docSnapshot = await getDoc(requestRef);
        if (!docSnapshot.exists()) {
          throw new Error(`Document with Firestore ID ${documentId} not found`);
        }
        
        // Update the document
        await updateDoc(requestRef, {
          status: status,
          updatedAt: new Date(),
          updatedBy: user.value.uid,
        });

        showToastNotification(
          status === 'approved' ? 'Request approved!' : 'Request rejected!',
          status === 'approved' ? 'fas fa-check-circle' : 'fas fa-times-circle'
        );

        // Update the selected request in the modal if open
        if (selectedRequest.value && 
            (selectedRequest.value.documentId === requestId || 
             selectedRequest.value.id === documentId)) {
          selectedRequest.value.status = status;
        }
      } catch (err) {
        console.error('Error updating request status:', err);
        showToastNotification(
          `Failed to update request status: ${err.message}`,
          'fas fa-exclamation-circle',
          true
        );
      } finally {
        isUpdating.value = false;
      }
    };

    const showToastNotification = (message, icon, isError = false) => {
      toastMessage.value = message;
      toastIcon.value = icon;
      isToastError.value = isError;
      showToast.value = true;
      
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    const viewRequest = (request) => {
      selectedRequest.value = request;
      modalError.value = null;
    };

    const closeModal = () => {
      selectedRequest.value = null;
      modalError.value = null;
    };

    const filterByStatus = (status) => {
      currentFilter.value = status;
    };

    const filterRequests = () => {
      // Handled by computed property
    };

    const searchRequests = () => {
      // Handled by computed property
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      try {
        return format(timestamp.toDate ? timestamp.toDate() : timestamp, 'MMM dd, yyyy hh:mm a');
      } catch {
        return 'Invalid Date';
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          user.value = currentUser;
          fetchRequests();
        } else {
          error.value = 'Please log in to access document requests.';
          isLoading.value = false;
        }
      });
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    const filteredRequests = computed(() => {
      let filtered = requests.value;

      // Filter by status
      if (currentFilter.value !== 'all') {
        filtered = filtered.filter((r) => r.status === currentFilter.value);
      }

      // Filter by document type
      if (documentTypeFilter.value) {
        filtered = filtered.filter((r) => 
          (r.type === documentTypeFilter.value) || 
          (r.documentType === documentTypeFilter.value)
        );
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (r) => 
            (r.userName && r.userName.toLowerCase().includes(query)) ||
            (r.contact && r.contact.toLowerCase().includes(query)) ||
            (r.id && r.id.toLowerCase().includes(query)) ||
            (r.documentId && r.documentId.toLowerCase().includes(query))
        );
      }

      return filtered;
    });

    return {
      requests,
      users,
      filteredRequests,
      stats,
      isLoading,
      isUpdating,
      error,
      modalError,
      searchQuery,
      documentTypeFilter,
      currentFilter,
      selectedRequest,
      documentTypes,
      statusIcons,
      showToast,
      toastMessage,
      toastIcon,
      isToastError,
      updateRequestStatus,
      viewRequest,
      closeModal,
      filterByStatus,
      filterRequests,
      searchRequests,
      formatDate,
      getDocumentTypeLabel
    };
  },
};
</script>

<style scoped>
.manage-requests {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  margin-bottom: 2rem;
}

.header h2 {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 2rem 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-card.active {
  border: 2px solid #3498db;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.2;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #3498db;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.form-select {
  width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;
}

.form-select:focus {
  outline: none;
  border-color: #3498db;
}

.requests-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  position: sticky;
  top: 0;
}

.resident-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.name {
  font-weight: 500;
}

.contact {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.approval-actions {
  display: flex;
  gap: 0.5rem;
}

.status-indicator {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-btn i {
  font-size: 0.9rem;
}

.action-btn .btn-text {
  display: inline-block;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn.view {
  background: #e2e3e5;
  color: #383d41;
}

.action-btn.view:hover:not(:disabled) {
  background: #d6d8db;
}

.action-btn.approve {
  background: #28a745;
  color: white;
}

.action-btn.approve:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.action-btn.reject {
  background: #dc3545;
  color: white;
}

.action-btn.reject:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.action-btn.close {
  background: #6c757d;
  color: white;
}

.action-btn.close:hover:not(:disabled) {
  background: #5a6268;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-state i {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.empty-state .subtext {
  font-size: 0.9rem;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.modal.show {
  opacity: 1;
  pointer-events: all;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-20px);
  transition: transform 0.3s;
}

.modal.show .modal-content {
  transform: translateY(0);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
}

.close-btn:hover:not(:disabled) {
  color: #2c3e50;
}

.close-btn:disabled {
  cursor: not-allowed;
}

.modal-body {
  padding: 1.5rem;
}

.detail-row {
  margin-bottom: 1rem;
}

.detail-row label {
  display: block;
  font-weight: 500;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.detail-row div {
  font-size: 1.1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1100;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast.error {
  background: #dc3545;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .form-select {
    width: 100%;
  }

  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }

  .approval-actions {
    margin-top: 0.5rem;
  }

  .modal-content {
    width: 95%;
    margin: 0 auto;
  }
}
</style>