<template>
  <div class="sk-members-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">
          SK Members
        </h1>
        <p>Manage your Sangguniang Kabataan members and officials</p>
      </div>
      <button class="add-member-btn" @click.stop="showAddMemberModal" aria-label="Add new member">
        <i class="fas fa-plus"></i>
        <span>Add Member</span>
      </button>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          class="search-input"
          placeholder="Search members..."
          v-model="searchQuery"
          aria-label="Search members"
        >
      </div>
      
      <div class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click.stop="activeFilter = filter.value"
          :class="['filter-tab', { 'active': activeFilter === filter.value }]"
          :aria-pressed="activeFilter === filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Members Table -->
    <div class="members-table-container">
      <div class="table-responsive">
        <table class="members-table">
          <thead>
            <tr>
              <th class="member-column">Member</th>
              <th class="position-column">Position</th>
              <th class="contact-column">Contact</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredMembers" :key="member.id" class="member-row">
              <td class="member-cell">
                <div class="member-info">
                  <div class="member-details">
                    <h3 class="member-name">{{ member.name }}</h3>
                    <p class="member-age">{{ member.age }} years old</p>
                  </div>
                </div>
              </td>
              <td class="position-cell">
                <span class="position-badge" :class="positionBadgeClass(member.position)">
                  {{ member.position }}
                </span>
              </td>
              <td class="contact-cell">
                <div class="contact-info">
                  <p class="contact-item">
                    <i class="fas fa-phone-alt"></i>
                    {{ member.contact }}
                  </p>
                  <p class="contact-item" v-if="member.email">
                    <i class="fas fa-envelope"></i>
                    {{ member.email }}
                  </p>
                </div>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    class="action-btn edit-btn" 
                    @click.stop="editMember(member)"
                    title="Edit member"
                    aria-label="Edit member"
                  >
                    <i class="fas fa-pen"></i>
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click.stop="confirmDelete(member)"
                    title="Delete member"
                    aria-label="Delete member"
                    :disabled="isDeleting"
                  >
                    <i v-if="!isDeleting" class="fas fa-trash-alt"></i>
                    <span v-else class="spinner"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-if="filteredMembers.length === 0">
        <div class="empty-content">
          <i class="fas fa-user-friends empty-icon"></i>
          <h3>No members found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button class="empty-action-btn" @click="showAddMemberModal">
            Add New Member
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="modalVisible" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Member' : 'Add New Member' }}</h2>
            <button class="modal-close-btn" @click="closeModal" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitMember" class="member-form">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="currentMember.name" 
                  required 
                  aria-required="true"
                  placeholder="Enter full name"
                >
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Age</label>
                  <input 
                    type="number" 
                    class="form-input" 
                    v-model="currentMember.age" 
                    required 
                    aria-required="true"
                    placeholder="Enter age"
                    min="15"
                    max="30"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Position</label>
                  <select 
                    class="form-select" 
                    v-model="currentMember.position" 
                    required 
                    aria-required="true"
                  >
                    <option value="" disabled>Select position</option>
                    <option value="Chairperson">Chairperson</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Councilor">Councilor</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Contact Number</label>
                  <input 
                    type="tel" 
                    class="form-input" 
                    v-model="currentMember.contact" 
                    required 
                    aria-required="true"
                    placeholder="Enter contact number"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Email <span class="optional">(Optional)</span></label>
                  <input 
                    type="email" 
                    class="form-input" 
                    v-model="currentMember.email" 
                    placeholder="Enter email address"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Status</label>
                <div class="status-options">
                  <label 
                    v-for="status in statusOptions" 
                    :key="status.value"
                    :class="['status-option', { 'active': currentMember.status === status.value }]"
                  >
                    <input 
                      type="radio" 
                      v-model="currentMember.status" 
                      :value="status.value"
                      class="status-radio"
                    >
                    <span class="status-label">{{ status.label }}</span>
                  </label>
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  type="button" 
                  class="cancel-btn" 
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="submit-btn" 
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="spinner"></span>
                  <span v-else>{{ isEditing ? 'Update Member' : 'Add Member' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="deleteModalVisible" @click.self="closeDeleteModal">
        <div class="delete-modal-content">
          <div class="modal-header">
            <h2 class="delete-title">
              <i class="fas fa-exclamation-circle warning-icon"></i>
              Confirm Deletion
            </h2>
            <button class="modal-close-btn" @click="closeDeleteModal" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p class="delete-message">
              Are you sure you want to delete <strong>{{ currentMember.name }}</strong> from the members list?
            </p>
            <p class="delete-warning">
              <i class="fas fa-info-circle"></i>
              This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" @click="closeDeleteModal">
              Cancel
            </button>
            <button 
              class="delete-confirm-btn" 
              @click.stop="deleteMember" 
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="spinner"></span>
              <span v-else>Delete Member</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default {
  setup() {
    const searchQuery = ref('');
    const activeFilter = ref('all');
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const isDeleting = ref(false);
    const modalVisible = ref(false);
    const deleteModalVisible = ref(false);
    
    const currentMember = ref({
      id: null,
      name: '',
      age: '',
      position: '',
      contact: '',
      email: '',
      status: 'Active',
      avatar: ''
    });

    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'Active' },
      { label: 'Officials', value: 'Officials' },
      { label: 'Inactive', value: 'Inactive' }
    ];

    const statusOptions = [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
      { label: 'On Leave', value: 'On Leave' }
    ];

    const members = ref([]);
    let unsubscribe = null;

    // Fetch members from Firestore in real-time
    onMounted(() => {
      const membersCollection = collection(db, 'sk_members');
      unsubscribe = onSnapshot(membersCollection, (snapshot) => {
        members.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          avatar: doc.data().avatar || generateRandomAvatar()
        }));
      }, (error) => {
        console.error('Error fetching members:', error);
        // Show error toast in a real app
      });
    });

    // Clean up listener on component unmount
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    function generateRandomAvatar() {
      const gender = Math.random() > 0.5 ? 'men' : 'women';
      const id = Math.floor(Math.random() * 50);
      return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
    }

    const filteredMembers = computed(() => {
      let filtered = members.value;
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(member => 
          member.name?.toLowerCase().includes(query) || 
          member.position?.toLowerCase().includes(query) ||
          member.contact?.includes(query) ||
          member.email?.toLowerCase().includes(query)
        );
      }
      
      if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'Officials') {
          filtered = filtered.filter(member => 
            member.position !== 'Member'
          );
        } else {
          filtered = filtered.filter(member => 
            member.status === activeFilter.value
          );
        }
      }
      
      return filtered;
    });

    const positionBadgeClass = (position) => {
      const classes = {
        'Chairperson': 'chairperson-badge',
        'Secretary': 'secretary-badge',
        'Treasurer': 'treasurer-badge',
        'Councilor': 'councilor-badge',
        'Member': 'member-badge'
      };
      return classes[position] || 'default-badge';
    };

    const statusBadgeClass = (status) => {
      const classes = {
        'Active': 'active-badge',
        'Inactive': 'inactive-badge',
        'On Leave': 'on-leave-badge'
      };
      return classes[status] || 'default-badge';
    };

    const showAddMemberModal = () => {
      isEditing.value = false;
      currentMember.value = {
        id: null,
        name: '',
        age: '',
        position: '',
        contact: '',
        email: '',
        status: 'Active',
        avatar: generateRandomAvatar()
      };
      modalVisible.value = true;
    };

    const editMember = (member) => {
      isEditing.value = true;
      currentMember.value = { ...member };
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
    };

    const submitMember = async () => {
      isSubmitting.value = true;
      try {
        const memberData = {
          name: currentMember.value.name,
          age: parseInt(currentMember.value.age),
          position: currentMember.value.position,
          contact: currentMember.value.contact,
          email: currentMember.value.email || '',
          status: currentMember.value.status,
          avatar: currentMember.value.avatar
        };

        if (isEditing.value) {
          const memberRef = doc(db, 'sk_members', currentMember.value.id);
          await updateDoc(memberRef, memberData);
        } else {
          await addDoc(collection(db, 'sk_members'), memberData);
        }
        modalVisible.value = false;
      } catch (error) {
        console.error('Error submitting member:', error);
        // Show error toast in a real app
      } finally {
        isSubmitting.value = false;
      }
    };

    const confirmDelete = (member) => {
      currentMember.value = { ...member };
      deleteModalVisible.value = true;
    };

    const closeDeleteModal = () => {
      deleteModalVisible.value = false;
    };

    const deleteMember = async () => {
      isDeleting.value = true;
      try {
        const memberRef = doc(db, 'sk_members', currentMember.value.id);
        await deleteDoc(memberRef);
        deleteModalVisible.value = false;
      } catch (error) {
        console.error('Error deleting member:', error);
        // Show error toast in a real app
      } finally {
        isDeleting.value = false;
      }
    };

    return {
      searchQuery,
      activeFilter,
      filters,
      statusOptions,
      filteredMembers,
      currentMember,
      isEditing,
      isSubmitting,
      isDeleting,
      modalVisible,
      deleteModalVisible,
      positionBadgeClass,
      statusBadgeClass,
      showAddMemberModal,
      editMember,
      closeModal,
      submitMember,
      confirmDelete,
      closeDeleteModal,
      deleteMember
    };
  }
};
</script>

<style scoped>
/* Base Styles */
.sk-members-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #333;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #28a745, #218838);
  border-radius: 50%;
  margin-right: 1rem;
  color: white;
}

.page-description {
  color: #6c757d;
  font-size: 1rem;
  margin-left: 3.5rem;
}

.add-member-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-member-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.add-member-btn:active {
  transform: translateY(0);
}

.add-member-btn i {
  margin-right: 0.5rem;
}

/* Controls Section */
.controls-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-container {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #28a745;
  color: #28a745;
}

.filter-tab.active {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

/* Members Table */
.members-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
}

.members-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #6c757d;
  background: #f8f9fa;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.members-table td {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.member-cell {
  min-width: 250px;
}

.member-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.member-details {
  flex: 1;
}

.member-name {
  font-weight: 600;
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.member-age {
  margin: 0;
  font-size: 0.85rem;
  color: #6c757d;
}

.position-cell, .status-cell {
  white-space: nowrap;
}

.position-badge, .status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.chairperson-badge {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.secretary-badge {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.treasurer-badge {
  background-color: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
}

.councilor-badge {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.member-badge {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.active-badge {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.inactive-badge {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.on-leave-badge {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.contact-info {
  font-size: 0.9rem;
}

.contact-item {
  margin: 0.25rem 0;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.contact-item i {
  margin-right: 0.5rem;
  width: 1rem;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.edit-btn:hover {
  background-color: rgba(13, 110, 253, 0.2);
}

.delete-btn {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 3rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #adb5bd;
  margin-bottom: 1.5rem;
}

.empty-action-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modal Styles */
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
}

.modal-content, .delete-modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modal-enter 0.3s ease-out;
}

.delete-modal-content {
  max-width: 500px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.delete-title {
  display: flex;
  align-items: center;
  color: #dc3545;
}

.warning-icon {
  margin-right: 0.75rem;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #dc3545;
}

.modal-body {
  padding: 1.5rem;
}

.delete-message {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.delete-warning {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.delete-warning i {
  margin-right: 0.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Form Styles */
.member-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  margin-bottom: 0;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.optional {
  color: #6c757d;
  font-weight: normal;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
}

.status-options {
  display: flex;
  gap: 0.75rem;
}

.status-option {
  flex: 1;
  position: relative;
}

.status-radio {
  position: absolute;
  opacity: 0;
}

.status-label {
  display: block;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.status-option.active .status-label {
  border-color: #28a745;
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #28a745, #218838);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.delete-confirm-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #dc3545, #c82333);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.delete-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.delete-confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Spinner */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .controls-section {
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .status-options {
    flex-direction: column;
  }
  
  .members-table th, 
  .members-table td {
    padding: 0.75rem;
  }
  
  .member-cell {
    min-width: auto;
  }
  
  .action-buttons {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .sk-members-container {
    padding: 1rem;
  }
  
  .modal-content, .delete-modal-content {
    margin: 0 1rem;
    max-height: 80vh;
  }
}
</style>