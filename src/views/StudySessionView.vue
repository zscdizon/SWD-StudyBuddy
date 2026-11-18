
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import {
  startStudySession,
  completeStudySession,
  getActiveStudySession,
  cancelStudySession,
} from '@/services/studySessions'

import { getSubjects } from '@/services/subjects'

const sessionDuration = 25
const subjects = ref([])
const selectedSubjectId = ref('')

const remainingSeconds = ref(sessionDuration * 60)
const sessionProgress = computed(() => {
  return (
    ((sessionDuration * 60 - remainingSeconds.value) /
      (sessionDuration * 60)) * 100
  )
})
const isRunning = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const sessionId = ref(null)
const sessionStartedAt = ref(null)
const successMessage = ref('')
const completionResult = ref(null)
const isLoadingSubjects = ref(false)

let timerInterval = null
async function loadSubjects() {
  isLoadingSubjects.value = true

  try {
    subjects.value = await getSubjects()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoadingSubjects.value = false
  }
}

function updateCountdown() {
  if (!sessionStartedAt.value) return

  const startedAt = new Date(sessionStartedAt.value).getTime()
  const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000)

  remainingSeconds.value = Math.max(
    sessionDuration * 60 - elapsedSeconds,
    0
  )

  isRunning.value = remainingSeconds.value > 0
}

function startCountdown() {
  clearInterval(timerInterval)

  updateCountdown()

  if (remainingSeconds.value > 0) {
    timerInterval = setInterval(updateCountdown, 1000)
  } else {
    isRunning.value = false
  }
}

async function loadActiveSession() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const activeSession = await getActiveStudySession()

    if (activeSession) {
      sessionId.value = activeSession.id
      sessionStartedAt.value = activeSession.started_at

      startCountdown()
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function handleStartSession() {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  completionResult.value = null

  try {
    const newSessionId = await startStudySession(
  selectedSubjectId.value || null
)

    sessionId.value = newSessionId

    const activeSession = await getActiveStudySession()

    if (!activeSession) {
      throw new Error('Unable to retrieve your new study session.')
    }

    sessionStartedAt.value = activeSession.started_at

    startCountdown()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function handleCompleteSession() {
  if (
  !sessionId.value ||
  remainingSeconds.value > 0 ||
  isLoading.value
) {
  return
}

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await completeStudySession(sessionId.value)

    completionResult.value = result
    successMessage.value = 'Study session completed! Great work!'

    clearInterval(timerInterval)

    sessionId.value = null
    sessionStartedAt.value = null
    isRunning.value = false
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function handleCancelSession() {
if (!sessionId.value || isLoading.value) return

  const confirmed = window.confirm(
    'Are you sure you want to cancel this study session? Your progress will not count toward your daily goal.'
  )

  if (!confirmed) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await cancelStudySession(sessionId.value)

    clearInterval(timerInterval)

    sessionId.value = null
    sessionStartedAt.value = null
    remainingSeconds.value = sessionDuration * 60
    isRunning.value = false

    successMessage.value = 'Study session cancelled. You can start a new quest anytime!'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSubjects()
  loadActiveSession()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

</script>

<template>
  <main class="study-session-page">
    <section class="study-session-card">
      <RouterLink to="/dashboard" class="back-link">
        ← Back to Study Room
      </RouterLink>

      <p class="eyebrow">YOUR LITTLE STUDY ADVENTURE</p>

      <h1>Focus Time!</h1>
      <p>One small quest at a time. You've got this!</p>

      <div v-if="!sessionId" class="subject-selector">
  <label for="study-subject">What are you studying today?</label>

  <select
    id="study-subject"
    v-model="selectedSubjectId"
    :disabled="isLoadingSubjects || isLoading"
  >
    <option value="">General Study Session</option>

    <option
      v-for="subject in subjects"
      :key="subject.id"
      :value="subject.id"
    >
      {{ subject.subject_code }} — {{ subject.subject_name }}
    </option>
  </select>

  <p v-if="isLoadingSubjects">Loading your subjects...</p>
</div>

      <div class="timer-display">
        {{ Math.floor(remainingSeconds / 60)
          .toString().padStart(2, '0') }}:
        {{ (remainingSeconds % 60).toString().padStart(2, '0') }}
      </div>

      <p class="timer-caption">25-minute study session</p>
      <div class="session-progress-track">
  <div
    class="session-progress-fill"
    :style="{ width: `${sessionProgress}%` }"
  ></div>
</div>

<p class="session-progress-label">
  {{ Math.floor(sessionProgress) }}% completed
</p>


<div class="timer-controls">
  <button
    v-if="!sessionId"
    class="timer-button"
    :disabled="isLoading"
    @click="handleStartSession"
  >
    {{ isLoading ? 'Starting...' : '▶ Start Study Session' }}
  </button>

  <template v-else>
    <button
      v-if="remainingSeconds > 0"
      class="timer-button"
      disabled
    >
      📖 Stay Focused!
    </button>

    <button
      v-else
      class="timer-button"
      :disabled="isLoading"
      @click="handleCompleteSession"
    >
      {{ isLoading ? 'Completing...' : '✓ Complete Session' }}
    </button>

    <button
      class="cancel-button"
      :disabled="isLoading"
      @click="handleCancelSession"
    >
      ✕ Cancel Study Session
    </button>
  </template>
</div>


<p v-if="successMessage" class="success-message">
  {{ successMessage }}
</p>

<div v-if="completionResult" class="completion-result">
  <h3>🎉 Quest Completed!</h3>
  <p>
    You completed a {{ completionResult.duration_minutes }}-minute study session!
  </p>
  <p v-if="completionResult.reward_awarded">
    ⭐ Daily reward unlocked: +{{ completionResult.xp_awarded }} XP!
  </p>
  <p v-else>
    Daily progress: {{ completionResult.daily_sessions }} / 3 sessions
  </p>
</div>


      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.study-session-page {
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.study-session-card {
  width: 100%;
  max-width: 520px;
  padding: 35px;
  text-align: center;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.back-link {
  display: block;
  margin-bottom: 35px;
  color: #826b50;
  text-align: left;
  text-decoration: none;
  font-weight: bold;
}

.eyebrow {
  color: #9b8061;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  color: #594936;
  font-size: 32px;
}

p {
  color: #82735f;
  line-height: 1.7;
}

.subject-selector {
  margin-top: 25px;
  text-align: left;
}

.subject-selector label {
  display: block;
  margin-bottom: 10px;
  color: #756047;
  font-size: 14px;
  font-weight: bold;
}

.subject-selector select {
  width: 100%;
  padding: 13px;
  color: #594936;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 8px;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 14px;
  cursor: pointer;
}

.subject-selector select:focus {
  outline: 2px solid #8b9b68;
  outline-offset: 2px;
}

.subject-selector p {
  margin-top: 8px;
  font-size: 12px;
}

.timer-display {
  margin: 35px 0 10px;
  padding: 25px;
  color: #594936;
  background: #f1ead9;
  border: 3px solid #c9b99f;
  border-radius: 10px;
  font-size: 64px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}

.timer-caption {
  font-size: 13px;
  font-weight: bold;
}

.session-progress-track {
  width: 100%;
  height: 14px;
  margin-top: 18px;
  overflow: hidden;
  background: #e2d7c2;
  border: 2px solid #b7a58b;
  border-radius: 5px;
}

.session-progress-fill {
  height: 100%;
  background: #8b9b68;
  transition: width 0.5s ease;
}

.session-progress-label {
  margin-top: 8px;
  color: #8b7658;
  font-size: 12px;
  font-weight: bold;
}

.error-message {
  color: #a33f35;
}

.timer-controls {
  margin-top: 25px;
}

.timer-button {
  width: 100%;
  padding: 16px 20px;
  color: #fffaf0;
  background: #8b7658;
  border: 2px solid #665544;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.timer-button:hover:not(:disabled) {
  background: #746044;
  transform: translateY(-2px);
}

.timer-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.cancel-button {
  width: 100%;
  margin-top: 12px;
  padding: 12px 20px;
  color: #9b5145;
  background: transparent;
  border: 2px solid #c99b8d;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.cancel-button:hover:not(:disabled) {
  background: #f5e6df;
  transform: translateY(-1px);
}

.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  color: #66804f;
  font-weight: bold;
}

.completion-result {
  margin-top: 22px;
  padding: 20px;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 10px;
}

.completion-result h3 {
  color: #756047;
}

.completion-result p {
  font-size: 14px;
}

</style>
