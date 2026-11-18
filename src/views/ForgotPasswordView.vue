
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { resetStudentPassword } from '@/services/auth'

const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleResetRequest() {
  errorMessage.value = ''
  successMessage.value = ''

  isLoading.value = true

  try {
    await resetStudentPassword(email.value.trim())

    successMessage.value =
      'If an account exists with that email, a password recovery link will be sent. Please check your inbox.'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="forgot-page">
    <section class="forgot-card">
      <div class="mascot">
        <img
          src="/images/studybuddy-cat.gif"
          alt="StudyBuddy cat mascot"
        />
      </div>

      <p class="eyebrow">A LITTLE HELP FOR YOUR JOURNEY</p>

      <h1>Forgot Password?</h1>

      <p class="subtitle">
        Don't worry! It happens. Enter your registered email
        and we'll help you get back to studying.
      </p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="success-message">
        {{ successMessage }}
      </p>

      <form class="forgot-form" @submit.prevent="handleResetRequest">
        <label for="email">Email Address</label>

        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your registered email"
          autocomplete="email"
          required
        />

        <button
          type="submit"
          class="reset-button"
          :disabled="isLoading"
        >
          {{ isLoading ? 'SENDING...' : 'SEND RESET LINK' }}
        </button>
      </form>

      <button
        type="button"
        class="back-button"
        @click="goToLogin"
      >
        ← BACK TO LOGIN
      </button>

      <p class="footer-text">
        Your learning adventure isn't over yet!
      </p>
    </section>
  </main>
</template>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.forgot-card {
  width: 100%;
  max-width: 460px;
  padding: 42px 38px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
  text-align: center;
  animation: card-entrance 0.7s ease-out both;
}

@keyframes card-entrance {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
}

.mascot img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: mascot-float 3s ease-in-out infinite;
}

@keyframes mascot-float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.eyebrow {
  margin-bottom: 9px;
  color: #9b8061;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  margin: 0;
  color: #594936;
  font-size: 32px;
}

.subtitle {
  margin: 12px 0 25px;
  color: #82735f;
  font-size: 14px;
  line-height: 1.6;
}

.error-message,
.success-message {
  margin: 0 0 15px;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
}

.error-message {
  color: #9b4545;
  background: #f8e5df;
  border: 2px solid #d9a49a;
}

.success-message {
  color: #536b42;
  background: #e8efdc;
  border: 2px solid #a9bb91;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.forgot-form label {
  margin: 13px 0 7px;
  color: #665544;
  font-size: 13px;
  font-weight: bold;
}

.forgot-form input {
  width: 100%;
  min-height: 46px;
  padding: 12px;
  color: #594936;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.forgot-form input:focus {
  border-color: #8d9b72;
}

.reset-button {
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

.reset-button:hover {
  background: #7c8c63;
}

.reset-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.back-button {
  margin-top: 22px;
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.footer-text {
  margin: 25px 0 0;
  color: #a4947d;
  font-size: 11px;
}
</style>
