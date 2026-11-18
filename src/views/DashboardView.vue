<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getCurrentStudent,
  getStudentProfile,
  logoutStudent,
} from '@/services/auth'

import {
  getStudyDashboardStats,
  getStudySessionHistory,
} from '@/services/studySessions'

const router = useRouter()

const studentName = ref('')
const yearLevel = ref('')
const avatarUrl = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const studyStats = ref({
  today_sessions: 0,
  daily_goal: 3,
  daily_goal_completed: false,
  daily_reward_claimed: false,
  daily_reward_xp: 30,
  current_streak: 0,
  longest_streak: 0,
  total_sessions: 0,
})

const studyHistory = ref({
  sessions: [],
  total_sessions: 0,
  total_minutes: 0,
  total_reward_xp: 0,
})

const goalProgress = computed(() => {
  return Math.min(
    (studyStats.value.today_sessions / studyStats.value.daily_goal) * 100,
    100
  )
})

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
    avatarUrl.value = profile.avatar_url || ''
    studyStats.value = await getStudyDashboardStats()
    studyHistory.value = await getStudySessionHistory()
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
    <span class="brand-mascot">
  <img
    src="/images/studybuddy-cat.gif"
    alt="StudyBuddy cat mascot"
  />
</span>
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
  <div class="welcome-profile">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      alt="Your profile picture"
      class="welcome-avatar"
    />

    <div v-else class="welcome-avatar-placeholder">
      👤
    </div>

    <div class="welcome-details">
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
  </div>
</div>

<section class="daily-adventure">
  <div class="adventure-heading">
    <span class="adventure-icon">🌱</span>
    <div>
      <h2>Your Daily Adventure</h2>
      <p>Small study sessions make big progress!</p>
    </div>
  </div>

  <div class="daily-stats">
    <div class="stat-card">
      <span class="stat-icon">📚</span>
      <h3>Daily Study Goal</h3>
      <p class="stat-number">
        {{ studyStats.today_sessions }} / {{ studyStats.daily_goal }}
      </p>
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: `${goalProgress}%` }"
        ></div>
      </div>
      <p class="stat-caption">
        {{ studyStats.daily_goal_completed
          ? 'Daily goal completed! Amazing work!'
          : 'Complete 3 study sessions today.' }}
      </p>
    </div>

    <div class="stat-card">
      <span class="stat-icon">🔥</span>
      <h3>Study Streak</h3>
      <p class="stat-number">
        {{ studyStats.current_streak }}
        {{ studyStats.current_streak === 1 ? 'Day' : 'Days' }}
      </p>
      <p class="stat-caption">
        Longest streak: {{ studyStats.longest_streak }} days
      </p>
    </div>
  </div>

  <div class="daily-reward">
    <span>⭐</span>
    <p>
      Daily Reward:
      <strong>+{{ studyStats.daily_reward_xp }} XP</strong>
      <span v-if="studyStats.daily_reward_claimed">
        — Claimed!
      </span>
      <span v-else-if="studyStats.daily_goal_completed">
        — Goal completed!
      </span>
      <span v-else>
        — Complete your daily goal to earn it!
      </span>
    </p>
  </div>

  <RouterLink to="/study-session" class="start-session-card">
    <span class="session-icon">⏱️</span>
    <div>
      <h3>Start a Study Session</h3>
      <p>Focus for 25 minutes and earn your daily rewards.</p>
    </div>
    <span class="session-arrow">→</span>
  </RouterLink>
</section>


<section class="study-history">
  <div class="history-heading">
    <span class="history-icon">📜</span>
    <div>
      <h2>Your Study Journey</h2>
      <p>Look how far you've come!</p>
    </div>
  </div>

  <div class="history-stats">
    <div class="history-stat-card">
      <span>📚</span>
      <h3>Total Sessions</h3>
      <strong>{{ studyHistory.total_sessions }}</strong>
    </div>

    <div class="history-stat-card">
      <span>⏳</span>
      <h3>Study Time</h3>
      <strong>{{ Math.floor(studyHistory.total_minutes / 60) }}h
        {{ studyHistory.total_minutes % 60 }}m
      </strong>
    </div>

    <div class="history-stat-card">
      <span>⭐</span>
      <h3>Reward XP</h3>
      <strong>{{ studyHistory.total_reward_xp }} XP</strong>
    </div>
  </div>

  <div class="recent-sessions">
    <h3>Recent Study Sessions</h3>

    <p v-if="studyHistory.sessions.length === 0">
      No study sessions yet. Your adventure starts here!
    </p>

    <div
      v-for="session in studyHistory.sessions"
      :key="session.id"
      class="recent-session-item"
    >
      <span class="recent-session-icon">📚</span>

      <div class="recent-session-details">
        <strong>
  {{ session.subject_name || 'General Study Session' }}
</strong>
        <span>
          {{ new Date(session.completed_at).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Manila'
          }) }}
        </span>
      </div>

      <span class="recent-session-status">✓ Completed</span>
    </div>
  </div>

</section>

<section class="study-space">
  <h2 class="section-title">Your Study Space</h2>

  <div class="study-tools">
    <RouterLink to="/subjects" class="tool-card">
    <span class="tool-icon">📚</span>
    <h3>My Subjects</h3>
    <p>Your subjects and lecture notebooks.</p>
    </RouterLink>

    <RouterLink to="/journal" class="tool-card">
  <span class="tool-icon">📖</span>
  <h3>Personal Journal</h3>
  <p>A little space for your thoughts.</p>
</RouterLink>

    <RouterLink to="/planner" class="tool-card">
  <span class="tool-icon">📅</span>
  <h3>Study Planner</h3>
  <p>Organize your tasks and study time.</p>
</RouterLink>

<RouterLink to="/profile" class="tool-card">
  <span class="tool-icon">👤</span>
  <h3>My Profile</h3>
  <p>View and customize your student identity.</p>
</RouterLink>

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
  width: 68px;
  height: 68px;
  background: transparent;
  border: none;
  border-radius: 0;
}

.brand-mascot img {
  transition: transform 0.25s ease;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: mascot-float 3s ease-in-out infinite;
}

.brand-mascot:hover img {
  transform: translateY(-4px) scale(1.08);
}

@keyframes mascot-float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
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

.welcome-profile {
  display: flex;
  align-items: center;
  gap: 25px;
}

.welcome-avatar,
.welcome-avatar-placeholder {
  flex-shrink: 0;
  width: 115px;
  height: 115px;
  border: 4px solid #c9b99f;
  border-radius: 50%;
}

.welcome-avatar {
  object-fit: cover;
}

.welcome-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9dfc9;
  font-size: 48px;
}

.welcome-details {
  flex: 1;
  min-width: 0;
}

.welcome-section h1 {
  margin: 0 0 12px;
}

.welcome-section p {
  margin: 8px 0;
}

.daily-adventure {
  margin-top: 25px;
  padding: 25px;
  background: #f1ead9;
  border: 3px solid #c9b99f;
  border-radius: 10px;
  box-shadow: 4px 4px 0 #e4d8c3;
}

.adventure-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.adventure-icon {
  animation: plant-sway 4s ease-in-out infinite;
  transform-origin: bottom center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #e9dfc9;
  border: 2px solid #c9b99f;
  border-radius: 8px;
  font-size: 27px;
}

@keyframes plant-sway {
  0%, 100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(3deg);
  }
}

.adventure-heading h2 {
  margin: 0 0 5px;
  color: #594936;
  font-size: 21px;
}

.adventure-heading p {
  margin: 0;
  font-size: 13px;
}

.daily-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}

.stat-card {
  padding: 22px;
  background: #f5efdf;
  border: 2px solid #d6c6a9;
  border-radius: 10px;
  box-shadow: 4px 4px 0 #dfd2bb;
}

.stat-icon {
  display: block;
  margin-bottom: 10px;
  font-size: 25px;
}

.stat-card h3 {
  margin: 0 0 10px;
  color: #756047;
  font-size: 15px;
}

.stat-number {
  margin: 0 0 12px;
  color: #594936;
  font-size: 27px;
  font-weight: bold;
}

.progress-track {
  width: 100%;
  height: 12px;
  overflow: hidden;
  background: #dfd5c2;
  border: 1px solid #c8b99e;
  border-radius: 20px;
}

.progress-fill {
  height: 100%;
  background: #91a978;
  border-radius: 20px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.stat-caption {
  margin: 10px 0 0;
  color: #89785f;
  font-size: 12px;
  line-height: 1.5;
}

.daily-reward {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 14px 18px;
  background: #eee2c8;
  border: 2px dashed #c7ad7d;
  border-radius: 9px;
}

.daily-reward > span {
  display: inline-block;
  font-size: 24px;
  animation: star-sparkle 2.5s ease-in-out infinite;
}

@keyframes star-sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.15) rotate(12deg);
  }
}

.daily-reward p {
  margin: 0;
  color: #756047;
  font-size: 13px;
  line-height: 1.6;
}

.daily-reward strong {
  color: #a27638;
}

.start-session-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  color: inherit;
  text-decoration: none;
  background: #fffdf7;
  border: 3px solid #c9b99f;
  border-radius: 9px;
  box-shadow: 4px 4px 0 #e4d8c3;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-session-card:hover {
  transform: translateY(-3px);
  box-shadow: 4px 7px 0 #d7c5a8;
}

.session-icon {
  font-size: 34px;
}

.start-session-card h3 {
  margin: 0 0 6px;
  color: #594936;
  font-size: 17px;
}

.start-session-card p {
  margin: 0;
  color: #82735f;
  font-size: 13px;
  line-height: 1.5;
}

.session-arrow {
  margin-left: auto;
  color: #a66f5b;
  font-size: 25px;
  font-weight: bold;
}


.study-history {
  margin-top: 25px;
  padding: 25px;
  background: #f1ead9;
  border: 3px solid #c9b99f;
  border-radius: 10px;
  box-shadow: 4px 4px 0 #e4d8c3;
}

.history-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.history-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #e9dfc9;
  border: 2px solid #c9b99f;
  border-radius: 8px;
  font-size: 27px;
}

.history-heading h2 {
  margin: 0 0 5px;
  color: #594936;
  font-size: 21px;
}

.history-heading p {
  margin: 0;
  font-size: 13px;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.history-stat-card {
  padding: 20px 12px;
  text-align: center;
  background: #fffdf7;
  border: 2px solid #d6c6a9;
  border-radius: 9px;
  box-shadow: 3px 3px 0 #dfd2bb;
}

.history-stat-card > span {
  display: block;
  margin-bottom: 10px;
  font-size: 27px;
}

.history-stat-card h3 {
  margin: 0 0 10px;
  color: #756047;
  font-size: 13px;
}

.history-stat-card strong {
  color: #594936;
  font-size: 22px;
}

.recent-sessions {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 2px dashed #c9b99f;
}

.recent-sessions h3 {
  margin: 0 0 15px;
  color: #594936;
  font-size: 17px;
}

.recent-session-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  padding: 15px;
  background: #fffdf7;
  border: 2px solid #d6c6a9;
  border-radius: 9px;
}

.recent-session-icon {
  font-size: 25px;
}

.recent-session-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.recent-session-details strong {
  color: #594936;
  font-size: 14px;
}

.recent-session-details span {
  color: #89785f;
  font-size: 12px;
}

.recent-session-status {
  margin-left: auto;
  color: #718b5d;
  font-size: 12px;
  font-weight: bold;
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
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  padding: 22px;
  background: #fffdf7;
  border: 3px solid #c9b99f;
  border-radius: 9px;
  box-shadow: 4px 4px 0 #e4d8c3;
  display: block;
  color: inherit;
  text-decoration: none;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 5px 8px 0 #d7c5a8;
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
.daily-stats {
  grid-template-columns: 1fr;
  gap: 12px;
}

  .recent-session-item {
    gap: 10px;
    padding: 12px;
    flex-wrap: wrap;
  }

  .recent-session-details strong {
    font-size: 13px;
  }

  .recent-session-status {
    margin-left: auto;
    font-size: 11px;
  }


.stat-card {
  padding: 18px;
}

.stat-number {
  font-size: 24px;
}

.daily-reward {
  align-items: flex-start;
  padding: 12px;
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
  .daily-adventure {
  padding: 18px;
}

.adventure-heading {
  gap: 10px;
}

.adventure-heading h2 {
  font-size: 18px;
}

.start-session-card {
  gap: 12px;
  padding: 15px;
}

.start-session-card h3 {
  font-size: 15px;
}

.session-icon {
  font-size: 28px;
}

  .study-history {
    padding: 18px;
  }

  .history-heading {
    gap: 10px;
  }

  .history-heading h2 {
    font-size: 18px;
  }

  .history-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .history-stat-card {
    padding: 16px;
  }

  .history-stat-card strong {
    font-size: 20px;
  }

  .welcome-profile {
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
}

.welcome-avatar,
.welcome-avatar-placeholder {
  width: 100px;
  height: 100px;
}

.welcome-details {
  width: 100%;
}

}

</style>
