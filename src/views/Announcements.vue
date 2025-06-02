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
            <i class="bi bi-megaphone text-primary me-2"></i> Latest Announcements
          </h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Important updates, events, and notices from the barangay
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <p>Loading announcements...</p>
        </div>
        <!-- Error State -->
        <div v-else-if="error" class="text-center text-danger">
          <p>{{ error }}</p>
        </div>
        <!-- Announcements Display -->
        <div v-else class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Announcement Cards -->
            <div
              class="announcement-card card mb-4 border-0 shadow-sm rounded-3 overflow-hidden"
              v-for="(announcement, index) in paginatedAnnouncements"
              :key="announcement.id"
            >
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
                      <span
                        class="badge rounded-pill"
                        :class="`bg-${announcement.type.color}-subtle text-${announcement.type.color}-emphasis`"
                      >
                        {{ announcement.type.label }}
                        <i v-if="announcement.isImportant" class="bi bi-exclamation-circle ms-1"></i>
                      </span>
                    </div>
                    <p class="text-muted mb-3">{{ announcement.summary }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-muted small">
                        <i class="bi bi-person-fill me-1"></i> Posted by: {{ announcement.postedBy }}
                      </span>
                      <button
                        class="btn btn-sm btn-outline-primary rounded-pill"
                        data-bs-toggle="modal"
                        :data-bs-target="`#announcementModal${index}`"
                      >
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
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                </li>
                <li
                  class="page-item"
                  v-for="page in totalPages"
                  :key="page"
                  :class="{ active: page === currentPage }"
                >
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcement Modals -->
    <div
      v-for="(announcement, index) in paginatedAnnouncements"
      :key="`modal-${announcement.id}`"
      class="modal fade"
      :id="`announcementModal${index}`"
      tabindex="-1"
      aria-hidden="true"
    >
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
                <span
                  class="badge rounded-pill small"
                  :class="`bg-${announcement.type.color}-subtle text-${announcement.type.color}-emphasis`"
                >
                  {{ announcement.type.label }}
                  <i v-if="announcement.isImportant" class="bi bi-exclamation-circle ms-1"></i>
                </span>
              </div>
            </div>

            <div class="announcement-content mb-4">
              <div
                v-if="announcement.fullContent && isValidContent(announcement.fullContent)"
                v-html="formatContent(announcement.fullContent)"
                class="formatted-content"
              ></div>
              <p v-else class="text-muted">
                No content available for this announcement.
              </p>

              <div v-if="announcement.attachments.length > 0" class="mt-4">
                <h6 class="fw-bold mb-3">Attachments:</h6>
                <div class="d-flex flex-wrap gap-2">
                  <a
                    v-for="(file, fileIndex) in announcement.attachments"
                    :key="fileIndex"
                    :href="file.url || '#'"
                    class="btn btn-sm btn-outline-secondary rounded-pill"
                    target="_blank"
                  >
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

    <!-- Chatbot Component -->
    <Chatbot />
  </div>
</template>

<script>
import DOMPurify from 'dompurify';
import Chatbot from '@/components/Chatbot.vue';
import { db } from '@/firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'AnnouncementsPage',
  components: {
    Chatbot,
  },
  props: {
    currentUserId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'resident',
    },
  },
  data() {
    return {
      announcements: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 3,
      adminNameCache: {}, // Cache for admin names to optimize performance
    };
  },
  computed: {
    paginatedAnnouncements() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.announcements.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.announcements.length / this.itemsPerPage);
    },
  },
  methods: {
    formatAdminId(adminId) {
      if (!adminId || adminId === 'Unknown') {
        return 'Unknown';
      }
      // Display first 4 characters, asterisks for the middle, and last 2 characters
      const firstPart = adminId.slice(0, 4);
      const lastPart = adminId.slice(-2);
      const middleLength = adminId.length - 6; // Total length minus first 4 and last 2
      const middlePart = middleLength > 0 ? '*'.repeat(middleLength) : '';
      return `${firstPart}${middlePart}${lastPart}`;
    },
    async fetchAdminName(adminId) {
      if (this.adminNameCache[adminId]) {
        return this.adminNameCache[adminId]; // Return cached name
      }
      try {
        const adminDocRef = doc(db, 'admin_profiles', adminId);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          const name = adminData.name || this.formatAdminId(adminId); // Use formatted adminId if name is not available
          this.adminNameCache[adminId] = name; // Cache the name
          return name;
        }
        const formattedId = this.formatAdminId(adminId);
        this.adminNameCache[adminId] = formattedId;
        return formattedId;
      } catch (error) {
        console.error(`Failed to fetch admin name for ID ${adminId}:`, error);
        const formattedId = this.formatAdminId(adminId);
        this.adminNameCache[adminId] = formattedId;
        return formattedId;
      }
    },
    // Method to check if content is valid (not empty or gibberish)
    isValidContent(content) {
      if (!content || content.trim() === '') return false;
      // Basic check for gibberish (e.g., "klskdnxcnxcv" with no spaces or punctuation)
      const gibberishRegex = /^[a-zA-Z0-9]+$/;
      return !gibberishRegex.test(content.trim()) || content.length > 20;
    },
    // Method to format content (convert newlines to <br> and sanitize)
formatContent(content) {
  if (!content) return '';
  // Split content into lines
  let lines = content.split('\n').filter(line => line.trim());
  let formattedLines = lines.map(line => {
    // Handle bullet points (e.g., ✅ or 📌)
    if (line.startsWith('✅') || line.startsWith('📌')) {
      return `<li class="list-item">${line.replace(/^(\✅|📌)\s*/, '')}</li>`;
    }
    // Handle headers (e.g., lines with "Reminders:" or starting with "—")
    if (line.includes('Reminders:') || line.startsWith('—')) {
      return `<p class="fw-bold mt-3">${line.replace(/^—\s*/, '')}</p>`;
    }
    // Default: Wrap in paragraph tags
    return `<p>${line}</p>`;
  });
  // Wrap bullet points in <ul> if they exist
  let formatted = formattedLines.join('');
  if (formatted.includes('<li')) {
    formatted = formatted.replace(/(<li[^>]*>.*?<\/li>)/g, '<ul class="list-unstyled">$1</ul>');
  }
  // Clean up multiple <br> tags
  formatted = formatted.replace(/(<br>){2,}/g, '<br>');
  // Sanitize with DOMPurify if available
  if (typeof DOMPurify !== 'undefined') {
    return DOMPurify.sanitize(formatted, { ALLOWED_TAGS: ['p', 'br', 'ul', 'li', 'strong', 'em'] });
  }
  return formatted.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+="[^"]*"/gi, '');
},
    async fetchAnnouncements() {
      this.loading = true;
      this.error = null;
      try {
        const snapshot = await getDocs(collection(db, 'announcements'));
        const announcementsPromises = snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date();
          const adminId = data.adminId || 'Unknown';
          const postedBy = await this.fetchAdminName(adminId);
          return {
            id: doc.id,
            title: data.title || 'Untitled Announcement',
            summary: data.summary || data.content?.substring(0, 100) + '...' || 'No summary available',
            fullContent: data.content || 'No content available',
            postedBy, // Uses formatted adminId (e.g., 3j6V****lyLNsQw1) if name is unavailable
            type: data.type || { label: 'General', color: 'primary' },
            attachments: data.attachments || [],
            isImportant: data.isImportant || false,
            recipientIds: data.recipientIds || [],
            date: {
              day: createdAt.getDate().toString().padStart(2, '0'),
              month: createdAt.toLocaleString('en-US', { month: 'short' }),
              year: createdAt.getFullYear().toString(),
            },
          };
        });

        this.announcements = (await Promise.all(announcementsPromises))
          .filter((a) => !a.recipientIds.length || a.recipientIds.includes(this.currentUserId))
          .sort((a, b) => {
            const dateA = new Date(a.date.year, new Date(a.date.month + ' 1').getMonth(), a.date.day);
            const dateB = new Date(b.date.year, new Date(b.date.month + ' 1').getMonth(), b.date.day);
            return dateB - dateA;
          });
      } catch (error) {
        console.error('Failed to load announcements:', error);
        this.error = 'Could not load announcements';
      } finally {
        this.loading = false;
      }
    },
    getFileIcon(fileType) {
      const icons = {
        pdf: 'bi-file-earmark-pdf',
        word: 'bi-file-earmark-word',
        image: 'bi-file-image',
        excel: 'bi-file-earmark-excel',
      };
      return icons[fileType] || 'bi-file-earmark-text';
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchAnnouncements();
  },
};
</script>

<style scoped>
.formatted-content ul.list-unstyled {
  padding-left: 20px;
}

.formatted-content ul.list-unstyled li {
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
}

.formatted-content ul.list-unstyled li::before {
  content: '✔';
  position: absolute;
  left: 0;
  color: #0d6efd;
  font-weight: bold;
}

.formatted-content p.fw-bold {
  color: #333;
}

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

/* Styles for formatted content */
.formatted-content {
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
}

/* Ensure text-muted for fallback message is styled consistently */
.text-muted {
  font-style: italic;
  font-size: 0.95rem;
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