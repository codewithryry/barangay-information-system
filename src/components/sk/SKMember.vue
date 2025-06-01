<template>
  <div class="sk-members container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-success mb-2">
          <i class=" me-2"></i>SK Members
        </h2>
        <p class="text-muted">Manage your Sangguniang Kabataan members and officials</p>
      </div>
      <button class="btn btn-success" @click.stop="showAddMemberModal" aria-label="Add new member">
        <i class="fas fa-plus-circle me-1"></i> Add Member
      </button>
    </div>

    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="fas fa-search"></i>
          </span>
          <input
            type="text"
            class="form-control border-start-0"
            placeholder="Search members..."
            v-model="searchQuery"
            aria-label="Search members"
          >
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <div class="btn-group" role="group" aria-label="Filter members">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click.stop="activeFilter = filter.value"
              :class="['btn', activeFilter === filter.value ? 'btn-success' : 'btn-outline-secondary']"
              :aria-pressed="activeFilter === filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">Member</th>
              <th scope="col">Position</th>
              <th scope="col">Contact</th>
              <th scope="col">Status</th>
              <th scope="col" class="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredMembers" :key="member.id">
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <div class="member-avatar me-3">
                    <img :src="member.avatar" :alt="member.name" class="rounded-circle">
                  </div>
                  <div>
                    <h6 class="mb-0">{{ member.name }}</h6>
                    <small class="text-muted">{{ member.age }} years old</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="positionBadgeClass(member.position)">
                  {{ member.position }}
                </span>
              </td>
              <td>
                <small class="text-muted">
                  <i class="fas fa-phone-alt me-1"></i> {{ member.contact }}<br>
                  <i class="fas fa-envelope me-1"></i> {{ member.email }}
                </small>
              </td>
              <td>
                <span class="badge" :class="statusBadgeClass(member.status)">
                  {{ member.status }}
                </span>
              </td>
              <td class="text-end pe-4">
                <div class="btn-group" role="group" aria-label="Member actions">
                  <button 
                    class="btn btn-sm btn-outline-success" 
                    @click.stop="viewMember(member)"
                    title="View member details"
                    aria-label="View member details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click.stop="editMember(member)"
                    title="Edit member"
                    aria-label="Edit member"
                  >
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click.stop="confirmDelete(member)"
                    title="Delete member"
                    aria-label="Delete member"
                    :disabled="isDeleting"
                  >
                    <i v-if="!isDeleting" class="fas fa-trash"></i>
                    <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4" v-if="filteredMembers.length === 0">
      <div class="text-center py-5">
        <i class="fas fa-users text-muted" style="font-size: 3rem;"></i>
        <h5 class="mt-3">No members found</h5>
        <p class="text-muted">Try adjusting your search or filter criteria</p>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <div class="modal fade" id="memberModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Member' : 'Add New Member' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitMember">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" v-model="currentMember.name" required aria-required="true">
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Age</label>
                  <input type="number" class="form-control" v-model="currentMember.age" required aria-required="true">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Position</label>
                  <select class="form-select" v-model="currentMember.position" required aria-required="true">
                    <option value="Chairperson">Chairperson</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Councilor">Councilor</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Contact Number</label>
                  <input type="tel" class="form-control" v-model="currentMember.contact" required aria-required="true">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="currentMember.email" aria-describedby="emailHelp">
                  <small id="emailHelp" class="form-text text-muted">Optional</small>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="currentMember.status" required aria-required="true">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-success" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  {{ isEditing ? 'Update' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Confirm Deletion</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ currentMember.name }}</strong> from the members list?</p>
            <p class="text-muted small">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click.stop="deleteMember" :disabled="isDeleting">
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const searchQuery = ref('');
    const activeFilter = ref('all');
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const isDeleting = ref(false);
    const currentMember = ref({
      id: null,
      name: '',
      age: '',
      position: 'Member',
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

    const members = ref([
      {
        id: 1,
        name: 'Juan Dela Cruz',
        age: 22,
        position: 'Chairperson',
        contact: '09123456789',
        email: 'juan.delacruz@example.com',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: 2,
        name: 'Maria Santos',
        age: 21,
        position: 'Secretary',
        contact: '09234567890',
        email: 'maria.santos@example.com',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        id: 3,
        name: 'Pedro Bautista',
        age: 20,
        position: 'Treasurer',
        contact: '09345678901',
        email: 'pedro.bautista@example.com',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      {
        id: 4,
        name: 'Ana Reyes',
        age: 19,
        position: 'Councilor',
        contact: '09456789012',
        email: 'ana.reyes@example.com',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        id: 5,
        name: 'Luis Garcia',
        age: 18,
        position: 'Member',
        contact: '09567890123',
        email: 'luis.garcia@example.com',
        status: 'Inactive',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
      }
    ]);

    let memberModal = null;
    let deleteModal = null;

    onMounted(() => {
      memberModal = new Modal(document.getElementById('memberModal'));
      deleteModal = new Modal(document.getElementById('deleteModal'));
    });

    const filteredMembers = computed(() => {
      let filtered = members.value;
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(member => 
          member.name.toLowerCase().includes(query) || 
          member.position.toLowerCase().includes(query) ||
          member.contact.includes(query) ||
          member.email.toLowerCase().includes(query)
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
        'Chairperson': 'bg-success bg-opacity-10 text-success',
        'Secretary': 'bg-primary bg-opacity-10 text-primary',
        'Treasurer': 'bg-info bg-opacity-10 text-info',
        'Councilor': 'bg-warning bg-opacity-10 text-warning',
        'Member': 'bg-secondary bg-opacity-10 text-secondary'
      };
      return classes[position] || 'bg-light text-dark';
    };

    const statusBadgeClass = (status) => {
      const classes = {
        'Active': 'bg-success bg-opacity-10 text-success',
        'Inactive': 'bg-danger bg-opacity-10 text-danger',
        'On Leave': 'bg-warning bg-opacity-10 text-warning'
      };
      return classes[status] || 'bg-light text-dark';
    };

    const showAddMemberModal = () => {
      isEditing.value = false;
      currentMember.value = {
        id: null,
        name: '',
        age: '',
        position: 'Member',
        contact: '',
        email: '',
        status: 'Active',
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`
      };
      memberModal.show();
    };

    const viewMember = (member) => {
      event?.stopPropagation();
      alert(`Viewing details for ${member.name}`);
    };

    const editMember = (member) => {
      event?.stopPropagation();
      isEditing.value = true;
      currentMember.value = { ...member };
      memberModal.show();
    };

    const submitMember = async () => {
      isSubmitting.value = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (isEditing.value) {
          const index = members.value.findIndex(m => m.id === currentMember.value.id);
          if (index !== -1) {
            members.value[index] = { ...currentMember.value };
          }
        } else {
          const newId = Math.max(...members.value.map(m => m.id)) + 1;
          members.value.push({
            ...currentMember.value,
            id: newId
          });
        }
        memberModal.hide();
      } catch (error) {
        console.error('Error submitting member:', error);
        alert('Failed to save member. Please try again.');
      } finally {
        isSubmitting.value = false;
      }
    };

    const confirmDelete = (member) => {
      event?.stopPropagation();
      currentMember.value = { ...member };
      deleteModal.show();
    };

    const deleteMember = async () => {
      isDeleting.value = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        members.value = members.value.filter(m => m.id !== currentMember.value.id);
        deleteModal.hide();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Failed to delete member. Please try again.');
      } finally {
        isDeleting.value = false;
      }
    };

    return {
      searchQuery,
      activeFilter,
      filters,
      filteredMembers,
      currentMember,
      isEditing,
      isSubmitting,
      isDeleting,
      positionBadgeClass,
      statusBadgeClass,
      showAddMemberModal,
      viewMember,
      editMember,
      submitMember,
      confirmDelete,
      deleteMember
    };
  }
};
</script>

<style scoped>
.sk-members {
  max-width: 1200px;
  margin: 0 auto;
}

.member-avatar {
  width: 40px;
  height: 40px;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  color: #6c757d;
}

.table-hover tbody tr:hover {
  background-color: rgba(40, 167, 69, 0.05);
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.35em 0.65em;
}

.modal-header {
  border-bottom: none;
  padding-bottom: 0;
}

.modal-footer {
  border-top: none;
}

.btn-group .btn {
  padding: 0.375rem 0.75rem;
  margin: 0 2px;
  transition: all 0.2s ease;
}

.btn-group .btn:hover {
  transform: translateY(-1px);
}

.btn-group .btn:active {
  transform: translateY(0);
}

.btn-group .btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline-success {
  border-color: #28a745;
  color: #28a745;
}

.btn-outline-success:hover {
  background-color: #28a745;
  color: white;
}

.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

@media (max-width: 767.98px) {
  .table-responsive {
    border: none;
  }
  
  .btn-group {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .btn-group .btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.875rem;
  }
}
</style>