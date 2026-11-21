
<script setup>
import { ref } from 'vue'

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Enter your password',
  },
  autocomplete: {
    type: String,
    default: 'current-password',
  },
  minlength: {
    type: Number,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: true,
  },
})

const password = defineModel({ type: String, default: '' })

const showPassword = ref(false)
</script>

<template>
  <label :for="id">{{ label }}</label>

  <div class="password-wrapper">
    <input
      :id="id"
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :required="required"
    />

    <button
      type="button"
      class="toggle-password"
      @click="showPassword = !showPassword"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
    >
      {{ showPassword ? '🙈' : '👁️' }}
    </button>
  </div>
</template>

<style scoped>

label {
  display: block;
  margin: 13px 0 7px;
  color: #665544;
  font-size: 13px;
  font-weight: bold;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  min-height: 46px;
  padding: 12px;
  padding-right: 45px;
  color: #594936;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.password-wrapper input:focus {
  border-color: #8d9b72;
}

.toggle-password {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 17px;
}

.toggle-password:hover {
  opacity: 0.7;
}
</style>
