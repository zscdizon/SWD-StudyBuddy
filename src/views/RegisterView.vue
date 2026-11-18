<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerStudent } from '@/services/auth'
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function goToLogin() {
  router.push('/login')
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Your passwords do not match.'
    return
  }

  isLoading.value = true

  try {
    const data = await registerStudent({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })

    if (data.user && !data.session) {
      successMessage.value =
        'Account created! Please check your email to verify your account.'
    } else {
      successMessage.value =
        'Your account has been created successfully!'
    }

    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <main class="register-page">
    <section class="register-card">
      <div class="mascot">
  <img
    src="/images/studybuddy-cat.gif"
    alt="StudyBuddy cat mascot"
  />
</div>

      <p class="eyebrow">YOUR STUDY ADVENTURE STARTS HERE</p>

      <h1>Create Account</h1>

      <p class="subtitle">
        Join StudyBuddy and make every study session count!
      </p>

      <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="success-message">
      {{ successMessage }}
      </p>

      <form class="register-form" @submit.prevent="handleRegister">
        <label for="fullName">Full Name</label>
        <input
          id="fullName"
          v-model="fullName"
          type="text"
          placeholder="Enter your full name"
          autocomplete="name"
          required
        />

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
          placeholder="Create a password"
          autocomplete="new-password"
          required
        />

        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          autocomplete="new-password"
          required
        />

        <button
        type="submit"
        class="create-button"
        :disabled="isLoading"
        >
        {{ isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
        </button>
      </form>

      <p class="login-text">
        Already have an account?
        <button class="text-button" type="button" @click="goToLogin">
          Log In
        </button>
      </p>

      <p class="footer-text">
        A little progress every day goes a long way.
      </p>
    </section>
  </main>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.register-card {
  animation: card-entrance 0.7s ease-out both;
  width: 100%;
  max-width: 460px;
  padding: 38px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
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
  margin: 0 0 9px;
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
  margin: 12px 0 25px;
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

.success-message {
  margin: 0 0 15px;
  padding: 12px;
  color: #536b42;
  background: #e8efdc;
  border: 2px solid #a9bb91;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form label {
  margin: 13px 0 7px;
  color: #665544;
  font-size: 13px;
  font-weight: bold;
}

.register-form input {
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

.register-form input:focus {
  border-color: #8d9b72;
}

.create-button {
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

.create-button:hover {
  background: #7c8c63;
}

.create-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.login-text {
  margin-top: 22px;
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
  margin: 25px 0 0;
  color: #a4947d;
  text-align: center;
  font-size: 11px;
}
</style>
