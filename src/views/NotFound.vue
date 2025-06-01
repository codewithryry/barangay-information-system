<template>
  <div class="not-found">
    <div class="error-content">
      <div class="barangay-branding">
        <svg class="barangay-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2L4 7v10l8 5 8-5V7L12 2zm0 2.5L18 8v8l-6 3.5-6-3.5V8l6-3.5z"/>
          <path d="M12 11a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
        <span class="system-name">Barangay Information System</span>
      </div>

      <div class="error-message">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you're looking for isn't in our barangay records.
          It may have been moved or archived.
        </p>
      </div>

      <div class="action-section">
        <router-link to="/" class="home-link">
          Return to Dashboard
        </router-link>

        <div class="contact-prompt">
          Need help? Contact the <strong>Barangay Office</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  mounted() {
    document.title = "404 Not Found | Barangay Information System";
  },
};
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e6f0f5 100%);
  padding: 2rem;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1a365d;
  text-align: center;
}

.barangay-branding {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}

.barangay-icon {
  width: 40px;
  height: 40px;
  fill: #1e5f8c;
  margin-right: 12px;
}

.system-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c5282;
}

.error-message {
  margin-bottom: 3rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #1e5f8c;
  font-weight: 800;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  margin: 0.5rem 0 1.5rem;
  font-weight: 600;
  color: #2c5282;
}

p {
  font-size: 1.1rem;
  color: #4a5568;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.home-link {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
  color: white;
  padding: 0.75rem 1.75rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(50, 115, 220, 0.25);
}

.home-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(50, 115, 220, 0.3);
  background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
}

.home-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.contact-prompt {
  font-size: 0.95rem;
  color: #718096;
}

@media (max-width: 480px) {
  h1 {
    font-size: 4rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .barangay-branding {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .barangay-icon {
    margin-right: 0;
  }
}
</style>