
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSubjectById } from '@/services/subjects'
import {
  getSubjectNotes,
  createSubjectNote,
  updateSubjectNote,
  deleteSubjectNote,
} from '@/services/notes'

const route = useRoute()
const router = useRouter()

const subject = ref(null)
const notes = ref([])
const noteTitle = ref('')
const noteContent = ref('')
const isSaving = ref(false)
const editingNoteId = ref(null)
const deletingNoteId = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const noteError = ref('')

function goBack() {
  router.push('/subjects')
}

function startEditingNote(note) {
  editingNoteId.value = note.id
  noteTitle.value = note.title
  noteContent.value = note.content
  noteError.value = ''
}

function cancelEditingNote() {
  editingNoteId.value = null
  noteTitle.value = ''
  noteContent.value = ''
  noteError.value = ''
}

async function handleDeleteNote(noteId) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this note?'
  )

  if (!confirmed) return

  deletingNoteId.value = noteId
  noteError.value = ''

  try {
    await deleteSubjectNote(noteId)

    notes.value = notes.value.filter(
      (note) => note.id !== noteId
    )

    if (editingNoteId.value === noteId) {
      cancelEditingNote()
    }
  } catch (error) {
    noteError.value = error.message
  } finally {
    deletingNoteId.value = null
  }
}

async function handleCreateNote() {
  const title = noteTitle.value.trim()

  if (!title) {
    noteError.value = 'Please enter a note title.'
    return
  }

  isSaving.value = true
  noteError.value = ''

  try {
    const content = noteContent.value.trim()

    if (editingNoteId.value) {
      const updatedNote = await updateSubjectNote(
        editingNoteId.value,
        title,
        content
      )

      notes.value = [
        updatedNote,
        ...notes.value.filter((note) => note.id !== updatedNote.id),
      ]
    } else {
      const newNote = await createSubjectNote(
        subject.value.id,
        title,
        content
      )

      notes.value.unshift(newNote)
    }

    editingNoteId.value = null
    noteTitle.value = ''
    noteContent.value = ''
  } catch (error) {
    noteError.value = error.message
  } finally {
    isSaving.value = false
  }
}


onMounted(async () => {
  try {
    const [subjectData, notesData] = await Promise.all([
  getSubjectById(route.params.id),
  getSubjectNotes(route.params.id),
])

subject.value = subjectData
notes.value = notesData
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="subject-detail-page">
    <section class="subject-detail-container">

      <header class="detail-header">
        <button class="back-button" @click="goBack">
          ← BACK TO SUBJECTS
        </button>

        <div class="page-brand">
          <span class="brand-mascot">🐱</span>
          <span class="brand-name">StudyBuddy</span>
        </div>
      </header>

      <p v-if="isLoading" class="status-message">
        Opening your subject notebook...
      </p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <template v-else-if="subject">
        <section class="subject-intro">
          <p class="eyebrow">YOUR PERSONAL STUDY NOTEBOOK</p>

          <span class="subject-code">
            {{ subject.subject_code }}
          </span>

          <h1>{{ subject.subject_name }}</h1>

          <p>
            {{ subject.units }} Units
            · Year {{ subject.year_level }}
            · {{ subject.semester }}
          </p>
        </section>

        
<section class="notebook-section">
  <span class="notebook-icon">📖</span>

  <h2>Your Personal Notebook</h2>

  <p class="notebook-description">
    Keep your thoughts, lessons, and important concepts
    organized in one cozy space.
  </p>

  
<form class="note-form" @submit.prevent="handleCreateNote">
  <input
    v-model="noteTitle"
    type="text"
    placeholder="Give your note a title..."
    maxlength="150"
    required
  />

  <textarea
    v-model="noteContent"
    placeholder="Start writing your study notes here..."
    rows="6"
  ></textarea>

  <p v-if="noteError" class="note-error">
    {{ noteError }}
  </p>

  <button
    type="submit"
    class="save-note-button"
    :disabled="isSaving"
  >
    {{ isSaving ? 'SAVING...' : editingNoteId ? 'UPDATE NOTE' : '+ SAVE NOTE' }}
  </button>

  <button
    v-if="editingNoteId"
    type="button"
    class="cancel-edit-button"
    @click="cancelEditingNote"
  >
    CANCEL EDITING
  </button>
</form>

<div class="saved-notes">
  <h3>Your Saved Notes</h3>

  <p v-if="notes.length === 0" class="empty-notes">
    No notes yet. Create your first study note!
  </p>

  <article
    v-for="note in notes"
    :key="note.id"
    class="saved-note-card"
  >
    <h4>{{ note.title }}</h4>

    <p>{{ note.content || 'No content added yet.' }}</p>

    <button
      type="button"
      class="edit-note-button"
      @click="startEditingNote(note)"
    >
      EDIT NOTE
    </button>

<button
  type="button"
  class="delete-note-button"
  :disabled="deletingNoteId === note.id"
  @click="handleDeleteNote(note.id)"
>
  {{ deletingNoteId === note.id ? 'DELETING...' : 'DELETE NOTE' }}
</button>

  </article>
</div>

</section>

      </template>

    </section>
  </main>
</template>


<style scoped>
.subject-detail-page {
  min-height: 100vh;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.subject-detail-container {
  max-width: 1100px;
  min-height: 80vh;
  margin: 0 auto;
  padding: 35px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.detail-header {
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

.subject-intro {
  margin: 45px 0 30px;
}

.eyebrow {
  color: #9b8061;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}

.subject-code {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 10px;
  color: #665544;
  background: #e9dfc9;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.subject-intro h1 {
  margin: 15px 0 10px;
  color: #594936;
  font-size: 28px;
  line-height: 1.5;
}

.subject-intro p {
  color: #82735f;
  font-size: 13px;
  line-height: 1.7;
}

.notebook-section {
  padding: 35px 25px;
  text-align: center;
  background: #f1ead9;
  border: 2px dashed #c9b99f;
  border-radius: 10px;
}

.notebook-icon {
  font-size: 45px;
}

.notebook-section h2 {
  color: #594936;
  font-size: 21px;
}

.notebook-section p {
  max-width: 450px;
  margin: 0 auto;
  color: #82735f;
  font-size: 13px;
  line-height: 1.7;
}

.notebook-description {
  margin-bottom: 28px !important;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 700px;
  margin: 0 auto;
  text-align: left;
}

.note-form input,
.note-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  color: #594936;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 7px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

.note-form input:focus,
.note-form textarea:focus {
  border-color: #9b8061;
}

.note-form textarea {
  resize: vertical;
  line-height: 1.7;
}

.note-error {
  color: #9b463d !important;
  font-size: 12px;
}

.save-note-button {
  align-self: flex-start;
  min-height: 43px;
  padding: 0 22px;
  color: #fffaf0;
  background: #a66f5b;
  border: 3px solid #665544;
  border-radius: 7px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
}

.save-note-button:hover {
  background: #905b49;
}

.save-note-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-note-button,
.cancel-edit-button {
  min-height: 38px;
  margin-top: 12px;
  padding: 0 16px;
  color: #665544;
  background: #e9dfc9;
  border: 2px solid #665544;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
}

.edit-note-button:hover,
.cancel-edit-button:hover {
  background: #d7c5a8;
}

.delete-note-button {
  min-height: 38px;
  margin-top: 12px;
  margin-left: 8px;
  padding: 0 16px;
  color: #fffaf0;
  background: #a66f5b;
  border: 2px solid #665544;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
}

.delete-note-button:hover {
  background: #905b49;
}

.delete-note-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-edit-button {
  margin-top: 0;
}

.saved-notes {
  max-width: 700px;
  margin: 40px auto 0;
  padding-top: 25px;
  border-top: 2px solid #d7c5a8;
  text-align: left;
}

.saved-notes h3 {
  color: #594936;
  font-size: 19px;
}

.empty-notes {
  color: #9b8061;
  font-size: 13px;
}

.saved-note-card {
  margin-top: 15px;
  padding: 20px;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 8px;
}

.saved-note-card h4 {
  margin: 0 0 10px;
  color: #594936;
  font-size: 15px;
}

.saved-note-card p {
  margin: 0;
  color: #82735f;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.status-message {
  padding: 25px;
  color: #82735f;
  text-align: center;
}

.error-message {
  padding: 18px;
  color: #9b463d;
  background: #f8e5df;
  border: 2px solid #d9aaa0;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .subject-detail-page {
    padding: 20px 14px;
  }

  .subject-detail-container {
    padding: 22px 18px;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .subject-intro {
    margin: 32px 0 24px;
  }

  .subject-intro h1 {
    font-size: 24px;
  }

  .notebook-section {
    padding: 30px 18px;
  }
}
</style>
