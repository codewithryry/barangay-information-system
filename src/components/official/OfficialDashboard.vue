<template>
  <div class="official-dashboard">
    <div class="dashboard-header">
      <h2><i class=""></i> Barangay Official Dashboard</h2>
      <p class="last-updated">Last updated: {{ currentTime }}</p>
    </div>
    
    <div class="stats-container">
      <div class="stat-card" v-for="(stat, index) in statCards" :key="index">
        <div class="stat-icon" :class="stat.iconClass">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stat.title }}</h3>
          <p>{{ stat.value }}</p>
          <span class="stat-trend" v-if="stat.trend">
            <i :class="stat.trendIcon"></i> {{ stat.trend }}% from last month
          </span>
        </div>
      </div>
    </div>
    
    <div class="dashboard-section">
      <div class="section-header">
        <h3><i class="fas fa-clock"></i> Recent Requests</h3>
      </div>
      
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Resident Name</th>
              <th>Document Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in sortedRecentRequests" :key="request.id">
              <td>{{ request.id.length > 8 ? request.id.substring(0, 8) + '...' : request.id }}</td>
              <td>
                <div class="user-info">
                  {{ request.userName }}
                </div>
              </td>
              <td>{{ request.type }}</td>
              <td>{{ formatDate(request.createdAt) }}</td>
              <td>
                <span :class="'status-badge ' + request.status">
                  {{ request.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'

export default {
  data() {
    return {
      stats: {
        totalResidents: 0,
        pendingRequests: 0,
        completedRequests: 0
      },
      recentRequests: [],
      currentTime: new Date().toLocaleString()
    }
  },
  computed: {
    statCards() {
      return [
        {
          title: "Total Residents",
          value: this.stats.totalResidents,
          icon: "fas fa-users",
          iconClass: "bg-blue",
          trendIcon: "fas fa-caret-up"
        },
        {
          title: "Pending Requests",
          value: this.stats.pendingRequests,
          icon: "fas fa-clock",
          iconClass: "bg-orange",
          trendIcon: "fas fa-caret-up"
        },
        {
          title: "Completed Requests",
          value: this.stats.completedRequests,
          icon: "fas fa-check-circle",
          iconClass: "bg-green",
          trendIcon: "fas fa-caret-up"
        }
      ]
    },
    sortedRecentRequests() {
      return [...this.recentRequests].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    }
  },
  async created() {
    await this.fetchStats()
    await this.fetchRecentRequests()
    setInterval(() => {
      this.currentTime = new Date().toLocaleString()
    }, 60000)
  },
  methods: {
    async fetchStats() {
      // Get total residents count
      const residentsQuery = query(collection(db, 'users'), where('role', '==', 'resident'))
      const residentsSnapshot = await getDocs(residentsQuery)
      this.stats.totalResidents = residentsSnapshot.size

      // Get pending requests count
      const pendingQuery = query(collection(db, 'requests'), where('status', '==', 'pending'))
      const pendingSnapshot = await getDocs(pendingQuery)
      this.stats.pendingRequests = pendingSnapshot.size

      // Get completed requests count (only from this month)
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const completedQuery = query(
        collection(db, 'requests'),
        where('status', '==', 'approved'),
        where('updatedAt', '>=', startOfMonth)
      )
      const completedSnapshot = await getDocs(completedQuery)
      this.stats.completedRequests = completedSnapshot.size
    },

    async fetchRecentRequests() {
      const q = query(
        collection(db, 'requests'),
        orderBy('createdAt', 'desc'),
        limit(5)
      )

      const snapshot = await getDocs(q)
      this.recentRequests = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: data.id || doc.id, // Use the document ID if no id field exists
          userName: data.userName || 'Unknown',
          type: data.type || data.documentType || 'Unknown',
          status: data.status || 'pending',
          createdAt: data.createdAt?.toDate?.() || null,
          updatedAt: data.updatedAt?.toDate?.() || null
        }
      })
    },

    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.official-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h2 {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dashboard-header h2 i {
  font-size: 1.5rem;
}

.last-updated {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.bg-blue {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.bg-orange {
  background: linear-gradient(135deg, #e67e22, #d35400);
}

.bg-green {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.stat-content h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.stat-content p {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  color: #95a5a6;
}

.stat-trend i {
  margin-right: 0.25rem;
}

.dashboard-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-container {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background-color: #f8f9fa;
}

.modern-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table td {
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  font-size: 0.95rem;
}

.modern-table tr:last-child td {
  border-bottom: none;
}

.modern-table tr:hover {
  background-color: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info i {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.processing {
  background-color: #cce5ff;
  color: #004085;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .modern-table th, 
  .modern-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>