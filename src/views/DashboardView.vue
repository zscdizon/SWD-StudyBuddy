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
      <p v-if="isLoading">Preparing your study room...</p>

      <p v-else-if="errorMessage">
        {{ errorMessage }}
      </p>

      <template v-else>
        <p class="eyebrow">YOUR LITTLE STUDY COMPANION</p>

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

</style>
