import { h, createApp } from 'vue'
import Notification from '@/components/Notification.vue' // Make sure to import your Notification component

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

const NotificationService = {
  install(app) {
    // Create a container for all notifications
    const notificationContainer = document.createElement('div')
    notificationContainer.id = 'notification-container'
    document.body.appendChild(notificationContainer)
    
    // Create a mini app to manage notifications
    const notificationManager = createApp({
      render: () => null
    })
    notificationManager.mount(notificationContainer)

    // Main notify function
    const notify = (message, options = {}) => {
      const defaultOptions = {
        type: NOTIFICATION_TYPES.SUCCESS,
        duration: 5000,
        dismissible: true
      }
      const mergedOptions = { ...defaultOptions, ...options }
      
      // Create mount point for this specific notification
      const mountPoint = document.createElement('div')
      notificationContainer.appendChild(mountPoint)
      
      // Create notification app instance
      const notificationApp = createApp({
        render() {
          return h(Notification, {
            message,
            type: mergedOptions.type,
            duration: mergedOptions.duration,
            dismissible: mergedOptions.dismissible,
            onDismissed: this.destroy
          })
        },
        methods: {
          destroy() {
            setTimeout(() => {
              notificationApp.unmount()
              if (mountPoint.parentNode) {
                notificationContainer.removeChild(mountPoint)
              }
            }, 300)
          }
        }
      })
      
      // Share global components and plugins from main app
      notificationApp._context = app._context
      notificationApp.mount(mountPoint)
    }

    // Add to global properties
    app.config.globalProperties.$notify = notify
    app.config.globalProperties.$notify.success = (message, options) => 
      notify(message, { ...options, type: NOTIFICATION_TYPES.SUCCESS })
    app.config.globalProperties.$notify.error = (message, options) => 
      notify(message, { ...options, type: NOTIFICATION_TYPES.ERROR })
    app.config.globalProperties.$notify.warning = (message, options) => 
      notify(message, { ...options, type: NOTIFICATION_TYPES.WARNING })
    app.config.globalProperties.$notify.info = (message, options) => 
      notify(message, { ...options, type: NOTIFICATION_TYPES.INFO })
  }
}

export default NotificationService