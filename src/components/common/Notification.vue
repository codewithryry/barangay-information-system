<template>
  <div v-if="message" :class="['notification', type]">
    {{ message }}
  </div>
</template>

<script>
export default {
  computed: {
    message() {
      return this.$store.state.notification.message
    },
    type() {
      return this.$store.state.notification.type
    }
  }
}
</script>