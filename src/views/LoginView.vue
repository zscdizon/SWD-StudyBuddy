
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginStudent, getStudentProfile } from '@/services/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

function goToRegister() {
  router.push('/register')
}

function goToForgotPassword() {
  console.log('Password recovery will be implemented later.')
}

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const { user } = await loginStudent({
      email: email.value,
      password: password.value,
    })

    const profile = await getStudentProfile(user.id)

    if (profile.year_level === null) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <main class="login-page">
    <section class="login-card">
      <div class="mascot">🐱</div>

      <p class="eyebrow">YOUR STUDY ADVENTURE CONTINUES</p>

      <h1>Welcome Back!</h1>

      <p class="subtitle">
        Your study buddy has been waiting for you.
      </p>
      <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      </p>

      <form class="login-form" @submit.prevent="handleLogin">
        <label for="email">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          autocomplete="email"
          required
        />

        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
        />

        <button
          type="button"
          class="forgot-button"
          @click="goToForgotPassword"
        >
          Forgot Password?
        </button>

        <button
         type="submit"
         class="login-button"
         :disabled="isLoading"
         >
         {{ isLoading ? 'LOGGING IN...' : 'LOG IN' }}
        </button>
      </form>

      <p class="register-text">
        New to StudyBuddy?
        <button
          class="text-button"
          type="button"
          @click="goToRegister"
        >
          Create Account
        </button>
      </p>

      <p class="footer-text">
        Every little step counts. Keep going!
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 460px;
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
  font-size: 34px;
}

.subtitle {
  margin: 12px 0 28px;
  color: #82735f;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
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

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form label {
  margin: 13px 0 7px;
  color: #665544;
  font-size: 13px;
  font-weight: bold;
}

.login-form input {
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

.login-form input:focus {
  border-color: #8d9b72;
}

.forgot-button {
  align-self: flex-end;
  margin-top: 12px;
  padding: 0;
  color: #718354;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.login-button {
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

.login-button:hover {
  background: #7c8c63;
}

.login-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.register-text {
  margin-top: 24px;
  color: #82735f;
  text-align: center;
  font-size: 13px;
}

.text-button {
  padding: 0;
  color: #718354;
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.footer-text {
  margin: 28px 0 0;
  color: #a4947d;
  text-align: center;
  font-size: 11px;
}
</style>

