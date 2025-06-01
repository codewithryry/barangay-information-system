<template>
  <div class="services-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary-gradient py-5">
      <div class="container py-4 py-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2 text-lg-start text-center">
            <div class="official-badge mb-3">
              <span class="badge bg-white text-primary py-2 px-3 fw-normal">
                <i class="bi bi-list-check me-2"></i> Our Services
              </span>
            </div>
            <h1 class="display-4 fw-bold text-white mb-3">
             <span class="text-warning">Services</span>
            </h1>
            <p class="lead text-white mb-4">
              Quality services for all residents of <strong>Barangay [Name]</strong>
            </p>
          </div>
          <div class="col-lg-6 order-lg-2 order-1 mb-lg-0 mb-4">

          </div>
        </div>
      </div>
    </section>

    <!-- Services List -->
    <section class="services-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">
            <i class=" text-primary me-2"></i> Available Services
          </h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            We provide various services to meet the needs of our community members
          </p>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="(service, index) in services" :key="index">
            <div class="card service-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4">
                <div class="service-icon mb-3 text-primary">
                  <i :class="`bi ${service.icon} display-6`"></i>
                </div>
                <h3 class="h4 fw-bold mb-3">{{ service.title }}</h3>
                <p class="text-muted mb-4">{{ service.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 small">
                    {{ service.category }}
                  </span>
                  <router-link to="/services/request" class="btn btn-sm btn-primary rounded-pill">
                    Request <i class="bi bi-arrow-right ms-1"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Avail -->
    <section class="process-section py-5 bg-white">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">
            <i class=" text-primary me-2"></i> How to Avail Our Services
          </h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Simple steps to request barangay services
          </p>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" v-for="(step, index) in processSteps" :key="index">
            <div class="card process-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body text-center p-4">
                <div class="process-number mb-3">
                  <span class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    {{ step.number }}
                  </span>
                </div>
                <h3 class="h5 fw-bold mb-3">{{ step.title }}</h3>
                <p class="text-muted small">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      
<Chatbot />

  </div>
</template>

<script>
import Chatbot from '@/components/Chatbot.vue';
export default {
  name: 'ServicesPage',
   components: {
    Chatbot
  },
  data() {
    return {
      services: [
        {
          title: 'Barangay Clearance',
          description: 'Official document certifying residency and good standing in the barangay',
          icon: 'bi-file-earmark-text',
          category: 'Document'
        },
        {
          title: 'Business Permit',
          description: 'Required for operating businesses within barangay jurisdiction',
          icon: 'bi-shop',
          category: 'Business'
        },
        {
          title: 'Community Tax Certificate',
          description: 'Also known as Cedula, required for various transactions',
          icon: 'bi-receipt',
          category: 'Document'
        },
        {
          title: 'Indigency Certificate',
          description: 'Certification for availing government assistance programs',
          icon: 'bi-heart',
          category: 'Social Services'
        },
        {
          title: 'Barangay ID',
          description: 'Identification card for barangay residents',
          icon: 'bi-person-badge',
          category: 'Document'
        },
        {
          title: 'Complaint Assistance',
          description: 'Mediation and assistance for community disputes',
          icon: 'bi-people',
          category: 'Legal'
        }
      ],
      processSteps: [
        {
          number: 1,
          title: 'Check Requirements',
          description: 'Review the necessary documents for your requested service'
        },
        {
          number: 2,
          title: 'Visit Barangay Hall',
          description: 'Go to our office during business hours (8AM-5PM, Mon-Fri)'
        },
        {
          number: 3,
          title: 'Submit Request',
          description: 'Fill out the application form and submit with requirements'
        },
        {
          number: 4,
          title: 'Receive Service',
          description: 'Get your requested document or service after processing'
        }
      ],
      requirements: [
        'Valid government-issued ID (original and photocopy)',
        'Proof of residency (utility bill, lease contract, etc.)',
        'Fully accomplished application form',
        'Community Tax Certificate (Cedula) for some services',
        'Other specific requirements depending on the service requested'
      ]
    }
  }
}
</script>

<style scoped>
/* Hero Section - Reusing from About page */
.hero-section {
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  position: relative;
  overflow: hidden;
}

.official-badge .badge {
  font-size: 0.9rem;
}

.services-hero-img {
  position: relative;
  z-index: 1;
  height: 300px;
  background-color: #e9ecef;
  border-radius: 0.5rem;
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

/* Service Cards */
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.service-icon i {
  transition: transform 0.3s ease;
}

.service-card:hover .service-icon i {
  transform: scale(1.1);
}

/* Process Cards */
.process-card {
  transition: transform 0.3s ease;
}

.process-card:hover {
  transform: translateY(-5px);
}

.process-number span {
  transition: all 0.3s ease;
}

.process-card:hover .process-number span {
  background-color: #0d6efd !important;
  transform: scale(1.1);
}

/* Requirements List */
.list-group-item {
  border-left: 0;
  border-right: 0;
  transition: background-color 0.2s ease;
}

.list-group-item:hover {
  background-color: rgba(13, 110, 253, 0.05) !important;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .hero-section {
    text-align: center;
  }
  
  .services-hero-img {
    margin-bottom: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
}
</style>