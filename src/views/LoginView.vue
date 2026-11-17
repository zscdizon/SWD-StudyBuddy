
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

function goToRegister() {
  router.push('/register')
}

function goToForgotPassword() {
  // We'll implement password recovery later.
  console.log('Password recovery will be implemented later.')
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

      <form class="login-form" @submit.prevent>
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

        <button type="submit" class="login-button">
          LOG IN
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
