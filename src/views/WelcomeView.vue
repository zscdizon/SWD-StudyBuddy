
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="welcome-page">
    <div class="welcome-card">
      <div class="mascot">
        <span>🐱</span>
      </div>

      <p class="eyebrow">YOUR LITTLE STUDY COMPANION</p>

      <h1>StudyBuddy</h1>

      <p class="description">
        Every little step brings you closer to your goals.
        Let's make studying an adventure!
      </p>

      <div class="actions">
        <button class="primary-button" @click="goToRegister">
          CREATE ACCOUNT
        </button>

        <button class="secondary-button" @click="goToLogin">
          LOG IN
        </button>
      </div>

      <p class="footer-text">
        A cozy little space for your learning journey.
      </p>
    </div>
  </main>
</template>

<style scoped>
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.welcome-card {
  width: 100%;
  max-width: 520px;
  padding: 55px 40px;
  text-align: center;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.mascot {
  margin-bottom: 18px;
}

.mascot span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 105px;
  height: 105px;
  font-size: 65px;
  background: #e9dfc9;
  border: 3px solid #665544;
  border-radius: 12px;
}

.eyebrow {
  margin-bottom: 10px;
  color: #9b8061;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 3px;
}

h1 {
  margin: 0;
  color: #594936;
  font-size: clamp(38px, 8vw, 54px);
  font-weight: 900;
  letter-spacing: -2px;
}

.description {
  max-width: 350px;
  margin: 18px auto 30px;
  color: #82735f;
  font-size: 15px;
  line-height: 1.8;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 290px;
  margin: 0 auto;
}

button {
  min-height: 52px;
  padding: 12px 20px;
  border: 3px solid #665544;
  border-radius: 7px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 0 #665544;
}

.primary-button {
  color: #fffaf0;
  background: #8d9b72;
}

.secondary-button {
  color: #665544;
  background: #eee3ce;
}

.footer-text {
  margin-top: 35px;
  color: #a4947d;
  font-size: 12px;
}
</style>
