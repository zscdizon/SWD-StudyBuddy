
<script setup>
defineProps({
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'info'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <p
    v-if="message"
    class="message-alert"
    :class="`message-${type}`"
    role="alert"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>

<style scoped>
.message-alert {
  margin: 0 0 15px;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.message-error {
  color: #9b4545;
  background: #f8e5df;
  border: 2px solid #d9a49a;
}

.message-success {
  color: #536b42;
  background: #e8efdc;
  border: 2px solid #a9bb91;
}

.message-info {
  color: #665544;
  background: #eee3ce;
  border: 2px solid #c9b99f;
}
</style>
