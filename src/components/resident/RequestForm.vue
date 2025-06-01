<template>
    <br>
    <br>
  <div class="request-wrapper">
    <div class="request-header">
      <div class="header-content">
        <h1 class="request-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Document Request
        </h1>
        <p class="request-subtitle">Fill out the form to request official documents</p>
      </div>
    </div>

    <div class="request-content">
      <div class="request-card">
        <div class="card-body">
          <form @submit.prevent="submitRequest" class="request-form">
            <div class="form-group">
              <label class="form-label">Request Type</label>
              <div class="select-wrapper">
                <select 
                  v-model="request.type" 
                  class="form-select"
                  required
                >
                  <option value="" disabled selected>Select document type</option>
                  <option value="barangay-clearance">Barangay Clearance</option>
                  <option value="barangay-id">Barangay ID</option>
                  <option value="certificate-of-residency">Certificate of Residency</option>
                  <option value="business-permit">Business Permit</option>
                  <option value="other">Other</option>
                </select>
                <div class="select-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            
            <div v-if="request.type === 'other'" class="form-group">
              <label class="form-label">Specify Document</label>
              <input 
                v-model="request.otherType" 
                type="text" 
                class="form-input"
                placeholder="Enter document name"
                required
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Purpose</label>
              <textarea 
                v-model="request.purpose" 
                class="form-textarea"
                rows="4"
                placeholder="Explain why you need this document"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Additional Notes (Optional)</label>
              <textarea 
                v-model="request.notes" 
                class="form-textarea"
                rows="3"
                placeholder="Any additional information that might help process your request"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="submit-button"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">

                  Submit Request
                </span>
                <span v-else>

                  Processing...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-content">
          <div class="success-message">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Request Submitted Successfully!</h3>
            <div class="request-id-display">
              <span>Request ID:</span>
              <strong>{{ requestId }}</strong>
            </div>
            <p class="instructions">You can track your request status in your dashboard or using the request ID above.</p>
            <div class="modal-actions">
              <button @click="closeModal" class="modal-button secondary">
                Return to Form
              </button>
              <router-link 
                to="/resident/requests" 
                class="modal-button primary"
                @click.native="closeModal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                View My Requests
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default {
  name: 'DocumentRequest',
  data() {
    return {
      request: {
        type: '',
        otherType: '',
        purpose: '',
        notes: ''
      },
      isSubmitting: false,
      requestId: '',
      showSuccessModal: false,
      currentUser: null
    }
  },
  created() {
    const auth = getAuth()
    this.currentUser = auth.currentUser
  },
  methods: {
    generateRequestId() {
      const prefix = 'BRGY'
      const now = new Date()
      const datePart = now.getFullYear().toString().substr(-2) + 
                      (now.getMonth() + 1).toString().padStart(2, '0') + 
                      now.getDate().toString().padStart(2, '0')
      const randomPart = Math.floor(1000 + Math.random() * 9000)
      return `${prefix}-${datePart}-${randomPart}`
    },
    async submitRequest() {
      try {
        this.isSubmitting = true
        
        // Generate request ID
        this.requestId = this.generateRequestId()
        
        // Prepare request data
        const requestData = {
          id: this.requestId,
          userId: this.currentUser.uid,
          userName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
          documentType: this.request.type === 'other' ? this.request.otherType : this.request.type,
          purpose: this.request.purpose,
          notes: this.request.notes || 'None',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true
        }

        // Save to Firestore
        await addDoc(collection(db, 'requests'), requestData)
        
        // Show success modal
        this.showSuccessModal = true
        this.isSubmitting = false
        
        // Reset form
        this.resetForm()
        
      } catch (error) {
        console.error('Error submitting request:', error)
        this.isSubmitting = false
        // Here you could show an error message to the user
      }
    },
    resetForm() {
      this.request = {
        type: '',
        otherType: '',
        purpose: '',
        notes: ''
      }
    },
    closeModal() {
      this.showSuccessModal = false
    }
  }
}
</script>

<style scoped>
.request-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.request-header {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  color: white;
  padding: 3rem 2rem 4rem;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.request-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
}

.request-title svg {
  width: 36px;
  height: 36px;
}

.request-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0;
  font-weight: 400;
}

.request-content {
  max-width: 800px;
  margin: -3rem auto 0;
  padding: 0 2rem 3rem;
  position: relative;
}

.request-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.request-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.95rem;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.3);
  background: white;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #64748b;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.3);
  background: white;
}

.form-textarea {
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  margin-top: 1rem;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.submit-button:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.submit-button svg {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  width: 90%;
  max-width: 500px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  animation: slideUp 0.4s ease-out;
}

.success-message {
  text-align: center;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-icon svg {
  color: #10b981;
}

.success-message h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #064e3b;
}

.request-id-display {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
  font-size: 1.1rem;
}

.request-id-display strong {
  color: #065f46;
  font-size: 1.2rem;
  display: inline-block;
  margin-top: 0.5rem;
}

.instructions {
  color: #4b5563;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-button.primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  text-decoration: none;
}

.modal-button.primary:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.modal-button.secondary {
  background: white;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
}

.modal-button.secondary:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .request-header {
    padding: 2rem 1.5rem 3rem;
  }
  
  .request-content {
    padding: 0 1.5rem 2rem;
  }
  
  .request-card {
    padding: 1.75rem;
  }
  
  .request-title {
    font-size: 1.75rem;
  }
  
  .request-title svg {
    width: 28px;
    height: 28px;
  }
  
  .modal-content {
    padding: 2rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .request-title {
    font-size: 1.5rem;
  }
  
  .form-input, 
  .form-select, 
  .form-textarea {
    padding: 0.75rem 1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .success-message h3 {
    font-size: 1.3rem;
  }
  
  .request-id-display {
    font-size: 1rem;
  }
}
</style>