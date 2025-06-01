<template>
  <footer class="modern-footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand">
          <div class="brand-wrapper">
            <span class="brand-text">Barangay Portal</span>
          </div>
          <p class="brand-description">
            The official digital services platform of Barangay [Name], [City/Municipality].
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Messenger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.36 2 2 6.136 2 11.5c0 2.497 1.056 4.744 2.756 6.306V22l3.254-1.81c.88.26 1.81.41 2.79.41 5.64 0 10-4.136 10-9.5C22 6.136 17.64 2 12 2zm.938 13.5h-1.876V12.5H7.5V10.5h3.562V7h1.876v3.5H16.5v2h-3.562v3z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-links">
          <h3 class="footer-heading">Services</h3>
          <ul class="footer-nav">
            <li class="footer-nav-item">
              <router-link to="/services" class="footer-nav-link">
                Document Requests
              </router-link>
            </li>
            <li class="footer-nav-item">
              <router-link to="/complaints" class="footer-nav-link">
                File Complaints
              </router-link>
            </li>
            <li class="footer-nav-item">
              <router-link to="/events" class="footer-nav-link">
                Public Events
              </router-link>
            </li>
            <li class="footer-nav-item">
              <router-link to="/announcements" class="footer-nav-link">
                Announcements
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div class="footer-info">
          <h3 class="footer-heading">Information</h3>
          <ul class="footer-contact">
            <li class="contact-item">
              <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>Barangay Hall, [Street], [City]</span>
            </li>
            <li class="contact-item">
              <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              <span>(02) 1234-5678</span>
            </li>
            <li class="contact-item">
              <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>brgy.portal@example.ph</span>
            </li>
            <li class="contact-item">
              <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>

        <div class="footer-newsletter">
          <h3 class="footer-heading">Stay Updated</h3>
          <p class="newsletter-text">
            Subscribe to our newsletter for the latest announcements and updates.
          </p>
          <!-- <div class="newsletter-form">
            <input 
              type="email" 
              class="newsletter-input" 
              placeholder="Your email" 
              aria-label="Your email"
            >
            <button class="newsletter-button" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div> -->
          <!-- <p class="newsletter-disclaimer">
            We respect your privacy. Unsubscribe at any time.
          </p> -->
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} Barangay [Name]. All rights reserved.
        </div>
        <div class="legal-links">
          <router-link to="/privacy" class="legal-link">
            Privacy Policy
          </router-link>
          <router-link to="/terms" class="legal-link">
            Terms of Service
          </router-link>
          <router-link to="/sitemap" class="legal-link">
            Sitemap
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ModernFooter'
}
</script>

<style scoped>
/* Base Styles */
.modern-footer {
background: linear-gradient(135deg, #1a3a8f 0%, #0d6efd 100%);
  color: rgba(255, 255, 255, 0.8);
  padding: 3rem 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Footer Grid Layout */
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
}

/* Brand Section */
.footer-brand {
  grid-column: 1 / -1;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(to right, #fff, #a7c7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-description {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Footer Sections */
.footer-heading {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Links Section */
.footer-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
  position: relative;
}

.footer-nav-link:hover {
  color: white;
}

.footer-nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: white;
  transition: width 0.3s ease;
}

.footer-nav-link:hover::after {
  width: 100%;
}

/* Contact Info */
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.contact-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.7);
}

/* Newsletter */
.newsletter-text {
  margin-bottom: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
}

.newsletter-form {
  display: flex;
  margin-bottom: 0.75rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-right: none;
  border-radius: 6px 0 0 6px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.newsletter-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.newsletter-button {
  padding: 0 1.25rem;
  background: linear-gradient(135deg, #3a5ccc 0%, #1e3c8f 100%);
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.newsletter-button:hover {
  background: linear-gradient(135deg, #4a6cdc 0%, #2e4c9f 100%);
}

.newsletter-disclaimer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive Adjustments */
@media (min-width: 640px) {
  .footer-brand {
    grid-column: span 2;
  }
  
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .footer-brand {
    grid-column: span 1;
  }
  
  .footer-links {
    grid-column: span 1;
  }
  
  .footer-info {
    grid-column: span 1;
  }
  
  .footer-newsletter {
    grid-column: span 1;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    gap: 3rem;
  }
  
  .footer-brand {
    padding-right: 2rem;
  }
}
</style>