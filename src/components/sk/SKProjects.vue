<template>
  <div class="sk-projects container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-success mb-2">SK Projects</h2>
        <p class="text-muted">Manage and track your Sangguniang Kabataan projects</p>
      </div>
      <button class="btn btn-success">
        <i class="fas fa-plus-circle me-1"></i> Add Project
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
            placeholder="Search projects..."
            v-model="searchQuery"
          >
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <div class="btn-group" role="group">
            <button 
              v-for="filter in filters" 
              :key="filter.value"
              @click="activeFilter = filter.value"
              :class="['btn', activeFilter === filter.value ? 'btn-success' : 'btn-outline-secondary']"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div 
        class="col-md-6 col-lg-4" 
        v-for="project in filteredProjects" 
        :key="project.id"
      >
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-img-top project-image" :style="{ backgroundImage: `url(${project.image})` }"></div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge" :class="`bg-${getStatusColor(project.status)}-subtle text-${getStatusColor(project.status)}`">
                {{ project.status }}
              </span>
              <div class="dropdown">
                <button class="btn btn-sm btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#"><i class="fas fa-pencil-alt me-2"></i>Edit</a></li>
                  <li><a class="dropdown-item" href="#"><i class="fas fa-trash me-2"></i>Delete</a></li>
                </ul>
              </div>
            </div>
            <h5 class="card-title">{{ project.title }}</h5>
            <p class="card-text text-muted">{{ project.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <i class="fas fa-calendar-alt me-1 text-muted"></i>
                <small class="text-muted">{{ project.date }}</small>
              </div>
              <div>
                <i class="fas fa-users me-1 text-muted"></i>
                <small class="text-muted">{{ project.participants }} participants</small>
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-0">
            <div class="d-grid">
              <button class="btn btn-outline-success btn-sm">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4" v-if="filteredProjects.length === 0">
      <div class="text-center py-5">
        <i class="fas fa-folder-times text-muted" style="font-size: 3rem;"></i>
        <h5 class="mt-3">No projects found</h5>
        <p class="text-muted">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SKProjects',
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Planning', value: 'planning' }
      ],
      projects: [
        {
          id: 1,
          title: 'Youth Sports Festival',
          description: 'Annual sports competition for barangay youth',
          status: 'completed',
          date: 'May 15-20, 2023',
          participants: 120,
          image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 2,
          title: 'Scholarship Program',
          description: 'Educational assistance for deserving students',
          status: 'ongoing',
          date: 'June 1 - Dec 31, 2023',
          participants: 25,
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 3,
          title: 'Barangay Clean-up Drive',
          description: 'Monthly community clean-up initiative',
          status: 'ongoing',
          date: 'Every last Saturday',
          participants: 45,
          image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 4,
          title: 'Youth Leadership Training',
          description: 'Workshops to develop leadership skills',
          status: 'planning',
          date: 'August 2023',
          participants: 0,
          image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 5,
          title: 'Computer Literacy Program',
          description: 'Basic computer skills training',
          status: 'completed',
          date: 'April 2023',
          participants: 35,
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 6,
          title: 'Anti-Drug Awareness Campaign',
          description: 'Education on dangers of substance abuse',
          status: 'ongoing',
          date: 'Quarterly sessions',
          participants: 80,
          image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query)
        );
      }
      
      // Apply status filter
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(project => 
          project.status === this.activeFilter
        );
      }
      
      return filtered;
    }
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        'completed': 'success',
        'ongoing': 'warning',
        'planning': 'info'
      };
      return colors[status] || 'secondary';
    }
  }
}
</script>

<style scoped>
.project-image {
  height: 150px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card {
  border-radius: 12px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.35em 0.65em;
}

.input-group-text {
  border-radius: 8px 0 0 8px !important;
}

.form-control {
  border-radius: 0 8px 8px 0 !important;
}
</style>