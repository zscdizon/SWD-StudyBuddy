
<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentStudent } from '@/services/auth'
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '@/services/journal'

const studentName = ref('Student')
const journalEntry = ref('')
const entries = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editingId = ref(null)

async function loadJournalEntries() {
  try {
    entries.value = await getJournalEntries()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function handleSaveEntry() {
  const content = journalEntry.value.trim()

  if (!content) {
    errorMessage.value = 'Please write something before saving.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (editingId.value) {
      await updateJournalEntry(editingId.value, content)
      successMessage.value = 'Your journal entry has been updated!'
    } else {
      await createJournalEntry(content)
      successMessage.value = 'Your journal entry has been saved!'
    }

    journalEntry.value = ''
    editingId.value = null
    await loadJournalEntries()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}

function startEditing(entry) {
  journalEntry.value = entry.content
  editingId.value = entry.id
  successMessage.value = ''
  errorMessage.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEditing() {
  journalEntry.value = ''
  editingId.value = null
  errorMessage.value = ''
}

async function handleDeleteEntry(id) {
  if (!window.confirm('Are you sure you want to delete this journal entry?')) {
    return
  }

  errorMessage.value = ''
  successMessage.value = ''

  try {
    await deleteJournalEntry(id)
    entries.value = entries.value.filter(entry => entry.id !== id)
    successMessage.value = 'Journal entry deleted.'
  } catch (error) {
    errorMessage.value = error.message
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

onMounted(async () => {
  try {
    const student = await getCurrentStudent()
    studentName.value =
      student?.user_metadata?.full_name || 'Student'
  } catch (error) {
    errorMessage.value = error.message
  }

  await loadJournalEntries()
})
</script>

<template>
  <main class="journal-page">
    <header class="journal-header">
      <button class="back-button" @click="$router.push('/dashboard')">
        ← BACK TO DASHBOARD
      </button>

      <p class="eyebrow">YOUR PERSONAL SPACE</p>
      <h1>My Journal 📖</h1>
      <p class="subtitle">
        A little space for your thoughts, reflections, and small victories.
      </p>
    </header>

    <section class="journal-card">
      <h2>
        {{ editingId ? 'Edit Your Entry' : "What's on your mind today?" }}
      </h2>

      <p>
        Dear {{ studentName }}, take a moment to write something for yourself.
      </p>

      <textarea
        v-model="journalEntry"
        placeholder="Write about your day, what you learned, or anything you'd like to remember..."
        rows="7"
      />

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="success-message">
        {{ successMessage }}
      </p>

      <div class="form-actions">
        <button
          class="save-button"
          :disabled="isSaving || !journalEntry.trim()"
          @click="handleSaveEntry"
        >
          {{ isSaving ? 'Saving...' : editingId ? 'Update Entry' : 'Save Entry' }}
        </button>

        <button
          v-if="editingId"
          class="cancel-button"
          @click="cancelEditing"
        >
          Cancel
        </button>
      </div>
    </section>

    <section class="entries-section">
      <h2>Your Journal Entries</h2>

      <p v-if="isLoading" class="empty-message">
        Loading your journal...
      </p>

      <p v-else-if="entries.length === 0" class="empty-message">
        No entries yet. Your first reflection can start today!
      </p>

      <article
        v-for="entry in entries"
        :key="entry.id"
        class="entry-card"
      >
        <div class="entry-heading">
          <h3>My Journal Entry</h3>
          <span>{{ formatDate(entry.created_at) }}</span>
        </div>

        <p class="entry-content">{{ entry.content }}</p>

        <div class="entry-actions">
          <button @click="startEditing(entry)">Edit</button>
          <button class="delete-button" @click="handleDeleteEntry(entry.id)">
            Delete
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.journal-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f7f1e5;
  color: #594936;
  font-family: 'Trebuchet MS', sans-serif;
}

.journal-header {
  max-width: 850px;
  margin: 0 auto 30px;
}

.back-button {
  margin-bottom: 30px;
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

.journal-card,
.entries-section {
  max-width: 850px;
  margin: 25px auto;
  padding: 28px;
  border: 2px solid #dfd2bc;
  border-radius: 14px;
  background: #fffaf0;
}

.journal-card h2,
.entries-section h2 {
  margin-top: 0;
}

.journal-card p {
  color: #88765f;
  line-height: 1.6;
}

textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border: 2px solid #dfd2bc;
  border-radius: 10px;
  background: #fffdf8;
  color: #594936;
  font: inherit;
  line-height: 1.6;
  resize: vertical;
}

textarea:focus {
  outline: 2px solid #8b9b68;
  outline-offset: 2px;
}

.form-actions,
.entry-actions {
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
  color: #b34d42 !important;
}

.success-message {
  color: #66804c !important;
}

.empty-message {
  color: #9b8b74;
  font-style: italic;
}

.entry-card {
  margin-top: 18px;
  padding: 20px;
  border: 1px solid #dfd2bc;
  border-radius: 10px;
  background: #fffdf8;
}

.entry-heading {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.entry-heading h3 {
  margin: 0;
}

.entry-heading span {
  color: #9b8b74;
  font-size: 12px;
}

.entry-content {
  margin: 18px 0;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.entry-actions button {
  padding: 8px 14px;
  border: 1px solid #c9b99f;
  border-radius: 6px;
  background: #eee5d4;
  color: #594936;
  cursor: pointer;
}

.entry-actions .delete-button {
  color: #a34d42;
}
</style>
