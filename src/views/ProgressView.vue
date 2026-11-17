<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStudentProgress } from '@/services/progress'

const router = useRouter()

const progress = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const achievementDetails = {
  FIRST_STEPS: {
    name: 'First Steps',
    description: 'You completed your very first subject!',
    icon: '🌱',
    requirement: 'Complete 1 subject',
  },

  GETTING_SERIOUS: {
    name: 'Getting Serious',
    description: 'Your learning journey is gaining momentum!',
    icon: '📚',
    requirement: 'Complete 3 subjects',
  },

  KNOWLEDGE_SEEKER: {
    name: 'Knowledge Seeker',
    description: 'Your curiosity keeps taking you further.',
    icon: '🔍',
    requirement: 'Complete 5 subjects',
  },

  HALFWAY_HERO: {
    name: 'Halfway Hero',
    description: "You're making impressive progress!",
    icon: '⭐',
    requirement: 'Complete 10 subjects',
  },

  SCHOLARS_JOURNEY: {
    name: "Scholar's Journey",
    description: 'A remarkable milestone in your studies!',
    icon: '👑',
    requirement: 'Complete 20 subjects',
  },
}

function getAchievementDetails(achievementCode) {
  return achievementDetails[achievementCode] || {
    name: achievementCode.replaceAll('_', ' '),
    description: 'A StudyBuddy achievement!',
    icon: '🏅',
    requirement: 'Milestone achieved',
  }
}

function goToDashboard() {
  router.push('/dashboard')
}

function formatActivityDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
onMounted(async () => {
  try {
    progress.value = await getStudentProgress()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>


<template>
  <main class="progress-page">
    <section class="progress-container">

      <header class="progress-header">
        <button class="back-button" @click="goToDashboard">
          ← BACK TO DASHBOARD
        </button>

        <div class="page-brand">
          <span class="brand-mascot">🐱</span>
          <span class="brand-name">StudyBuddy</span>
        </div>
      </header>

      <section class="page-intro">
        <p class="eyebrow">YOUR LEARNING JOURNEY</p>

        <h1>My Progress</h1>

        <p>
          Every little step counts. Keep learning,
          completing quests, and earning experience!
        </p>
      </section>

      
<!-- Loading State -->
<p v-if="isLoading" class="status-message">
  Loading your learning progress...
</p>

<!-- Error State -->
<p v-else-if="errorMessage" class="error-message">
  {{ errorMessage }}
</p>

<!-- Actual Progress -->
<section v-else-if="progress" class="progress-overview">

  <div class="progress-card">
    <span class="progress-icon">⭐</span>
    <p class="progress-label">TOTAL XP</p>
    <h2>{{ progress.totalXP }} XP</h2>
    <p>Your learning experience points.</p>
  </div>

  <div class="progress-card">
    <span class="progress-icon">📚</span>
    <p class="progress-label">COMPLETED SUBJECTS</p>
    <h2>
      {{ progress.completedSubjects }} /
      {{ progress.totalSubjects }}
    </h2>
    <p>Subjects completed in your curriculum.</p>
  </div>

  <div class="progress-card">
    <span class="progress-icon">🏆</span>
    <p class="progress-label">ACHIEVEMENTS</p>
    <h2>{{ progress.achievements.length }}</h2>
    <p>Milestones you've unlocked.</p>
  </div>

</section>


<section v-if="progress" class="activity-section">
  <h2>Study Activity</h2>

  <div
    v-if="progress.activities.length > 0"
    class="activity-list"
  >
    <article
      v-for="activity in progress.activities"
      :key="activity.id"
      class="activity-card"
    >
      <div class="activity-info">
        <h3>{{ activity.description }}</h3>

        <p>{{ activity.activity_type }}</p>

        <span>
          {{ formatActivityDate(activity.created_at) }}
        </span>
      </div>

      <strong>+{{ activity.xp_earned }} XP</strong>
    </article>
  </div>

  <div v-else class="activity-empty-state">
    <span>📖</span>

    <h3>Your study journey starts here!</h3>

    <p>
      Your completed study activities will appear here.
    </p>
  </div>
</section>


<section v-if="progress" class="achievements-section">
  <h2>My Achievements</h2>

  <div
    v-if="progress.achievements.length > 0"
    class="achievement-list"
  >
    <article
  v-for="achievement in progress.achievements"
  :key="achievement.id"
  class="achievement-card"
>
  <span class="achievement-icon">
    {{ getAchievementDetails(achievement.achievement_code).icon }}
  </span>

  <div class="achievement-info">
    <h3>
      {{ getAchievementDetails(achievement.achievement_code).name }}
    </h3>

    <p>
      {{ getAchievementDetails(achievement.achievement_code).description }}
    </p>

    <span class="achievement-requirement">
      {{ getAchievementDetails(achievement.achievement_code).requirement }}
    </span>

    <small>
      Unlocked:
      {{ formatActivityDate(achievement.unlocked_at) }}
    </small>
  </div>
</article>
  </div>

  <div v-else class="achievement-empty-state">
    <span>🎖️</span>

    <h3>Nothing unlocked just yet</h3>

    <p>
      Complete study activities to reach new milestones.
    </p>
  </div>
</section>

    </section>
  </main>
</template>

<style scoped>
.progress-page {
  min-height: 100vh;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.progress-container {
  max-width: 1100px;
  min-height: 80vh;
  margin: 0 auto;
  padding: 35px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e4d8c3;
}

.back-button {
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.page-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mascot {
  font-size: 30px;
}

.brand-name {
  color: #594936;
  font-size: 20px;
  font-weight: bold;
}

.page-intro {
  margin: 45px 0 30px;
}

.eyebrow {
  color: #9b8061;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}

.page-intro h1 {
  margin: 10px 0;
  color: #594936;
  font-size: 32px;
}

.page-intro p {
  max-width: 550px;
  color: #82735f;
  font-size: 14px;
  line-height: 1.7;
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.progress-card {
  padding: 22px;
  background: #f1ead9;
  border: 2px solid #d7c5a8;
  border-radius: 9px;
  box-shadow: 4px 4px 0 #e4d8c3;
}

.progress-icon {
  font-size: 30px;
}

.progress-label {
  margin: 12px 0 6px;
  color: #9b8061;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}

.progress-card h2 {
  margin: 0;
  color: #594936;
  font-size: 26px;
}

.progress-card p:last-child {
  color: #82735f;
  font-size: 12px;
  line-height: 1.6;
}

.activity-section,
.achievements-section {
  margin-top: 40px;
}

.activity-section h2,
.achievements-section h2 {
  margin-bottom: 18px;
  color: #594936;
  font-size: 21px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 8px;
  box-shadow: 3px 3px 0 #e4d8c3;
}

.activity-info h3 {
  margin: 0 0 6px;
  color: #594936;
  font-size: 15px;
}

.activity-info p {
  margin: 0 0 6px;
  color: #9b8061;
  font-size: 12px;
}

.activity-info span {
  color: #82735f;
  font-size: 11px;
}

.activity-card strong {
  color: #8a7650;
  font-size: 14px;
  white-space: nowrap;
}


.achievement-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 15px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 8px;
  box-shadow: 3px 3px 0 #e4d8c3;
}

.achievement-icon {
  font-size: 32px;
}

.achievement-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.achievement-info h3 {
  margin: 0;
  color: #594936;
  font-size: 15px;
}

.achievement-info p {
  margin: 0;
  color: #82735f;
  font-size: 12px;
  line-height: 1.6;
}

.achievement-requirement {
  width: fit-content;
  padding: 5px 9px;
  color: #8a7650;
  background: #f1ead9;
  border: 1px solid #d7c5a8;
  border-radius: 5px;
  font-size: 10px;
  font-weight: bold;
}

.achievement-info small {
  color: #9b8061;
  font-size: 10px;
}

.activity-empty-state,
.achievement-empty-state {
  padding: 35px 20px;
  text-align: center;
  background: #f1ead9;
  border: 2px dashed #c9b99f;
  border-radius: 10px;
}

.activity-empty-state span,
.achievement-empty-state span {
  font-size: 38px;
}

.activity-empty-state h3,
.achievement-empty-state h3 {
  color: #594936;
  font-size: 17px;
}

.activity-empty-state p,
.achievement-empty-state p {
  color: #82735f;
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .progress-page {
    padding: 20px 14px;
  }

  .progress-container {
    padding: 22px 18px;
  }

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-intro {
    margin: 32px 0 24px;
  }

  .page-intro h1 {
    font-size: 27px;
  }

  .progress-overview {
    grid-template-columns: 1fr;
  }

  .progress-card {
    padding: 20px;
  }
}
</style>
