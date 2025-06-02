<template>
  <div v-if="isVisible" class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop role="dialog" aria-labelledby="confirmTitle" aria-modal="true">
      <div class="modal-header">
        <h3 id="confirmTitle">Confirm Delete</h3>
        <button class="modal-close" @click="$emit('close')" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <p class="confirm-message">{{ message }}</p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn btn-delete" @click="$emit('confirm')" :disabled="isDeleting">
          <i v-if="isDeleting" class="fas fa-spinner fa-spin"></i>
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Are you sure you want to delete this item?'
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      isDeleting: false
    }
  },
  methods: {
    startDeleting() {
      this.isDeleting = true
    },
    stopDeleting() {
      this.isDeleting = false
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 100px;
}

.modal {
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: block !important;
  opacity: 1 !important;

  /* Centering */
  position: relative;
  animation: scaleIn 0.25s ease forwards;
  transform: scale(1);
}


.modal-header {
  padding: 24px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 32px;
  background: #f9fafb;
}

.confirm-message {
  font-size: 1.1rem;
  color: #1e293b;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.warning-text {
  font-size: 0.95rem;
  color: #ef4444;
  font-weight: 500;
  margin: 0;
}

.modal-footer {
  padding: 20px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background: #d1d5db;
  transform: translateY(-2px);
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
}

.btn-delete:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .modal {
    max-width: 95vw;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>