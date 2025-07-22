<template>
  <div class="maintenance-container">
    <div class="glass-card">
      <div class="header">
        <div class="logo-container">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2L4 7v10l8 5 8-5V7L12 2zm0 2.5L18 8v8l-6 3.5-6-3.5V8l6-3.5z"/>
            <path fill="currentColor" d="M12 11a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <span class="system-name">Barangay Information System</span>
        </div>
      </div>

      <div class="main-content">
        <div class="icon-container">
          <svg class="maintenance-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5z"/>
            <path fill="currentColor" d="M12 15a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </div>
        
        <h1 class="title">System Maintenance</h1>
        <h2 class="subtitle">We're upgrading your experience</h2>
        
        <div class="message-box">
          <p class="message">
            {{ maintenanceMessage || 'Our system is currently undergoing scheduled maintenance to bring you improved services and features.' }}
          </p>
          <div class="time-estimate" v-if="maintenanceEstimate">
            <svg class="clock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
              <path fill="currentColor" d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
            <span>Estimated completion: <strong>{{ maintenanceEstimate }}</strong></span>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="contact-card">
          <div class="contact-header">
            <svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <h3>Need immediate assistance?</h3>
          </div>
          <div class="contact-info">
            <div class="contact-item">
              <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/>
              </svg>
              <span>Visit Barangay Hall during office hours (8AM-5PM)</span>
            </div>
            <div class="contact-item">
              <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              <span>Call us at <strong>(02) 123-4567</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="background-shapes">
      <div class="shape circle"></div>
      <div class="shape triangle"></div>
      <div class="shape square"></div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default {
  name: "UnderMaintenance",
  data() {
    return {
      maintenanceMessage: '',
      maintenanceEstimate: '',
      showProgress: true,
      progress: 0,
      progressInterval: null
    };
  },
  async mounted() {
    document.title = "Under Maintenance | Barangay Information System";
    
    // Simulate progress animation
    this.progressInterval = setInterval(() => {
      if (this.progress < 85) {
        this.progress += Math.floor(Math.random() * 5) + 1;
      } else if (this.progress < 95) {
        this.progress += 1;
      }
    }, 1000);
    
    try {
      const maintenanceDoc = await getDoc(doc(db, 'system', 'maintenance'));
      if (maintenanceDoc.exists()) {
        const data = maintenanceDoc.data();
        this.maintenanceMessage = data.message;
        this.maintenanceEstimate = data.estimatedCompletion;
        this.showProgress = data.showProgress !== false;
      }
    } catch (err) {
      console.error('Error loading maintenance info:', err);
    }
  },
  beforeUnmount() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.maintenance-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e8f5 100%);
  position: relative;
  overflow: hidden;
}



.header {
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 36px;
  height: 36px;
  color: #2b6cb0;
}

.system-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c5282;
  letter-spacing: -0.5px;
}

.main-content {
  text-align: center;
  margin-bottom: 2.5rem;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.maintenance-icon {
  width: 80px;
  height: 80px;
  color: #dd6b20;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  color: #4a5568;
  margin: 0 0 2rem;
  opacity: 0.9;
}

.message-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.message {
  font-size: 1.05rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

.progress-container {
  background: #edf2f7;
  border-radius: 8px;
  height: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #4299e1 0%, #3182ce 100%);
  border-radius: 8px;
  transition: width 0.5s ease;
}

.progress-text {
  display: block;
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.5rem;
}

.time-estimate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #4a5568;
  background: #fffaf0;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #dd6b20;
}

.clock-icon {
  width: 18px;
  height: 18px;
  color: #dd6b20;
}

.footer {
  margin-top: 2rem;
}

.contact-card {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  text-align: left;
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.contact-icon {
  width: 24px;
  height: 24px;
}

.contact-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.info-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.shape {
  position: absolute;
  opacity: 0.1;
}

.circle {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: #4299e1;
  top: -100px;
  right: -100px;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-bottom: 260px solid #dd6b20;
  bottom: -150px;
  left: -50px;
  transform: rotate(15deg);
}

.square {
  width: 200px;
  height: 200px;
  background: #38a169;
  bottom: 50px;
  right: -50px;
  transform: rotate(45deg);
}

@media (max-width: 640px) {
  .glass-card {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .logo-container {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .maintenance-icon {
    width: 60px;
    height: 60px;
  }
  
  .contact-card {
    padding: 1.25rem;
  }
}
</style>