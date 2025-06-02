<template>
  <div class="home">
    <!-- Hero Section with Government Seal -->
    <section class="hero-section bg-primary-gradient">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2 text-lg-start text-center">
            <div class="official-badge mb-3">
              <span class="badge bg-white text-primary py-2 px-3 fw-normal">
                <i class="fas fa-shield-alt me-2"></i> Official Government Portal
              </span>
            </div>
            <h1 class="display-4 fw-bold text-white mb-3">
              BARANGAY <span class="text-warning">PORTAL</span>
            </h1>
            <p class="lead text-white mb-4">
              Digital services platform for residents of <strong>Barangay [Name]</strong>, [City/Municipality]
            </p>
            
            <div class="d-flex flex-wrap justify-content-lg-start justify-content-center gap-3 mb-5 mb-lg-0">
              <router-link 
                to="/services" 
                class="btn btn-warning btn-lg px-4 rounded-pill shadow-sm fw-bold"
              >
                <i class="fas fa-file-alt me-2"></i> Request Documents
              </router-link>
              <router-link 
                v-if="!$store.state.auth.isAuthenticated"
                to="/register" 
                class="btn btn-outline-light btn-lg px-4 rounded-pill fw-bold"
              >
                <i class="fas fa-user-plus me-2"></i> Register Now
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 order-lg-2 order-1 mb-lg-0 mb-4">
            <div class="seal-container position-relative">
              <!-- <img src="@/assets/barangay-seal.png" alt="Barangay Seal" class="img-fluid seal-img"> -->
              <div class="seal-glow"></div>
            </div>
          </div>
        </div>
      </div>
      <br>
      <br>
      <br>
      <br>

      <div class="wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#fff"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#fff"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#fff"></path>
        </svg>
      </div>
    </section>

    <!-- Services Cards with Icons -->
    <section class="services-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">Our Digital Services</h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Access essential barangay services anytime, anywhere through our secure online platform
          </p>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="card service-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                  <i class="fas fa-file-alt fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Barangay Clearance</h3>
                <p class="text-muted mb-3">Request and download official barangay certificates online.</p>
                <router-link to="/services" class="btn btn-link text-primary text-decoration-none fw-bold p-0">
                  Request Now <i class="fas fa-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="card service-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-4">
                  <i class="fas fa-users fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Resident Registration</h3>
                <p class="text-muted mb-3">Register as an official resident of the barangay.</p>
                <router-link to="/register" class="btn btn-link text-success text-decoration-none fw-bold p-0">
                  Register Now <i class="fas fa-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="card service-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-info bg-opacity-10 text-info rounded-circle mx-auto mb-4">
                  <i class="fas fa-calendar-check fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Event Scheduling</h3>
                <p class="text-muted mb-3">View and register for barangay events and activities.</p>
                <router-link to="/events" class="btn btn-link text-info text-decoration-none fw-bold p-0">
                  View Events <i class="fas fa-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="card service-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-4">
                  <i class="fas fa-comment-alt fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Complaints</h3>
                <p class="text-muted mb-3">Submit concerns or complaints to barangay officials.</p>
                <router-link to="/complaints" class="btn btn-link text-warning text-decoration-none fw-bold p-0">
                  File Complaint <i class="fas fa-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Resident Resources Section -->
    <section class="resources-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">Resident Resources</h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Quick access to tools, forms, and information to support our community
          </p>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="card resource-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                  <i class="fas fa-download fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Downloadable Forms</h3>
                <p class="text-muted mb-3">Access forms for clearances, permits, and more in PDF format.</p>
                <a href="/assets/forms" class="btn btn-link text-primary text-decoration-none fw-bold p-0">
                  Download Now <i class="fas fa-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="card resource-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-4">
                  <i class="fas fa-phone-alt fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Emergency Contacts</h3>
                <p class="text-muted mb-3">Key numbers for police, fire, medical, and barangay services.</p>
                <router-link to="/contacts" class="btn btn-link text-success text-decoration-none fw-bold p-0">
                  View Contacts <i class="fas fa-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="card resource-card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div class="card-body p-4 text-center">
                <div class="icon-wrapper bg-info bg-opacity-10 text-info rounded-circle mx-auto mb-4">
                  <i class="fas fa-question-circle fs-3"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">FAQs</h3>
                <p class="text-muted mb-3">Answers to common questions about barangay services.</p>
                <router-link to="/faq" class="btn btn-link text-info text-decoration-none fw-bold p-0">
                  Explore FAQs <i class="fas fa-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="contact-section py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-lg-0 mb-4">
            <h2 class="display-5 fw-bold text-dark mb-3">Need Assistance?</h2>
            <p class="lead text-muted mb-4">
              Our barangay staff is ready to help you with any questions or concerns.
            </p>
            <div class="contact-methods">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-wrapper bg-primary text-white rounded-circle me-3">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 class="h6 fw-bold mb-0">Visit Us</h4>
                  <p class="mb-0 text-muted">Barangay Hall, [Street], [City/Municipality]</p>
                </div>
              </div>
              <div class="d-flex align-items-center mb-3">
                <div class="icon-wrapper bg-primary text-white rounded-circle me-3">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 class="h6 fw-bold mb-0">Call Us</h4>
                  <p class="mb-0 text-muted">(02) 1234-5678 / 0912-345-6789</p>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <div class="icon-wrapper bg-primary text-white rounded-circle me-3">
                  <i class="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 class="h6 fw-bold mb-0">Email Us</h4>
                  <p class="mb-0 text-muted">brgy.portal@example.ph</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card border-0 shadow rounded-3 overflow-hidden">
              <div class="card-body p-4 p-lg-5">
                <h3 class="h4 fw-bold mb-4">Send Us a Message</h3>
                <form>
                  <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Your Name">
                  </div>
                  <div class="mb-3">
                    <input type="email" class="form-control" placeholder="Email Address">
                  </div>
                  <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Subject">
                  </div>
                  <div class="mb-3">
                    <textarea class="form-control" rows="4" placeholder="Your Message"></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Send Message</button>
                </form>
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
  name: 'Home',
  components: {
    Chatbot
  },
}
</script>

<style scoped>
/* Modern gradient background */
.hero-section {
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
}

/* Official badge style */
.official-badge {
  font-size: 0.9rem;
}

/* Seal/emblem styling */
.seal-container {
  max-width: 300px;
  margin: 0 auto;
}
.seal-img {
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  z-index: 2;
  position: relative;
}
.seal-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  top: 0;
  left: 0;
  z-index: 1;
}

/* Wave divider */
.wave-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}
.wave-divider svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 100px;
}

/* Service cards */
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
.icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* News cards */
.news-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
.news-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(26, 58, 143, 0.2) 100%);
  z-index: 1;
}

/* Resource cards */
.resource-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* Contact section */
.contact-methods .icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0;
  }
  .display-4 {
    font-size: 2.5rem;
  }
  .news-section, .resources-section {
    padding: 3rem 0;
  }
}
</style>