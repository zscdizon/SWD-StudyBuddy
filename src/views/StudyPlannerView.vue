
<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSubjects } from '@/services/subjects'
import {
  getStudyTasks,
  createStudyTask,
  updateStudyTask,
  toggleStudyTask,
  deleteStudyTask,
} from '@/services/studyPlanner'

const tasks = ref([])
const subjects = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editingId = ref(null)

const form = ref({
  title: '',
  description: '',
  subject_id: '',
  due_date: '',
})

const completedCount = computed(
  () => tasks.value.filter(task => task.is_completed).length
)

const pendingCount = computed(
  () => tasks.value.filter(task => !task.is_completed).length
)

const activeFilter = ref('all')

const filteredTasks = computed(() => {
  if (activeFilter.value === 'pending') {
    return tasks.value.filter(task => !task.is_completed)
  }

  if (activeFilter.value === 'completed') {
    return tasks.value.filter(task => task.is_completed)
  }

  return tasks.value
})

async function loadData() {
  try {
    const [taskData, subjectData] = await Promise.all([
      getStudyTasks(),
      getSubjects(),
    ])
    tasks.value = taskData
    subjects.value = subjectData
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  form.value = {
    title: '',
    description: '',
    subject_id: '',
    due_date: '',
  }
  editingId.value = null
}

async function handleSaveTask() {
  if (!form.value.title.trim()) {
    errorMessage.value = 'Please enter a task title.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const task = {
    ...form.value,
    title: form.value.title.trim(),
  }

  try {
    if (editingId.value) {
      await updateStudyTask(editingId.value, task)
      successMessage.value = 'Your task has been updated!'
    } else {
      await createStudyTask(task)
      successMessage.value = 'A new task has been added!'
    }

    resetForm()
    await loadData()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}

function startEditing(task) {
  editingId.value = task.id
  form.value = {
    title: task.title,
    description: task.description || '',
    subject_id: task.subject_id || '',
    due_date: task.due_date || '',
  }
  successMessage.value = ''
  errorMessage.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleToggleTask(task) {
  errorMessage.value = ''
  try {
    await toggleStudyTask(task.id, !task.is_completed)
    task.is_completed = !task.is_completed
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function handleDeleteTask(id) {
  if (!window.confirm('Are you sure you want to delete this task?')) return

  errorMessage.value = ''
  successMessage.value = ''

  try {
    await deleteStudyTask(id)
    tasks.value = tasks.value.filter(task => task.id !== id)
    successMessage.value = 'Task deleted.'
  } catch (error) {
    errorMessage.value = error.message
  }
}

function getSubjectName(subjectId) {
  const subject = subjects.value.find(item => item.id === subjectId)
  return subject
    ? `${subject.subject_code} — ${subject.subject_name}`
    : 'General Study Task'
}

function isOverdue(task) {
  if (!task.due_date || task.is_completed) return false

  const today = new Date()
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const dueDate = new Date(`${task.due_date}T00:00:00`)

  return dueDate < todayDate
}

function formatDate(date) {
  if (!date) return 'No due date'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(loadData)
</script>

<template>
  <main class="planner-page">
    <header class="planner-header">
      <button class="back-button" @click="$router.push('/dashboard')">
        ← BACK TO DASHBOARD
      </button>

      <p class="eyebrow">YOUR STUDY ORGANIZER</p>
      <h1>My Study Planner 📅</h1>
      <p class="subtitle">
        Small steps, organized days, and one task closer to your goals.
      </p>
    </header>

    <section class="summary-row">
      <div class="summary-card">
        <span>📌</span>
        <strong>{{ pendingCount }}</strong>
        <p>Tasks to do</p>
      </div>
      <div class="summary-card">
        <span>🌟</span>
        <strong>{{ completedCount }}</strong>
        <p>Completed</p>
      </div>
      <div class="summary-card">
        <span>📝</span>
        <strong>{{ tasks.length }}</strong>
        <p>Total tasks</p>
      </div>
    </section>

    <section class="planner-card">
      <h2>{{ editingId ? 'Edit Your Task' : 'Add a New Task ✏️' }}</h2>
      <p>Plan what you want to accomplish next.</p>

      <form @submit.prevent="handleSaveTask">
        <label for="task-title">Task title</label>
        <input
          id="task-title"
          v-model="form.title"
          type="text"
          maxlength="150"
          placeholder="e.g. Review Chapter 3"
          required
        />

        <label for="task-description">Description (optional)</label>
        <textarea
          id="task-description"
          v-model="form.description"
          rows="3"
          placeholder="Add a few details about this task..."
        />

        <label for="task-subject">Related subject</label>
        <select id="task-subject" v-model="form.subject_id">
          <option value="">General Study Task</option>
          <option
            v-for="subject in subjects"
            :key="subject.id"
            :value="subject.id"
          >
            {{ subject.subject_code }} — {{ subject.subject_name }}
          </option>
        </select>

        <label for="task-date">Due date (optional)</label>
        <input id="task-date" v-model="form.due_date" type="date" />

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <div class="form-actions">
          <button class="save-button" type="submit" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : editingId ? 'Update Task' : 'Add Task' }}
          </button>
          <button
            v-if="editingId"
            class="cancel-button"
            type="button"
            @click="resetForm"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="tasks-section">
      <h2>Your Tasks 📚</h2>

      <div class="task-filters">
  <button
    :class="{ active: activeFilter === 'all' }"
    @click="activeFilter = 'all'"
  >
    ALL
  </button>

  <button
    :class="{ active: activeFilter === 'pending' }"
    @click="activeFilter = 'pending'"
  >
    PENDING
  </button>

  <button
    :class="{ active: activeFilter === 'completed' }"
    @click="activeFilter = 'completed'"
  >
    COMPLETED
  </button>
</div>

      <p v-if="isLoading" class="empty-message">
        Loading your tasks...
      </p>

      <p v-else-if="tasks.length === 0" class="empty-message">
        Your planner is empty. Add your first task above!
      </p>

      <article
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.is_completed }"
      >
        <div class="task-main">
          <input
            type="checkbox"
            :checked="task.is_completed"
            :aria-label="`Mark ${task.title} as ${task.is_completed ? 'incomplete' : 'complete'}`"
            @change="handleToggleTask(task)"
          />

          <div class="task-details">
            <h3>{{ task.title }}</h3>
            <p v-if="task.description">{{ task.description }}</p>
            <span class="task-subject">
              {{ getSubjectName(task.subject_id) }}
            </span>
            <div class="task-date-row">
  <span class="task-date">
    📅 {{ formatDate(task.due_date) }}
  </span>

  <span v-if="isOverdue(task)" class="overdue-label">
    OVERDUE
  </span>
</div>
          </div>
        </div>

        <div class="task-actions">
          <button @click="startEditing(task)">Edit</button>
          <button class="delete-button" @click="handleDeleteTask(task.id)">
            Delete
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.planner-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f7f1e5;
  color: #594936;
  font-family: 'Trebuchet MS', sans-serif;
}

.planner-header,
.planner-card,
.tasks-section {
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
}

.planner-header {
  margin-bottom: 25px;
}

.back-button {
  margin-bottom: 25px;
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.eyebrow {
  color: #8b9b68;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  margin: 8px 0;
  font-size: 34px;
}

.subtitle {
  color: #88765f;
  line-height: 1.6;
}

.summary-row {
  max-width: 850px;
  margin: 25px auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.summary-card {
  padding: 20px;
  text-align: center;
  background: #eee5d4;
  border: 2px solid #dfd2bc;
  border-radius: 12px;
}

.summary-card span {
  display: block;
  font-size: 24px;
}

.summary-card strong {
  display: block;
  margin-top: 7px;
  font-size: 25px;
}

.summary-card p {
  margin-bottom: 0;
  color: #88765f;
  font-size: 13px;
}

.planner-card,
.tasks-section {
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 28px;
  border: 2px solid #dfd2bc;
  border-radius: 14px;
  background: #fffaf0;
}

.planner-card h2,
.tasks-section h2 {
  margin-top: 0;
}

.planner-card > p {
  color: #88765f;
}

form label {
  display: block;
  margin: 17px 0 7px;
  font-size: 14px;
  font-weight: bold;
}

form input:not([type="checkbox"]),
form textarea,
form select {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 2px solid #dfd2bc;
  border-radius: 8px;
  background: #fffdf8;
  color: #594936;
  font: inherit;
}

form textarea {
  resize: vertical;
  line-height: 1.5;
}

form input:focus,
form textarea:focus,
form select:focus {
  outline: 2px solid #8b9b68;
  outline-offset: 2px;
}

.form-actions,
.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.save-button,
.cancel-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #8b9b68;
  color: white;
  cursor: pointer;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  background: #a99a82;
}

.error-message {
  color: #b34d42;
}

.success-message {
  color: #66804c;
}

.empty-message {
  color: #9b8b74;
  font-style: italic;
}

.task-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0 22px;
}

.task-filters button {
  padding: 9px 16px;
  border: 2px solid #dfd2bc;
  border-radius: 7px;
  background: #eee5d4;
  color: #665544;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.task-filters button:hover {
  background: #e3d8c4;
}

.task-filters button.active {
  background: #8b9b68;
  border-color: #8b9b68;
  color: white;
}

.task-card {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid #dfd2bc;
  border-radius: 10px;
  background: #fffdf8;
}

.task-main {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.task-main input {
  width: 18px;
  height: 18px;
  margin-top: 4px;
  accent-color: #8b9b68;
  cursor: pointer;
}

.task-details {
  min-width: 0;
}

.task-details h3 {
  margin: 0 0 7px;
  overflow-wrap: anywhere;
}

.task-details p {
  margin: 0 0 10px;
  color: #88765f;
  line-height: 1.5;
  white-space: pre-wrap;
}

.task-subject,
.task-date {
  display: block;
  margin-top: 7px;
  color: #88765f;
  font-size: 12px;
}

.task-date-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 7px;
}

.task-date-row .task-date {
  margin-top: 0;
}

.overdue-label {
  padding: 4px 8px;
  color: #a34d42;
  background: #f8e5df;
  border: 1px solid #d9aaa0;
  border-radius: 5px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.task-card.completed .task-details h3 {
  color: #9b8b74;
  text-decoration: line-through;
}

.task-actions button {
  padding: 8px 14px;
  border: 1px solid #c9b99f;
  border-radius: 6px;
  background: #eee5d4;
  color: #594936;
  cursor: pointer;
}

.task-actions .delete-button {
  color: #a34d42;
}

@media (max-width: 600px) {
  .planner-page {
    padding: 25px 5%;
  }

  .summary-row {
    gap: 8px;
  }

  .summary-card {
    padding: 14px 8px;
  }

  .planner-card,
  .tasks-section {
    padding: 20px;
  }

  h1 {
    font-size: 28px;
  }
}
</style>
