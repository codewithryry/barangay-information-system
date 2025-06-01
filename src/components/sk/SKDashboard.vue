<template>
  <div class="sk-dashboard container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-success mb-2">SK Dashboard</h2>
        <p class="text-muted">Welcome to your Sangguniang Kabataan official dashboard</p>
      </div>
      <div class="d-flex">
        <button class="btn btn-success me-2">
          <i class="bi bi-plus-circle me-1"></i> New Project
        </button>
        <button class="btn btn-outline-secondary">
          <i class="bi bi-bell-fill"></i>
        </button>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title text-muted mb-0">Total Projects</h5>
              <div class="bg-success bg-opacity-10 p-2 rounded">
                <i class="bi bi-kanban text-success"></i>
              </div>
            </div>
            <h2 class="fw-bold mt-3">12</h2>
            <p class="text-success small mb-0">
              <i class="bi bi-arrow-up"></i> 3 new this month
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title text-muted mb-0">Ongoing</h5>
              <div class="bg-warning bg-opacity-10 p-2 rounded">
                <i class="bi bi-hourglass-split text-warning"></i>
              </div>
            </div>
            <h2 class="fw-bold mt-3">5</h2>
            <p class="text-warning small mb-0">
              <i class="bi bi-exclamation-circle"></i> 1 needs attention
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title text-muted mb-0">Completed</h5>
              <div class="bg-primary bg-opacity-10 p-2 rounded">
                <i class="bi bi-check-circle text-primary"></i>
              </div>
            </div>
            <h2 class="fw-bold mt-3">7</h2>
            <p class="text-primary small mb-0">
              <i class="bi bi-check-circle"></i> 100% success rate
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-0">
        <h5 class="mb-0 fw-bold">Recent Activities</h5>
      </div>
      <div class="card-body">
        <div class="list-group list-group-flush">
          <div class="list-group-item border-0 py-3">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                  <i class="bi bi-check-circle-fill"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="mb-1">Youth Sports Fest completed</h6>
                <p class="mb-0 small text-muted">2 days ago</p>
              </div>
              <span class="badge bg-success bg-opacity-10 text-success">Completed</span>
            </div>
          </div>
          <div class="list-group-item border-0 py-3">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-warning bg-opacity-10 text-warning p-2 rounded-circle">
                  <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="mb-1">Scholarship program needs review</h6>
                <p class="mb-0 small text-muted">1 week ago</p>
              </div>
              <span class="badge bg-warning bg-opacity-10 text-warning">Pending</span>
            </div>
          </div>
          <div class="list-group-item border-0 py-3">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-info bg-opacity-10 text-info p-2 rounded-circle">
                  <i class="bi bi-lightbulb-fill"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="mb-1">New project proposal: Clean-up Drive</h6>
                <p class="mb-0 small text-muted">2 weeks ago</p>
              </div>
              <span class="badge bg-info bg-opacity-10 text-info">New</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SKDashboard'
}
</script>

<style scoped>
.card {
  border-radius: 12px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.list-group-item {
  border-radius: 8px !important;
  margin-bottom: 5px;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>