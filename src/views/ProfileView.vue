<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import {
  getCurrentStudent,
  getStudentProfile,
  updateStudentProfile,
} from '@/services/auth'

import { uploadAvatar } from '@/services/avatars'

const studentProfile = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const isSaving = ref(false)
const isEditing = ref(false)

const editForm = ref({
  fullName: '',
  yearLevel: '',
})

const avatarInput = ref(null)
const isUploadingAvatar = ref(false)
const avatarError = ref('')
const cropperImage = ref(null)
const cropperInstance = ref(null)
const cropperImageUrl = ref('')
const selectedImageFile = ref(null)
const isCropperOpen = ref(false)
const zoomLevel = ref(0)
const rotation = ref(0)

async function loadProfile() {
  try {
    const student = await getCurrentStudent()

    if (!student) {
      throw new Error('Student account not found.')
    }

    studentProfile.value = await getStudentProfile(student.id)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function startEditing() {
  editForm.value = {
    fullName: studentProfile.value.full_name || '',
    yearLevel: String(studentProfile.value.year_level || ''),
  }

  isEditing.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

function cancelEditing() {
  isEditing.value = false
  errorMessage.value = ''
}

async function saveProfile() {
  if (!editForm.value.fullName.trim() || !editForm.value.yearLevel) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const updatedProfile = await updateStudentProfile(
      studentProfile.value.id,
      {
        fullName: editForm.value.fullName.trim(),
        yearLevel: Number(editForm.value.yearLevel),
      }
    )

    studentProfile.value = updatedProfile
    isEditing.value = false
    successMessage.value = 'Your profile has been updated!'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}

function openAvatarPicker() {
  avatarInput.value?.click()
}

async function handleAvatarUpload(event) {
  const file = event.target.files?.[0]

  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    avatarError.value = 'Please upload a JPG, PNG, or WebP image.'
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = 'Your image must be 5 MB or smaller.'
    event.target.value = ''
    return
  }

    if (cropperImageUrl.value) {
    URL.revokeObjectURL(cropperImageUrl.value)
  }

  selectedImageFile.value = file
  cropperImageUrl.value = URL.createObjectURL(file)

  avatarError.value = ''
  zoomLevel.value = 0
  rotation.value = 0
  isCropperOpen.value = true
  await nextTick()

  if (cropperInstance.value) {
    cropperInstance.value.destroy()
  }

  cropperInstance.value = new Cropper(cropperImage.value, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 1,
    responsive: true,
    background: false,
    guides: true,
    center: true,
    highlight: false,
    preview: '.avatar-crop-preview',
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    ready() {
      cropperInstance.value?.crop()
    },
  })

  event.target.value = ''
}

function zoomIn() {
  cropperInstance.value?.zoom(0.1)
}

function zoomOut() {
  cropperInstance.value?.zoom(-0.1)
}

function rotateLeft() {
  cropperInstance.value?.rotate(-90)
  rotation.value -= 90
}

function rotateRight() {
  cropperInstance.value?.rotate(90)
  rotation.value += 90
}

function closeCropper() {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }

  isCropperOpen.value = false
  selectedImageFile.value = null

  if (cropperImageUrl.value) {
    URL.revokeObjectURL(cropperImageUrl.value)
    cropperImageUrl.value = ''
  }
}

async function saveCroppedAvatar() {
  if (!cropperInstance.value) return

  isUploadingAvatar.value = true
  avatarError.value = ''

  try {
    const canvas = cropperInstance.value.getCroppedCanvas({
      width: 512,
      height: 512,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error('Could not process your cropped image.'))
        }
      }, 'image/png')
    })

    const croppedFile = new File([blob], 'avatar.png', {
      type: 'image/png',
    })

    const avatarUrl = await uploadAvatar(
      croppedFile,
      studentProfile.value.id
    )

    studentProfile.value.avatar_url = avatarUrl
    successMessage.value = 'Your profile picture has been updated!'

    closeCropper()
  } catch (error) {
    avatarError.value = error.message
  } finally {
    isUploadingAvatar.value = false
  }
}

onMounted(loadProfile)
</script>


<template>
  <main class="profile-page">
    <header class="profile-header">
  <RouterLink to="/dashboard" class="back-button">
    ← BACK TO DASHBOARD
  </RouterLink>

  <h1>My Profile 👤</h1>
  <p>Your StudyBuddy identity and journey.</p>
</header>

    <p v-if="isLoading">Loading your profile...</p>

    <section v-else-if="studentProfile" class="profile-card">

  <div class="avatar-section">
    <img
      v-if="studentProfile.avatar_url"
      :src="studentProfile.avatar_url"
      alt="Profile picture"
      class="profile-avatar"
    />

    <div v-else class="avatar-placeholder">
      👤
    </div>

    <button
      class="avatar-button"
      type="button"
      @click="openAvatarPicker"
      :disabled="isUploadingAvatar"
    >
      {{ isUploadingAvatar ? 'UPLOADING...' : '📷 CHANGE PROFILE PICTURE' }}
    </button>

    <input
      ref="avatarInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      @change="handleAvatarUpload"
    />

    <p class="avatar-hint">JPG, PNG, or WebP · Maximum 5 MB</p>

    <p v-if="avatarError" class="error-message">
      {{ avatarError }}
    </p>
  </div>

  <h2>Student Information</h2>

      <template v-if="!isEditing">
        <p>
          <strong>Full Name:</strong>
          {{ studentProfile.full_name }}
        </p>

        <p>
          <strong>Year Level:</strong>
          {{ studentProfile.year_level }}
        </p>

        <button class="edit-button" @click="startEditing">
          ✏️ EDIT PROFILE
        </button>
      </template>

      <form v-else @submit.prevent="saveProfile">
        <label for="profile-name">Full Name</label>
        <input
          id="profile-name"
          v-model="editForm.fullName"
          type="text"
          maxlength="150"
          required
        />

        <label for="profile-year">Year Level</label>
        <select id="profile-year" v-model="editForm.yearLevel" required>
          <option value="">Select Year Level</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <div class="form-actions">
          <button class="save-button" type="submit" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'SAVE CHANGES' }}
          </button>

          <button
            class="cancel-button"
            type="button"
            @click="cancelEditing"
          >
            CANCEL
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="success-message">
        {{ successMessage }}
      </p>
    </section>
        <div v-if="isCropperOpen" class="cropper-modal-overlay">
      <div class="avatar-editor-modal">
        <h2>Adjust Your Profile Picture</h2>
        <p>Drag your image to position it inside the square.</p>

        <div class="cropper-image-container">
          <img
            ref="cropperImage"
            :src="cropperImageUrl"
            alt="Image being cropped"
          />
        </div>

        <div class="avatar-crop-preview"></div>
        <div class="cropper-controls">
  <button type="button" @click="zoomOut">−</button>
  <button type="button" @click="zoomIn">+</button>
  <button type="button" @click="rotateLeft">↶ ROTATE LEFT</button>
  <button type="button" @click="rotateRight">ROTATE RIGHT ↷</button>
</div>

<div class="cropper-actions">
  <button
    type="button"
    class="save-button"
    @click="saveCroppedAvatar"
    :disabled="isUploadingAvatar"
  >
    {{ isUploadingAvatar ? 'SAVING...' : 'SAVE PROFILE PICTURE' }}
  </button>

  <button
    type="button"
    class="cancel-button"
    @click="closeCropper"
    :disabled="isUploadingAvatar"
  >
    CANCEL
  </button>
</div>
      </div>
    </div>

    <p v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
  </main>
</template>


<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f7f1e5;
  color: #594936;
  font-family: 'Trebuchet MS', sans-serif;
}

.profile-header {
  margin-bottom: 25px;
}

.profile-header h1 {
  margin-bottom: 8px;
  font-size: 28px;
}

.profile-header p {
  color: #8b7964;
  font-size: 14px;
}

.profile-card {
  max-width: 650px;
  margin-top: 25px;
  padding: 25px;
  background: #fffaf0;
  border: 2px solid #dfd2bc;
  border-radius: 14px;
}

.profile-card h2 {
  margin-bottom: 20px;
  font-size: 19px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 2px dashed #dfd2bc;
}

.profile-avatar,
.avatar-placeholder {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 4px solid #dfd2bc;
}

.profile-avatar {
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1ead9;
  font-size: 48px;
}

.avatar-button {
  margin-top: 15px;
  padding: 11px 17px;
  color: white;
  background: #8b9b68;
  border: 2px solid #8b9b68;
  border-radius: 7px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.avatar-button:hover {
  background: #788957;
}

.avatar-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.avatar-hint {
  margin-top: 9px;
  color: #8b7964;
  font-size: 11px;
  text-align: center;
}

.profile-card p {
  margin: 14px 0;
  font-size: 14px;
}

.profile-card label {
  display: block;
  margin: 18px 0 8px;
  font-size: 13px;
  font-weight: bold;
}

.profile-card input,
.profile-card select {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  color: #594936;
  background: #fffdf8;
  border: 2px solid #dfd2bc;
  border-radius: 7px;
  font-family: inherit;
  font-size: 14px;
}

.profile-card input:focus,
.profile-card select:focus {
  outline: none;
  border-color: #8b9b68;
}

.edit-button,
.save-button,
.cancel-button {
  margin-top: 20px;
  padding: 11px 17px;
  border: 2px solid transparent;
  border-radius: 7px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.edit-button,
.save-button {
  color: white;
  background: #8b9b68;
  border-color: #8b9b68;
}

.edit-button:hover,
.save-button:hover {
  background: #788957;
}

.cancel-button {
  color: #665544;
  background: #f1ead9;
  border-color: #c9b99f;
}

.cancel-button:hover {
  background: #e7ddca;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.form-actions button {
  margin-top: 20px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #a34d42;
  font-size: 13px;
}

.success-message {
  color: #657b45;
  font-size: 13px;
}

/* Image editor modal */
.cropper-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px;
  background: rgba(45, 35, 25, 0.7);
}

.avatar-editor-modal {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 25px;
  background: #fffaf0;
  border: 2px solid #dfd2bc;
  border-radius: 14px;
  text-align: center;
}

.cropper-modal h2 {
  margin-bottom: 10px;
  font-size: 20px;
}

.cropper-modal p {
  margin-bottom: 18px;
  color: #8b7964;
  font-size: 13px;
}

.cropper-image-container {
  width: 100%;
  height: 320px;
  margin: 0 auto 20px;
  overflow: hidden;
  background: #eee5d4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cropper-image-container img {
  display: block;
  max-width: 100%;
}

.avatar-crop-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  overflow: hidden;
  border: 4px solid #dfd2bc;
  border-radius: 50%;
  background: #f1ead9;
}

.cropper-controls,
.cropper-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.cropper-controls button {
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 7px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.cropper-controls button:hover {
  background: #e7ddca;
}

.cropper-actions button {
  margin-top: 5px;
}

.back-button {
  display: inline-block;
  margin-bottom: 25px;
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

</style>
