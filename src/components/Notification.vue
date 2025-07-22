<template>
  <transition name="notification">
    <div v-if="visible" :class="['notification', type]" @click="dismiss">
      <div class="notification-content">
        <i :class="iconClass"></i>
        <span>{{ message }}</span>
      </div>
      <div class="progress-bar" :style="progressStyle"></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: String,
    type: {
      type: String,
      default: 'success',
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      timer: null,
      startTime: null,
      remainingTime: this.duration
    }
  },
  computed: {
    iconClass() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[this.type]
    },
    progressStyle() {
      return {
        width: `${(this.remainingTime / this.duration) * 100}%`
      }
    }
  },
  mounted() {
    this.show()
  },
  methods: {
    show() {
      this.visible = true
      this.startTimer()
    },
    startTimer() {
      this.startTime = Date.now()
      this.timer = setTimeout(() => {
        this.dismiss()
      }, this.remainingTime)
    },
    pauseTimer() {
      clearTimeout(this.timer)
      this.remainingTime -= Date.now() - this.startTime
    },
    dismiss() {
      this.visible = false
      clearTimeout(this.timer)
      this.$emit('dismissed')
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification i {
  font-size: 1.2rem;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #F44336;
}

.notification.warning {
  background-color: #FF9800;
}

.notification.info {
  background-color: #2196F3;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: width linear;
}

/* Animation */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-enter-to,
.notification-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>