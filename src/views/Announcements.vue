<template>
  <div class="announcements-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary-gradient py-5">
      <div class="container py-4 py-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2 text-lg-start text-center">
            <div class="official-badge mb-3">
              <span class="badge bg-white text-primary py-2 px-3 fw-normal">
                <i class="bi bi-megaphone me-2"></i> Community Updates
              </span>
            </div>
            <h1 class="display-4 fw-bold text-white mb-3">
            <span class="text-warning">Announcements</span>
            </h1>
            <p class="lead text-white mb-4">
              Stay informed about important news and events in <strong>Barangay [Name]</strong>
            </p>
          </div>
          <div class="col-lg-6 order-lg-2 order-1 mb-lg-0 mb-4">
          </div>
        </div>
      </div>
    </section>

    <!-- Announcements List -->
    <section class="announcements-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-dark mb-3">
            <i class=" text-primary me-2"></i> Latest Announcements
          </h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Important updates, events, and notices from the barangay
          </p>
        </div>
        
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Announcement Cards -->
            <div class="announcement-card card mb-4 border-0 shadow-sm rounded-3 overflow-hidden" 
                 v-for="(announcement, index) in announcements" :key="index">
              <div class="card-body p-4">
                <div class="d-flex align-items-start">
                  <div class="announcement-date bg-primary bg-opacity-10 text-primary rounded-2 p-3 text-center me-4">
                    <div class="fw-bold fs-4">{{ announcement.date.day }}</div>
                    <div class="small text-uppercase">{{ announcement.date.month }}</div>
                    <div class="small">{{ announcement.date.year }}</div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h3 class="h4 fw-bold mb-0">{{ announcement.title }}</h3>
                      <span class="badge rounded-pill" 
                            :class="`bg-${announcement.type.color}-subtle text-${announcement.type.color}-emphasis`">
                        {{ announcement.type.label }}
                      </span>
                    </div>
                    <p class="text-muted mb-3">{{ announcement.summary }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-muted small">
                        <i class="bi bi-person-fill me-1"></i> Posted by: {{ announcement.postedBy }}
                      </span>
                      <button class="btn btn-sm btn-outline-primary rounded-pill" 
                              data-bs-toggle="modal" 
                              :data-bs-target="`#announcementModal${index}`">
                        Read More <i class="bi bi-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <nav aria-label="Announcements pagination" class="mt-5">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                  <a class="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcement Modals -->
    <div v-for="(announcement, index) in announcements" :key="`modal-${index}`" 
         class="modal fade" :id="`announcementModal${index}`" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ announcement.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex align-items-center mb-4">
              <div class="announcement-date-sm bg-primary bg-opacity-10 text-primary rounded-2 p-2 text-center me-3">
                <div class="fw-bold">{{ announcement.date.day }}</div>
                <div class="small text-uppercase">{{ announcement.date.month }}</div>
              </div>
              <div>
                <p class="mb-1 small text-muted">
                  <i class="bi bi-person-fill me-1"></i> Posted by: {{ announcement.postedBy }}
                </p>
                <span class="badge rounded-pill small" 
                      :class="`bg-${announcement.type.color}-subtle text-${announcement.type.color}-emphasis`">
                  {{ announcement.type.label }}
                </span>
              </div>
            </div>
            
            <div class="announcement-content mb-4">
              <p>{{ announcement.fullContent }}</p>
              
              <div v-if="announcement.attachments.length > 0" class="mt-4">
                <h6 class="fw-bold mb-3">Attachments:</h6>
                <div class="d-flex flex-wrap gap-2">
                  <a v-for="(file, fileIndex) in announcement.attachments" :key="fileIndex" 
                     href="#" class="btn btn-sm btn-outline-secondary rounded-pill">
                    <i class="bi me-2" :class="getFileIcon(file.type)"></i>
                    {{ file.name }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary rounded-pill">
              <i class="bi bi-share me-1"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
        <!-- Add this at the bottom of your template, before the closing </div> -->
<Chatbot />

  </div>
</template>

<script>
import Chatbot from '@/components/Chatbot.vue';

export default {
  name: 'AnnouncementsPage',
    components: {
    Chatbot
  },
  data() {
    return {
      announcements: [
        {
          title: 'Community Clean-up Drive',
          summary: 'Join us for our monthly clean-up activity this Saturday at the barangay plaza',
          fullContent: 'The Barangay Council invites all residents to participate in our monthly community clean-up drive this coming Saturday, June 10, from 7:00 AM to 11:00 AM at the Barangay Plaza. We will be cleaning the main streets and public areas. Please bring your own cleaning materials (broom, rake, gloves). Snacks will be provided to all participants. This is part of our "Clean and Green Barangay" program. Your cooperation is highly appreciated.',
          date: { day: '05', month: 'Jun', year: '2023' },
          postedBy: 'Barangay Secretary',
          type: { label: 'Event', color: 'success' },
          attachments: [
            { name: 'Clean-up Schedule.pdf', type: 'pdf' },
            { name: 'Participant Form.docx', type: 'word' }
          ]
        },
        {
          title: 'Water Interruption Notice',
          summary: 'Scheduled water service interruption on June 8, 9:00 AM to 3:00 PM',
          fullContent: 'Please be advised that there will be a scheduled water service interruption on June 8, 2023, from 9:00 AM to 3:00 PM due to pipeline maintenance work by the Municipal Water District. Affected areas include Zones 1, 2, and 3. We recommend storing enough water for your household needs during this period. For emergency water needs, the barangay will provide temporary water stations at the following locations: (1) Barangay Hall, (2) Zone 1 Basketball Court, (3) Near the Elementary School. We apologize for the inconvenience and thank you for your understanding.',
          date: { day: '01', month: 'Jun', year: '2023' },
          postedBy: 'Barangay Captain',
          type: { label: 'Public Service', color: 'info' },
          attachments: [
            { name: 'Affected Areas.jpg', type: 'image' }
          ]
        },
        {
          title: 'New Barangay Ordinance No. 2023-05',
          summary: 'Implementation of new parking regulations effective July 1, 2023',
          fullContent: 'The Barangay Council has approved Ordinance No. 2023-05, "An Ordinance Regulating Parking Along Major Roads and Public Spaces in Barangay [Name]". Key provisions include: (1) No parking along narrow roads (less than 5 meters wide), (2) Designated parking areas in each zone, (3) No overnight parking of trucks and heavy vehicles in residential areas, (4) Penalties for violations starting at ₱500 for first offense. The full ordinance is available at the Barangay Hall and on our official website. This will take effect on July 1, 2023, to give residents time to adjust. Public consultations will be held on June 15 and 22 at the Barangay Hall.',
          date: { day: '28', month: 'May', year: '2023' },
          postedBy: 'Barangay Council',
          type: { label: 'Ordinance', color: 'warning' },
          attachments: [
            { name: 'Ordinance 2023-05.pdf', type: 'pdf' },
            { name: 'Parking Map.pdf', type: 'pdf' }
          ]
        }
      ]
    }
  },
  methods: {
    getFileIcon(fileType) {
      const icons = {
        pdf: 'bi-file-earmark-pdf',
        word: 'bi-file-earmark-word',
        image: 'bi-file-image',
        excel: 'bi-file-earmark-excel'
      }
      return icons[fileType] || 'bi-file-earmark-text'
    }
  }
}
</script>

<style scoped>
/* Hero Section - Consistent with other pages */
.hero-section {
  background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  position: relative;
  overflow: hidden;
}

.official-badge .badge {
  font-size: 0.9rem;
}

.announcements-hero-img {
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

/* Announcement Cards */
.announcement-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.announcement-date {
  min-width: 70px;
  transition: all 0.3s ease;
}

.announcement-card:hover .announcement-date {
  background-color: rgba(13, 110, 253, 0.2) !important;
}

.announcement-date-sm {
  min-width: 60px;
}

/* Pagination */
.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-link {
  color: #0d6efd;
}

/* Modal Styles */
.modal-content {
  border-radius: 0.5rem;
  border: none;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .hero-section {
    text-align: center;
  }
  
  .announcements-hero-img {
    margin-bottom: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }

  .announcement-date {
    min-width: 60px;
    padding: 1rem !important;
    margin-right: 1rem !important;
  }
}

@media (max-width: 575.98px) {
  .announcement-card .d-flex {
    flex-direction: column;
  }

  .announcement-date {
    margin-right: 0 !important;
    margin-bottom: 1rem;
    align-self: flex-start;
  }
}
</style>