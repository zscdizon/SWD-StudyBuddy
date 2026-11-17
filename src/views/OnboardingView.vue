<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getCurrentStudent,
  updateStudentProfile,
} from '@/services/auth'

const router = useRouter()

const fullName = ref('')
const yearLevel = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleCompleteProfile() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const user = await getCurrentStudent()

    await updateStudentProfile(user.id, {
      fullName: fullName.value,
      yearLevel: Number(yearLevel.value),
    })

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <main class="onboarding-page">
    <section class="onboarding-card">
      <div class="mascot">🐱</div>

      <p class="eyebrow">ONE LAST STEP BEFORE YOUR ADVENTURE</p>

      <h1>Let's Get to Know You!</h1>

      <p class="subtitle">
        Set up your student profile and personalize your StudyBuddy experience.
      </p>

      <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      </p>

      <form class="onboarding-form" @submit.prevent="handleCompleteProfile">
        <label for="fullName">Your Full Name</label>
        <input
          id="fullName"
          v-model="fullName"
          type="text"
          placeholder="Enter your full name"
          autocomplete="name"
          required
        />

        <label for="yearLevel">Current Year Level</label>
        <select id="yearLevel" v-model="yearLevel" required>
          <option value="" disabled>Select your year level</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <p class="helper-text">
          You can update your year level anytime in your profile.
        </p>

        <button
        type="submit"
        class="continue-button"
        :disabled="isLoading"
        >
        {{ isLoading ? 'SAVING PROFILE...' : 'COMPLETE PROFILE' }}
        </button>
      </form>

      <p class="footer-text">
        Your learning journey starts with one little step.
      </p>
    </section>
  </main>
</template>

<style scoped>
.onboarding-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.onboarding-card {
  width: 100%;
  max-width: 480px;
  padding: 42px 38px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.mascot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  margin: 0 auto 18px;
  background: #e9dfc9;
  border: 3px solid #665544;
  border-radius: 10px;
  font-size: 45px;
}

.eyebrow {
  margin-bottom: 9px;
  color: #9b8061;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  margin: 0;
  color: #594936;
  text-align: center;
  font-size: 30px;
}

.subtitle {
  margin: 14px 0 28px;
  color: #82735f;
  text-align: center;
  font-size: 14px;
  line-height: 1.7;
}

.error-message {
  margin: 0 0 15px;
  padding: 12px;
  color: #9b4545;
  background: #f8e5df;
  border: 2px solid #d9a49a;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.onboarding-form {
  display: flex;
  flex-direction: column;
}

.onboarding-form label {
  margin: 13px 0 7px;
  color: #665544;
  font-size: 13px;
  font-weight: bold;
}

.onboarding-form input,
.onboarding-form select {
  width: 100%;
  min-height: 48px;
  padding: 12px;
  color: #594936;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.onboarding-form input:focus,
.onboarding-form select:focus {
  border-color: #8d9b72;
}

.helper-text {
  margin: 9px 0 0;
  color: #a4947d;
  font-size: 11px;
  line-height: 1.5;
}

.continue-button {
  min-height: 50px;
  margin-top: 25px;
  color: #fffaf0;
  background: #8d9b72;
  border: 3px solid #665544;
  border-radius: 7px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
}

.continue-button:hover {
  background: #7c8c63;
}

.continue-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.continue-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.footer-text {
  margin: 28px 0 0;
  color: #a4947d;
  text-align: center;
  font-size: 11px;
}
</style>
