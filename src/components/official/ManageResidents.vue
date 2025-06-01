<template>
  <div class="manage-residents container py-4">
    <h2 class="mb-4 fw-bold">Resident Management</h2>

    <!-- Search Bar -->
    <div class="search-bar mb-4">
      <div class="input-group shadow-sm" style="max-width: 400px;">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="form-control border-0 ps-3 py-2" 
          placeholder="Search residents..." 
          @keyup.enter="searchResidents"
          style="border-radius: 8px 0 0 8px;"
        />
        <button class="btn btn-primary px-3" @click="searchResidents" style="border-radius: 0 8px 8px 0;">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <!-- Residents Table -->
    <div class="table-responsive rounded-3 shadow-sm mb-4">
      <table class="table table-hover align-middle mb-0">
        <thead class="bg-light">
          <tr>
            <th class="fw-semibold text-muted small py-3 ps-4">RESIDENT</th>
            <th class="fw-semibold text-muted small py-3">ADDRESS</th>
            <th class="fw-semibold text-muted small py-3">CONTACT</th>
            <th class="fw-semibold text-muted small py-3">REGISTERED</th>
            <th class="fw-semibold text-muted small py-3 pe-4"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resident in paginatedResidents" :key="resident.id" class="border-top">
            <td class="py-3 ps-4">
              <div class="d-flex align-items-center">
                <div class=" bg-light-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                  <i class=" text-primary"></i>
                </div>
                <div>
                  <div class="fw-semibold">{{ resident.name }}</div>
                  <small class="text-muted">{{ resident.email }}</small>
                </div>
              </div>
            </td>
            <td class="py-3">{{ resident.address }}</td>
            <td class="py-3">{{ resident.contact }}</td>
            <td class="py-3">{{ formatDate(resident.createdAt) }}</td>
            <td class="py-3 pe-4">
              <button class="btn btn-sm btn-light rounded-pill px-3" @click="viewResident(resident.id)">
                <i class=" me-1"></i> View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination - Now aligned left with search -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div class="text-muted small">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, residents.length) }} of {{ residents.length }} residents
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">
              <i class="fas fa-chevron-left"></i>
            </button>
          </li>
          <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">
              <i class="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Resident Detail Modal -->
    <div v-if="selectedResident" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1050;">
      <div class="modal-dialog modal-lg modal-dialog-centered" style="position: relative; top: 50%; transform: translateY(-50%);">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 12px; overflow: hidden;">
          <div class="modal-header bg-primary text-white border-0 py-3 px-4">
            <div class="flex-grow-1">
              <h5 class="modal-title mb-0">{{ selectedResident.name }}</h5>
              <small class="opacity-75">{{ selectedResident.email }}</small>
            </div>
            <button type="button" class="btn-close btn-close-white opacity-100" @click="selectedResident = null"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row">
              <div class="col-md-6 mb-3">
                <h6 class="text-uppercase text-muted small mb-3">Personal Information</h6>
                <div class="d-flex align-items-start mb-3">
                  <div class="me-3 text-primary mt-1">
                    <i class="fas fa-home"></i>
                  </div>
                  <div>
                    <div class="small text-muted mb-1">Address</div>
                    <div class="fw-semibold">{{ selectedResident.address }}</div>
                  </div>
                </div>
                <div class="d-flex align-items-start mb-3">
                  <div class="me-3 text-primary mt-1">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div>
                    <div class="small text-muted mb-1">Contact Number</div>
                    <div class="fw-semibold">{{ selectedResident.contact }}</div>
                  </div>
                </div>
                <div class="d-flex align-items-start">
                  <div class="me-3 text-primary mt-1">
                    <i class="fas fa-calendar-alt"></i>
                  </div>
                  <div>
                    <div class="small text-muted mb-1">Birthdate</div>
                    <div class="fw-semibold">{{ formatDate(selectedResident.birthdate) }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6 class="text-uppercase text-muted small mb-3">Registration Details</h6>
                <div class="d-flex align-items-start mb-3">
                  <div class="me-3 text-primary mt-1">
                    <i class="fas fa-calendar-check"></i>
                  </div>
                  <div>
                    <div class="small text-muted mb-1">Registered On</div>
                    <div class="fw-semibold">{{ formatDate(selectedResident.createdAt) }}</div>
                  </div>
                </div>
                <div class="d-flex align-items-start">
                  <div class="me-3 text-primary mt-1">
                    <i class="fas fa-id-card"></i>
                  </div>
                  <div>
                    <div class="small text-muted mb-1">Resident ID</div>
                    <div class="fw-semibold">{{ selectedResident.id }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 bg-light justify-content-end py-3 px-4">
            <button class="btn btn-outline-secondary rounded-pill px-4 me-2" @click="selectedResident = null">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      allResidents: [],
      residents: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      selectedResident: null,
      maxVisiblePages: 5
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.residents.length / this.pageSize)
    },
    paginatedResidents() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.residents.slice(start, start + this.pageSize)
    },
    visiblePages() {
      const range = []
      const start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2))
      const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1)
      
      for (let i = start; i <= end; i++) {
        range.push(i)
      }
      
      return range
    }
  },
  async created() {
    await this.fetchResidents()
  },
  methods: {
    async fetchResidents() {
      const q = query(collection(db, 'users'), where('role', '==', 'resident'))
      const snapshot = await getDocs(q)

      this.allResidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      this.residents = [...this.allResidents]
      this.currentPage = 1
    },

    async searchResidents() {
      if (!this.searchQuery.trim()) {
        this.residents = [...this.allResidents]
      } else {
        this.residents = this.allResidents.filter(res =>
          res.name?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      this.currentPage = 1
    },

    async viewResident(id) {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        this.selectedResident = {
          id: docSnap.id,
          ...docSnap.data()
        }
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    formatDate(date) {
      if (!date) return 'N/A'
      const d = new Date(date.seconds ? date.seconds * 1000 : date)
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.manage-residents {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.table th {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 2px solid #e9ecef;
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.avatar-sm {
  width: 36px;
  height: 36px;
}

.bg-light-primary {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.btn-light {
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.btn-light:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

/* Modern Pagination */
.pagination {
  --bs-pagination-padding-x: 0.75rem;
  --bs-pagination-padding-y: 0.375rem;
  --bs-pagination-font-size: 0.875rem;
  margin-bottom: 0;
}

.page-link {
  border-radius: 6px !important;
  margin: 0 4px;
  min-width: 38px;
  text-align: center;
  border: none;
  color: #495057;
  transition: all 0.2s ease;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
}

.page-link:hover {
  background-color: #f1f3f5;
  color: #0d6efd;
}

.page-item.disabled .page-link {
  opacity: 0.5;
}

/* Status text */
.text-muted small {
  font-size: 0.875rem;
}

/* Modal */
.modal-content {
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.modal-backdrop {
  background-color: rgba(0,0,0,0.5);
}

.modal-header {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .table-responsive {
    border: 1px solid #dee2e6;
    border-radius: 8px;
  }
  
  .modal-body .row > .col-md-6 {
    width: 100%;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 1rem !important;
  }

  /* Stack pagination on mobile */
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>