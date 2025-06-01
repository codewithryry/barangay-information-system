<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary-gradient py-5">
      <div class="container py-4 py-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2 text-lg-start text-center">
            <div class="official-badge mb-3">
              <span class="badge bg-white text-primary py-2 px-3 fw-normal">
                <i class="bi bi-info-circle me-2"></i> About Our Community
              </span>
            </div>
            <h1 class="display-4 fw-bold text-white mb-3">
              Barangay <span class="text-warning">[Name]</span>
            </h1>
            <p class="lead text-white mb-4">
              Serving the community with dedication and integrity since <strong>1987</strong>
            </p>
          </div>
          <div class="col-lg-6 order-lg-2 order-1 mb-lg-0 mb-4">
            <div class="about-hero-img position-relative">
              <!-- <img src="@/assets/barangay-hall.jpg" alt="Barangay Hall" class="img-fluid rounded-3 shadow"> -->
              <div class="img-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Barangay Profile -->
    <section class="profile-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">
            <i class=" text-primary me-2"></i> Barangay Profile
          </h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Learn about our history, mission, and the community we serve
          </p>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 p-lg-5">
                <h3 class="h4 fw-bold mb-4 text-primary">Our History</h3>
                <p class="text-muted mb-4">
                  Established in 1987, Barangay [Name] has grown from a small rural community to a thriving urban barangay with over 5,000 residents. Originally part of [Former Barangay], we became an independent barangay through Municipal Ordinance No. 123.
                </p>
                <p class="text-muted">
                  Over the years, we've implemented numerous community programs and infrastructure projects that have improved the quality of life for all residents.
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 p-lg-5">
                <h3 class="h4 fw-bold mb-4 text-primary">Mission & Vision</h3>
                <p class="text-muted mb-3">
                  <strong>Mission:</strong> To provide effective governance, promote sustainable development, and ensure the welfare of all residents through transparent and participatory leadership.
                </p>
                <p class="text-muted">
                  <strong>Vision:</strong> A progressive, peaceful, and environmentally sustainable community where all residents enjoy equal opportunities and access to quality services.
                </p>
                <div class="mt-4 pt-3 border-top">
                  <h4 class="h6 fw-bold mb-3">Core Values</h4>
                  <div class="d-flex flex-wrap gap-2">
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">Integrity</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">Service</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">Transparency</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">Unity</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Barangay Officials -->
    <section class="officials-section py-5 bg-white">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">
            <i class="text-primary me-2"></i> Barangay Officials
          </h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Meet the dedicated public servants working for our community
          </p>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" v-for="(official, index) in officials" :key="index">
            <div class="card official-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <!-- <div class="official-img-container">
                <img :src="official.image" :alt="official.name" class="img-fluid">
              </div> -->
              <div class="card-body text-center p-4">
                <h3 class="h5 fw-bold mb-1">{{ official.name }}</h3>
                <p class="text-primary small fw-bold mb-2">{{ official.position }}</p>
                <p class="text-muted small mb-3">{{ official.description }}</p>
                <div class="d-flex justify-content-center gap-2">
                  <a v-if="official.contact" href="#" class="btn btn-sm btn-outline-primary rounded-pill">
                    <i class="bi bi-envelope"></i>
                  </a>
                  <a v-if="official.contact" href="#" class="btn btn-sm btn-outline-primary rounded-pill">
                    <i class="bi bi-telephone"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Add this at the bottom of your template, before the closing </div> -->
<Chatbot />

  </div>
</template>

<script>
import Chatbot from '@/components/Chatbot.vue';

export default {
  name: 'AboutPage',
    components: {
    Chatbot
  },
  data() {
    return {
      officials: [
        {
          name: 'Hon. Juan Dela Cruz',
          position: 'Barangay Captain',
          description: 'Serving since 2018, focused on infrastructure and youth programs',
        //   image: require('@/assets/officials/captain.jpg')
        },
        {
          name: 'Hon. Maria Santos',
          position: 'Barangay Secretary',
          description: 'Handles documentation and records management',
        //   image: require('@/assets/officials/secretary.jpg')
        },
        {
          name: 'Hon. Pedro Reyes',
          position: 'Barangay Treasurer',
          description: 'Manages barangay funds and financial reports',
        //   image: require('@/assets/officials/treasurer.jpg')
        },
        {
          name: 'Hon. Sofia Martinez',
          position: 'SK Chairman',
          description: 'Leads youth development programs',
        //   image: require('@/assets/officials/sk.jpg')
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  position: relative;
  overflow: hidden;
}

.official-badge .badge {
  font-size: 0.9rem;
}

.about-hero-img {
  position: relative;
  z-index: 1;
}

.about-hero-img img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
}

/* Officials Cards */
.official-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.official-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.official-img-container {
  height: 200px;
  overflow: hidden;
}

.official-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.official-card:hover .official-img-container img {
  transform: scale(1.05);
}

/* Stats Section */
.stat-item {
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .hero-section {
    text-align: center;
  }
  
  .about-hero-img {
    margin-bottom: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
}
</style>