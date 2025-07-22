<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
      <div class="sidebar-header">
        <h3>Admin Portal</h3>
        <div class="user-profile">
          <div class="avatar">
            <span>{{ userInitials }}</span>
          </div>
          <div class="user-info">
            <strong>{{ user.name }}</strong>
            <small>{{ formatRole(user.role) }}</small>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h4>Management</h4>
          <ul>
            <li :class="{ active: activeSection === 'users' }">
              <a @click="activeSection = 'users'; sidebarOpen = false">
                <i class="fas fa-users"></i> <span>User Management</span>
              </a>
            </li>
            <li :class="{ active: activeSection === 'transactions' }">
              <a @click="activeSection = 'transactions'; sidebarOpen = false">
                <i class="fas fa-exchange-alt"></i> <span>Transactions</span>
              </a>
            </li>
            <li :class="{ active: activeSection === 'announcements' }">
              <a @click="activeSection = 'announcements'; sidebarOpen = false">
                <i class="fas fa-bullhorn"></i> <span>Announcements</span>
              </a>
            </li>
          </ul>
          <br>
        </div>
        <div class="nav-section">
          <h4>System</h4>
          <ul>
            <li :class="{ active: activeSection === 'system' }">
              <a @click="activeSection = 'system'; sidebarOpen = false">
                <i class="fas fa-cog"></i> <span>System Settings</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="nav-section logout-section">
          <ul>
            <li>
              <a @click="logout">
                <i class="fas fa-sign-out-alt"></i> <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header">
        <h1>{{ sectionTitle }}</h1>
        <div class="header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="`Search ${activeSection}...`"
            />
          </div>
          <button class="notification-btn">
            <i class="fas fa-bell"></i>
            <span v-if="unreadAnnouncements" class="badge">{{ unreadAnnouncements }}</span>
          </button>
        </div>
      </header>

      <!-- User Management Section -->
      <section v-if="activeSection === 'users'" class="content-section">
        <div class="card">
          <div class="card-header">
            <h3>All Users</h3>
            <div class="card-actions">
              <div class="filter-group">
                <select v-model="roleFilter" @change="fetchAllUsers">
                  <option value="">All Roles</option>
                  <option value="admin">Administrator</option>
                  <option value="barangay_official">Barangay Official</option>
                  <option value="sk_official">SK Official</option>
                  <option value="resident">Resident</option>
                </select>
                <select v-model="statusFilter" @change="fetchAllUsers">
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button v-if="selectedUsers.length" class="btn btn-approve" @click="bulkApproveUsers">
                Approve Selected
              </button>
              <button v-if="selectedUsers.length" class="btn btn-delete" @click="bulkDeleteUsers">
                Delete Selected
              </button>
              <button class="btn btn-export" @click="exportUsers">
                <i class="fas fa-download"></i> Export
              </button>
              <button class="btn btn-refresh" @click="fetchAllUsers">
                <i class="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loadingUsers" class="loading-indicator">
              <i class="fas fa-spinner fa-spin"></i> Loading users...
            </div>
            <div v-else-if="userError" class="error-message">
              <i class="fas fa-exclamation-circle"></i> {{ userError }}
            </div>
            <div v-else class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
                    <th>User</th>
                    <th class="hide-sm">Contact</th>
                    <th class="hide-md">Role</th>
                    <th class="hide-lg">Position</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td><input type="checkbox" v-model="selectedUsers" :value="user.id"></td>
                    <td>
                      <div class="user-cell">
                        <div class="user-details">
                          <strong>{{ user.name }}</strong>
                          <small>{{ user.email }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="hide-sm">{{ user.contact || 'N/A' }}</td>
                    <td class="hide-md">{{ formatRole(user.role) }}</td>
                    <td class="hide-lg">{{ user.adminRole || user.position || user.skPosition || 'N/A' }}</td>
                    <td>
                      <span :class="['status-badge', getStatusClass(user)]">
                        {{ getStatusText(user) }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button v-if="!user.isApproved" class="btn-action btn-approve" @click.stop="approveUser(user)" title="Approve User">
                          <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action btn-delete" @click.stop="confirmDeleteUser(user)" title="Delete User">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Transactions Section -->
      <section v-if="activeSection === 'transactions'" class="content-section">
        <div class="card">
          <div class="card-header">
            <h3>Recent Transactions</h3>
            <div class="card-actions">
              <div class="filter-group">
                <select v-model="dateFilter" @change="filterTransactionsByDate">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
              <button class="btn btn-export" @click="exportTransactions">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loadingTransactions" class="loading-indicator">
              <i class="fas fa-spinner fa-spin"></i> Loading transactions...
            </div>
            <div v-else-if="transactionError" class="error-message">
              <i class="fas fa-exclamation-circle"></i> {{ transactionError }}
            </div>
            <div v-else class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th class="hide-sm">Document Type</th>
                    <th>Name</th>
                    <th class="hide-md">Purpose</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tx in paginatedTransactions" :key="tx.id">
                    <td>{{ tx.id }}</td>
                    <td class="hide-sm">{{ tx.documentType || tx.type }}</td>
                    <td>{{ tx.userName }}</td>
                    <td class="hide-md">{{ tx.purpose }}</td>
                    <td>
                      <span :class="['status-badge', tx.status]">
                        {{ tx.status || 'Pending' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button
                          v-if="tx.documentUrl"
                          class="btn-action btn-preview"
                          @click="previewDocument(tx)"
                          title="Preview Document"
                        >
                          <i class="fas fa-file-pdf"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination" v-if="totalTransactions > perPage && !transactionError">
              <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                :class="{ active: currentPage === page }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
              <button
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Announcements Section -->
      <section v-if="activeSection === 'announcements'" class="content-section">
        <div class="card">
          <div class="card-header">
            <h3>Recent Announcements</h3>
            <div class="card-actions">
              <button class="btn btn-primary" @click="showCreateAnnouncementModal">
                <i class="fas fa-plus"></i> Create Announcement
              </button>
                           <button class="btn btn-refresh" @click="fetchAnnouncements">
                <i class="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loadingAnnouncements" class="loading-indicator">
              <i class="fas fa-spinner fa-spin"></i> Loading announcements...
            </div>
            <div v-else-if="announcementError" class="error-message">
              <i class="fas fa-exclamation-circle"></i> {{ announcementError }}
            </div>
            <div v-else class="announcement-list">
              <div v-for="announcement in announcements" :key="announcement.id" class="announcement-item">
                <div class="announcement-header">
                  <h4>{{ announcement.title }}</h4>
                  <span class="date">{{ formatDate(announcement.createdAt) }}</span>
                </div>
                <p>{{ announcement.content }}</p>
                <p v-if="announcement.recipientIds && announcement.recipientIds.length" class="recipients">
                  To: {{ getRecipientNames(announcement.recipientIds) }}
                </p>
                <div class="announcement-actions">
                  <button class="btn-action btn-edit" @click="editAnnouncement(announcement)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-action btn-delete" @click="confirmDeleteAnnouncement(announcement.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Add this section with your other content sections -->
      <section v-if="activeSection === 'system'" class="content-section">
        <div class="card">
          <div class="card-header">
            <h3>System Maintenance</h3>
          </div>
          <div class="card-body">
            <div class="maintenance-controls">
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="maintenanceEnabled" @change="toggleMaintenance">
                  Enable Maintenance Mode
                </label>
              </div>
              
              <div v-if="maintenanceEnabled" class="form-group">
                <label>Maintenance Message</label>
                <textarea v-model="maintenanceMessage" class="form-control" placeholder="Enter maintenance message"></textarea>
              </div>
              
              <div v-if="maintenanceEnabled" class="form-group">
                <label>Estimated Completion</label>
                <input v-model="maintenanceEstimate" type="text" class="form-control" placeholder="Estimated completion time">
              </div>
              
              <button @click="saveMaintenanceSettings" class="btn btn-primary">
                <i class="fas fa-save"></i> Save Settings
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Announcement Modal -->
      <AnnouncementModal
        :isVisible="showAnnouncementModal"
        :announcement="newAnnouncement"
        :editingAnnouncement="editingAnnouncement"
        @close="closeAnnouncementModal"
        @save="saveAnnouncement"
      />

      <!-- Confirmation Modal -->
      <ConfirmationModal
        ref="confirmationModal"
        :isVisible="showConfirmModal"
        :message="confirmMessage"
        @close="closeConfirmModal"
        @confirm="executeDelete"
      />
    </main>
  </div>
</template>

<script>
import { db, auth } from '@/firebase/config'
import {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  orderBy,
  addDoc,
  where,
  setDoc
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import * as XLSX from 'xlsx'
import AnnouncementModal from './AnnouncementModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AnnouncementModal,
    ConfirmationModal
  },
  data() {
    return {
      activeSection: 'users',
      allUsers: [],
      transactions: [],
      announcements: [],
      currentPage: 1,
      perPage: 10,
      totalTransactions: 0,
      searchQuery: '',
      roleFilter: '',
      statusFilter: '',
      selectedUsers: [],
      selectAll: false,
      loadingUsers: false,
      loadingTransactions: false,
      loadingAnnouncements: false,
      userError: null,
      transactionError: null,
      announcementError: null,
      dateFilter: '30',
      showAnnouncementModal: false,
      editingAnnouncement: null,
      newAnnouncement: {
        title: '',
        content: '',
        recipientIds: []
      },
      user: {
        name: '',
        email: '',
        role: ''
      },
      sidebarOpen: false,
      showConfirmModal: false,
      confirmMessage: '',
      deleteAction: null,
      maintenanceEnabled: false,
      maintenanceMessage: '',
      maintenanceEstimate: ''
    }
  },
  computed: {
    sectionTitle() {
      const sections = {
        users: 'User Management',
        transactions: 'Transaction History',
        announcements: 'Announcements',
        system: 'System Settings'
      }
      return sections[this.activeSection] || 'Admin Dashboard'
    },
    userInitials() {
      return this.user.name
        ? this.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'AU'
    },
    filteredUsers() {
      return this.allUsers.filter(user => {
        const search = this.searchQuery.toLowerCase()
        return (
          (user.name?.toLowerCase().includes(search)) ||
          (user.email?.toLowerCase().includes(search)) ||
          (user.contact?.toLowerCase().includes(search)) ||
          (user.address?.toLowerCase().includes(search)) ||
          (user.birthdate?.toLowerCase().includes(search)) ||
          (user.role?.toLowerCase().includes(search)) ||
          (user.adminRole?.toLowerCase().includes(search)) ||
          (user.position?.toLowerCase().includes(search)) ||
          (user.skPosition?.toLowerCase().includes(search)) ||
          (user.status?.toLowerCase().includes(search))
        )
      })
    },
    filteredTransactions() {
      let filtered = this.transactions.filter(tx => {
        const search = this.searchQuery.toLowerCase()
        return (
          (tx.id?.toLowerCase().includes(search)) ||
          (tx.userName?.toLowerCase().includes(search)) ||
          (tx.documentType?.toLowerCase().includes(search)) ||
          (tx.type?.toLowerCase().includes(search)) ||
          (tx.purpose?.toLowerCase().includes(search))
        )
      })

      if (this.dateFilter !== 'all') {
        const days = parseInt(this.dateFilter)
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        filtered = filtered.filter(tx => {
          const txDate = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt)
          return txDate >= cutoffDate
        })
      }

      return filtered
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredTransactions.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.perPage)
    },
    unreadAnnouncements() {
      return this.announcements.filter(a => !a.read).length
    }
  },
  methods: {
    formatRole(role) {
      const map = {
        admin: 'Administrator',
        barangay_official: 'Barangay Official',
        sk_official: 'SK Official',
        resident: 'Resident'
      }
      return map[role] || 'User'
    },
    getStatusClass(user) {
      if (user.isApproved) return 'approved'
      return user.status || 'pending'
    },
    getStatusText(user) {
      if (user.isApproved) return 'Approved'
      return user.status || 'Pending'
    },
    async fetchAllUsers() {
      this.loadingUsers = true
      this.userError = null
      try {
        let q = query(collection(db, 'users'))
        if (this.roleFilter) {
          q = query(q, where('role', '==', this.roleFilter))
        }
        if (this.statusFilter) {
          q = query(q, where('status', '==', this.statusFilter))
        }
        const snapshot = await getDocs(q)
        this.allUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        this.$notify.success('Users loaded successfully')
      } catch (error) {
        console.error('Error fetching users:', error)
        this.userError = 'Failed to load users'
        this.$notify.error('Failed to load users. Please try again.')
      } finally {
        this.loadingUsers = false
      }
    },
    async fetchTransactions() {
      this.loadingTransactions = true
      this.transactionError = null
      try {
        let q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const transactionsData = []

        for (const docItem of snapshot.docs) {
          const txData = docItem.data()
          const userDoc = await getDoc(doc(db, 'users', txData.userId))
          const userData = userDoc.exists() ? userDoc.data() : {}
          transactionsData.push({
            id: docItem.id,
            ...txData,
            userName: userData?.name || 'Unknown User',
            contact: userData?.contact || 'N/A',
            createdAt: txData.createdAt
          })
        }

        this.transactions = transactionsData
        this.totalTransactions = transactionsData.length
        this.$notify.success('Transactions loaded successfully')
      } catch (error) {
        console.error('Error fetching transactions:', error)
        this.transactionError = 'Failed to load transactions'
        this.$notify.error('Failed to load transactions. Please try again.')
      } finally {
        this.loadingTransactions = false
      }
    },
    async fetchAnnouncements() {
      this.loadingAnnouncements = true
      this.announcementError = null
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        this.announcements = []
        for (const doc of snapshot.docs) {
          const data = doc.data()
          if (
            this.user.role === 'admin' ||
            !data.recipientIds ||
            data.recipientIds.length === 0 ||
            data.recipientIds.includes(auth.currentUser?.uid)
          ) {
            this.announcements.push({
              id: doc.id,
              ...data
            })
          }
        }
        this.$notify.success('Announcements loaded successfully')
      } catch (error) {
        console.error('Error fetching announcements:', error)
        this.announcementError = 'Failed to load announcements'
        this.$notify.error('Failed to load announcements. Please try again.')
      } finally {
        this.loadingAnnouncements = false
      }
    },
    async getRecipientNames(recipientIds) {
      if (!recipientIds || !recipientIds.length) return 'All Users'
      try {
        const names = []
        for (const id of recipientIds) {
          const userDoc = await getDoc(doc(db, 'users', id))
          if (userDoc.exists()) {
            names.push(userDoc.data().name || 'Unknown')
          }
        }
        return names.join(', ') || 'Unknown Users'
      } catch (error) {
        console.error('Error fetching recipient names:', error)
        return 'Unknown Users'
      }
    },
    formatDate(date) {
      if (!date) return 'N/A'
      const d = date?.toDate ? date.toDate() : new Date(date)
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedUsers = this.filteredUsers.map(user => user.id)
      } else {
        this.selectedUsers = []
      }
    },
    async bulkApproveUsers() {
      this.confirmMessage = `Are you sure you want to approve ${this.selectedUsers.length} users?`
      this.deleteAction = async () => {
        try {
          const promises = this.selectedUsers.map(userId => {
            const userRef = doc(db, 'users', userId)
            return updateDoc(userRef, {
              isApproved: true,
              status: 'approved',
              updatedAt: new Date()
            })
          })
          await Promise.all(promises)
          this.fetchAllUsers()
          this.selectedUsers = []
          this.selectAll = false
          this.$notify.success(`${this.selectedUsers.length} users approved successfully`)
        } catch (error) {
          console.error('Error approving users:', error)
          this.$notify.error('Failed to approve users. Please try again.')
        }
      }
      this.showConfirmModal = true
    },
    async bulkDeleteUsers() {
      this.confirmMessage = `Are you sure you want to delete ${this.selectedUsers.length} users?`
      this.deleteAction = async () => {
        try {
          const promises = this.selectedUsers.map(userId => deleteDoc(doc(db, 'users', userId)))
          await Promise.all(promises)
          this.fetchAllUsers()
          this.selectedUsers = []
          this.selectAll = false
          this.$notify.success(`${this.selectedUsers.length} users deleted successfully`)
        } catch (error) {
          console.error('Error deleting users:', error)
          this.$notify.error('Failed to delete users. Please try again.')
        }
      }
      this.showConfirmModal = true
    },
    async approveUser(user) {
      try {
        const userRef = doc(db, 'users', user.id)
        const updateData = {
          isApproved: true,
          status: 'approved',
          adminRole: user.role === 'admin' ? 'Support' : null,
          updatedAt: new Date()
        }
        
        await updateDoc(userRef, updateData)
        this.fetchAllUsers()
        this.$notify.success(`User ${user.name} approved successfully`)
      } catch (error) {
        console.error('Error approving user:', error)
        this.$notify.error(`Failed to approve user: ${error.message}`)
      }
    },
    confirmDeleteUser(user) {
      this.confirmMessage = `Are you sure you want to delete ${user.name}?`
      this.deleteAction = () => this.deleteUser(user.id)
      this.showConfirmModal = true
    },
    confirmDeleteAnnouncement(id) {
      this.confirmMessage = 'Are you sure you want to delete this announcement?'
      this.deleteAction = () => this.deleteAnnouncement(id)
      this.showConfirmModal = true
    },
    async deleteUser(userId) {
      try {
        await deleteDoc(doc(db, 'users', userId))
        this.fetchAllUsers()
        this.$notify.success('User deleted successfully')
      } catch (error) {
        console.error('Error deleting user:', error)
        this.$notify.error('Failed to delete user. Please try again.')
      }
    },
    async deleteAnnouncement(id) {
      try {
        await deleteDoc(doc(db, 'announcements', id))
        this.fetchAnnouncements()
        this.$notify.success('Announcement deleted successfully')
      } catch (error) {
        console.error('Error deleting announcement:', error)
        this.$notify.error('Failed to delete announcement. Please try again.')
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    filterTransactionsByDate() {
      this.currentPage = 1
      this.fetchTransactions()
    },
    previewDocument(tx) {
      if (tx.documentUrl) {
        window.open(tx.documentUrl, '_blank')
      }
    },
    showCreateAnnouncementModal() {
      this.newAnnouncement = { title: '', content: '', recipientIds: [] }
      this.editingAnnouncement = null
      this.showAnnouncementModal = true
    },
    editAnnouncement(announcement) {
      this.newAnnouncement = { ...announcement }
      this.editingAnnouncement = announcement
      this.showAnnouncementModal = true
    },
    async saveAnnouncement(announcement, editingAnnouncement) {
      try {
        if (editingAnnouncement) {
          const announcementRef = doc(db, 'announcements', editingAnnouncement.id)
          await updateDoc(announcementRef, {
            title: announcement.title,
            content: announcement.content,
            recipientIds: announcement.recipientIds || [],
            updatedAt: new Date()
          })
          this.$notify.success('Announcement updated successfully')
        } else {
          await addDoc(collection(db, 'announcements'), {
            title: announcement.title,
            content: announcement.content,
            recipientIds: announcement.recipientIds || [],
            createdAt: new Date(),
            read: false
          })
          this.$notify.success('Announcement created successfully')
        }
        this.showAnnouncementModal = false
        this.fetchAnnouncements()
      } catch (error) {
        console.error('Error saving announcement:', error)
        this.$notify.error('Failed to save announcement: ' + error.message)
      }
    },
    closeAnnouncementModal() {
      this.showAnnouncementModal = false
    },
    closeConfirmModal() {
      this.showConfirmModal = false
      this.deleteAction = null
      this.confirmMessage = ''
    },
    executeDelete() {
      if (this.deleteAction) {
        this.$refs.confirmationModal.startDeleting()
        this.deleteAction().finally(() => {
          this.$refs.confirmationModal.stopDeleting()
          this.closeConfirmModal()
        })
      }
    },
    exportUsers() {
      try {
        const data = this.allUsers.map(user => ({
          ID: user.id,
          Name: user.name,
          Email: user.email,
          Contact: user.contact || 'N/A',
          Address: user.address || 'N/A',
          Birthdate: user.birthdate || 'N/A',
          Role: this.formatRole(user.role),
          Position: user.adminRole || user.position || user.skPosition || 'N/A',
          Status: user.status || 'N/A',
          Approved: user.isApproved ? 'Yes' : 'No',
          CreatedAt: this.formatDate(user.createdAt)
        }))
        this.exportExcel('UsersExport.xlsx', data)
        this.$notify.success('Users data exported successfully')
      } catch (e) {
        console.error('Export users failed:', e)
        this.$notify.error('Failed to export users. Please try again.')
      }
    },
    exportTransactions() {
      try {
        const data = this.filteredTransactions.map(tx => ({
          ID: tx.id,
          UserName: tx.userName,
          Contact: tx.contact || 'N/A',
          DocumentType: tx.documentType || tx.type || 'N/A',
          Purpose: tx.purpose || 'N/A',
          Status: tx.status || 'N/A',
          CreatedAt: this.formatDate(tx.createdAt)
        }))
        this.exportExcel('TransactionsExport.xlsx', data)
        this.$notify.success('Transactions data exported successfully')
      } catch (e) {
        console.error('Export transactions failed:', e)
        this.$notify.error('Failed to export transactions. Please try again.')
      }
    },
    exportExcel(filename, jsonData) {
      const worksheet = XLSX.utils.json_to_sheet(jsonData)
      const headerRange = XLSX.utils.decode_range(worksheet['!ref'])
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
        if (!worksheet[cellAddress]) continue
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {}
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFFFF' } },
          fill: { fgColor: { rgb: 'FF1F497D' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'FF000000' } },
            bottom: { style: 'thin', color: { rgb: 'FF000000' } },
            left: { style: 'thin', color: { rgb: 'FF000000' } },
            right: { style: 'thin', color: { rgb: 'FF000000' } }
          }
        }
      }
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, filename)
    },
    async logout() {
      try {
        await signOut(auth)
        this.$router.push('/login')
        this.$notify.success('Logged out successfully')
      } catch (error) {
        console.error('Error logging out:', error)
        this.$notify.error('Failed to logout. Please try again.')
      }
    },
    async loadMaintenanceSettings() {
      try {
        const docRef = doc(db, 'system', 'maintenance')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          this.maintenanceEnabled = data.enabled || false
          this.maintenanceMessage = data.message || ''
          this.maintenanceEstimate = data.estimatedCompletion || ''
        }
      } catch (error) {
        console.error('Error loading maintenance settings:', error)
        this.$notify.error('Failed to load maintenance settings. Please try again.')
      }
    },
    async saveMaintenanceSettings() {
      try {
        const docRef = doc(db, 'system', 'maintenance')
        await setDoc(docRef, {
          enabled: this.maintenanceEnabled,
          message: this.maintenanceMessage,
          estimatedCompletion: this.maintenanceEstimate,
          updatedAt: new Date()
        })
        
        this.$notify.success('Maintenance settings saved successfully')
      } catch (error) {
        console.error('Error saving maintenance settings:', error)
        this.$notify.error('Failed to save maintenance settings. Please try again.')
      }
    },
    toggleMaintenance() {
      if (this.maintenanceEnabled) {
        this.maintenanceMessage = 'Our barangay system is currently undergoing scheduled maintenance. We apologize for the inconvenience and appreciate your patience.'
        this.maintenanceEstimate = new Date(Date.now() + 86400000).toLocaleString()
      } else {
        this.maintenanceMessage = ''
        this.maintenanceEstimate = ''
      }
    }
  },
  created() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)
          if (userSnap.exists()) {
            const userData = userSnap.data()
            this.user = {
              name: userData.name || 'User',
              email: user.email,
              role: userData.role || 'user'
            }
          } else {
            this.user = {
              name: user.displayName || 'User',
              email: user.email,
              role: 'user'
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          this.$notify.error('Failed to load user profile. Please refresh the page.')
        }
      }
    })

    this.fetchAllUsers()
    this.fetchTransactions()
    this.fetchAnnouncements()
    this.loadMaintenanceSettings()
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #F44336;
}

.notification.fade-out {
  animation: fadeOut 0.3s ease-in;
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>


<style scoped>
/* Base Styles */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1e293b;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar-header {
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  margin-right: 12px;
}

.user-info strong {
  font-size: 0.95rem;
  color: #1e293b;
}

.user-info small {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-section h4 {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 12px;
  margin-bottom: 12px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li a {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #475569;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.sidebar-nav li a:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.sidebar-nav li.active a {
  background: #2563eb;
  color: white;
  font-weight: 500;
}

.sidebar-nav li a i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.logout-section {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.logout-section li a {
  color: #dc2626;
}

.logout-section li a:hover {
  background: #fef2f2;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.content-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 10px 16px 10px 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  width: 280px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.notification-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.notification-btn .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-export {
  background: #2563eb;
  color: white;
}

.btn-export:hover {
  background: #1d4ed8;
}

.btn-refresh {
  background: #f1f5f9;
  color: #475569;
}

.btn-refresh:hover {
  background: #e2e8f0;
}

.btn-approve {
  background: #dcfce7;
  color: #166534;
}

.btn-approve:hover {
  background: #bbf7d0;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.card-body {
  padding: 0;
}

/* Table Styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background: #f8fafc;
}

.data-table th {
  padding: 16px 12px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #1e293b;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background: #f8fafc;
}

/* User Cell Styles */
.user-cell {
  display: flex;
  align-items: center;
}

.user-details small {
  display: block;
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 4px;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.approved,
.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.pending {
  background: #fef9c3;
  color: #854d0e;
}

.status-badge.failed {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-preview {
  background: #e0e7ff;
  color: #3730a3;
}

.btn-preview:hover {
  background: #c7d2fe;
}

.btn-edit {
  background: #fef9c3;
  color: #854d0e;
}

.btn-edit:hover {
  background: #fef08a;
}

/* Loading and Error States */
.loading-indicator {
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}

.error-message {
  padding: 24px;
  text-align: center;
  color: #dc2626;
  font-size: 0.875rem;
}

/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
}

.pagination button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #2563eb;
}

.pagination button.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Filter Group */
.filter-group {
  display: flex;
  gap: 12px;
}

.filter-group select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
}

.filter-group select:focus {
  outline: none;
  border-color: #2563eb;
}

/* Announcement Styles */
.announcement-list {
  padding: 24px;
}

.announcement-item {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.announcement-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.announcement-header .date {
  font-size: 0.8rem;
  color: #64748b;
}

.announcement-item p {
  margin: 8px 0;
  color: #475569;
}

.announcement-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;

}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }

  .sidebar-header h3,
  .user-info,
  .nav-section h4,
  .sidebar-nav li a span {
    display: none;
  }

  .sidebar-nav li a {
    justify-content: center;
    padding: 16px 0;
  }

  .sidebar-nav li a i {
    margin-right: 0;
    font-size: 1.25rem;
  }

  .search-box input {
    width: 200px;
  }

  .data-table th,
  .data-table td {
    padding: 12px 8px;
    font-size: 0.8rem;
  }

  .filter-group {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 16px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-header h3 {
    display: block;
  }

  .user-profile {
    display: none;
  }

  .sidebar-nav {
    display: flex;
    padding: 0;
  }

  .nav-section {
    margin: 0;
  }

  .nav-section h4 {
    display: none;
  }

  .sidebar-nav ul {
    display: flex;
    width: 100%;
  }

  .sidebar-nav li {
    flex: 1;
  }

  .sidebar-nav li a {
    flex-direction: column;
    padding: 12px 8px;
    font-size: 0.75rem;
    text-align: center;
  }

  .sidebar-nav li a i {
    margin-bottom: 4px;
    font-size: 1.25rem;
  }

  .main-content {
    padding: 16px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-box input {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .data-table th,
  .data-table td {
    padding: 10px 6px;
    font-size: 0.75rem;
  }

  .data-table th:nth-child(4),
  .data-table td:nth-child(4),
  .data-table th:nth-child(5),
  .data-table td:nth-child(5) {
    display: none;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group select {
    width: 100%;
  }
}

/* Add these styles to your existing styles */
.maintenance-controls {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e293b;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}
#notification-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>