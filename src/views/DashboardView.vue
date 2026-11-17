<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getCurrentStudent,
  getStudentProfile,
  logoutStudent,
} from '@/services/auth'

const router = useRouter()

const studentName = ref('')
const yearLevel = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

async function handleLogout() {
  errorMessage.value = ''

  try {
    await logoutStudent()
    router.replace('/')
  } catch (error) {
    errorMessage.value = error.message
  }
}

const yearLabels = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
}

onMounted(async () => {
  try {
    const user = await getCurrentStudent()
    const profile = await getStudentProfile(user.id)

    studentName.value = profile.full_name
    yearLevel.value = yearLabels[profile.year_level]
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="dashboard-page">
    <section class="dashboard-content">
    <header class="dashboard-header">
  <div class="brand">
    <span class="brand-mascot">🐱</span>
    <span class="brand-name">StudyBuddy</span>
  </div>
</header>

      <p v-if="isLoading">Preparing your study room...</p>

      <p v-else-if="errorMessage">
        {{ errorMessage }}
      </p>

      <template v-else>
        <p class="eyebrow">YOUR LITTLE STUDY COMPANION</p>

        <div class="welcome-section">

        <h1>Welcome back, {{ studentName }}!</h1>

        <p>{{ yearLevel }} Computer Engineering Student</p>

        <p>Your learning adventure continues here.</p>
        <button
          type="button"
          class="logout-button"
          @click="handleLogout"
        >
        LOG OUT
        </button>
        </div>

<section class="study-space">
  <h2 class="section-title">Your Study Space</h2>

  <div class="study-tools">
    <RouterLink to="/subjects" class="tool-card">
    <span class="tool-icon">📚</span>
    <h3>My Subjects</h3>
    <p>Your subjects and lecture notebooks.</p>
    </RouterLink>

    <div class="tool-card">
      <span class="tool-icon">📖</span>
      <h3>Personal Journal</h3>
      <p>A little space for your thoughts.</p>
    </div>

    <div class="tool-card">
      <span class="tool-icon">📅</span>
      <h3>Study Planner</h3>
      <p>Organize your tasks and study time.</p>
    </div>

    <RouterLink to="/progress" class="tool-card">
  <span class="tool-icon">⭐</span>
  <h3>My Progress</h3>
  <p>Keep track of your learning journey.</p>
</RouterLink>
  </div>  
</section>

      </template>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.dashboard-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 35px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e4d8c3;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mascot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #e9dfc9;
  border: 3px solid #665544;
  border-radius: 8px;
  font-size: 28px;
}

.brand-name {
  color: #594936;
  font-size: 23px;
  font-weight: bold;
  letter-spacing: 1px;
}

.welcome-section {
  padding: 28px;
  background: #f1ead9;
  border: 2px solid #d7c5a8;
  border-radius: 10px;
}

.welcome-section h1 {
  margin: 0 0 12px;
}

.welcome-section p {
  margin: 8px 0;
}

.study-space {
  margin-top: 35px;
}

.section-title {
  margin: 0 0 20px;
  color: #594936;
  font-size: 22px;
}

.study-tools {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.tool-card {
  padding: 22px;
  background: #fffdf7;
  border: 3px solid #c9b99f;
  border-radius: 9px;
  box-shadow: 4px 4px 0 #e4d8c3;
  display: block;
  color: inherit;
  text-decoration: none;
}

.tool-icon {
  display: block;
  margin-bottom: 12px;
  font-size: 32px;
}

.tool-card h3 {
  margin: 0 0 8px;
  color: #594936;
  font-size: 17px;
}

.tool-card p {
  margin: 0;
  color: #82735f;
  font-size: 13px;
  line-height: 1.6;
}

.eyebrow {
  color: #9b8061;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  color: #594936;
  font-size: 30px;
}

p {
  color: #82735f;
  line-height: 1.7;
}

.logout-button {
  min-height: 42px;
  margin-top: 20px;
  padding: 0 24px;
  color: #fffaf0;
  background: #a66f5b;
  border: 3px solid #665544;
  border-radius: 7px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
}

.logout-button:hover {
  background: #905b49;
}

@media (max-width: 640px) {
  .dashboard-page {
    padding: 20px 14px;
  }

  .dashboard-content {
    padding: 22px 18px;
  }

  .dashboard-header {
    margin-bottom: 22px;
  }

  .brand-name {
    font-size: 20px;
  }

  .welcome-section {
    padding: 22px;
  }

  .welcome-section h1 {
    font-size: 25px;
  }

  .study-tools {
    grid-template-columns: 1fr;
  }
}

</style>
