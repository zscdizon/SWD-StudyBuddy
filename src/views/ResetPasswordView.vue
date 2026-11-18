<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { updateStudentPassword } from '@/services/auth'

const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isCheckingSession = ref(true)
const isRecoveryValid = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

let authListener = null

onMounted(async () => {
  const { data } = await supabase.auth.getSession()

  isRecoveryValid.value = !!data.session

  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        isRecoveryValid.value = true
      }
    }
  )

  authListener = listener.subscription

  isCheckingSession.value = false
})

onUnmounted(() => {
  authListener?.unsubscribe()
})

async function handlePasswordUpdate() {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value.length < 8) {
    errorMessage.value = 'Your password must contain at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Your passwords do not match.'
    return
  }

  isLoading.value = true

  try {
    await updateStudentPassword(password.value)

    password.value = ''
    confirmPassword.value = ''

    successMessage.value =
      'Your password has been updated successfully! You can now log in.'

    isRecoveryValid.value = false

    await supabase.auth.signOut()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
 

<template>
  <main class="reset-page">
    <section class="reset-card">
      <div class="mascot">
        <img
          src="/images/studybuddy-cat.gif"
          alt="StudyBuddy cat mascot"
        />
      </div>

      <p class="eyebrow">A FRESH START AWAITS</p>

      <h1>Reset Password</h1>

      <p class="subtitle">
        Choose a new password for your StudyBuddy account.
        Let's get you back to your learning adventure!
      </p>

      <p v-if="isCheckingSession" class="info-message">
        Checking your recovery link...
      </p>

      <template v-else-if="isRecoveryValid">
        <form class="reset-form" @submit.prevent="handlePasswordUpdate">
          <label for="password">New Password</label>

<div class="password-wrapper">
  <input
    id="password"
    v-model="password"
    :type="showPassword ? 'text' : 'password'"
    placeholder="Enter your new password"
    autocomplete="new-password"
    minlength="8"
    required
  />

  <button
    type="button"
    class="toggle-password"
    @click="showPassword = !showPassword"
    :aria-label="showPassword ? 'Hide password' : 'Show password'"
  >
    {{ showPassword ? '🙈' : '👁️' }}
  </button>
</div>

          <label for="confirmPassword">Confirm New Password</label>

<div class="password-wrapper">
  <input
    id="confirmPassword"
    v-model="confirmPassword"
    :type="showConfirmPassword ? 'text' : 'password'"
    placeholder="Re-enter your new password"
    autocomplete="new-password"
    minlength="8"
    required
  />

  <button
    type="button"
    class="toggle-password"
    @click="showConfirmPassword = !showConfirmPassword"
    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
  >
    {{ showConfirmPassword ? '🙈' : '👁️' }}
  </button>
</div>

          <button
            type="submit"
            class="reset-button"
            :disabled="isLoading"
          >
            {{ isLoading ? 'UPDATING...' : 'UPDATE PASSWORD' }}
          </button>
        </form>
      </template>

      <p v-else-if="!successMessage" class="error-message">
        Your recovery link is invalid or has expired.
        Please request a new password recovery email.
      </p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="success-message">
        {{ successMessage }}
      </p>

      <button
        v-if="successMessage || (!isCheckingSession && !isRecoveryValid)"
        type="button"
        class="back-button"
        @click="goToLogin"
      >
        ← BACK TO LOGIN
      </button>

      <p class="footer-text">
        Every little step counts. Keep going!
      </p>
    </section>
  </main>
</template>

<style scoped>
.reset-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.reset-card {
  width: 100%;
  max-width: 460px;
  padding: 42px 38px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
  text-align: center;
  animation: card-entrance 0.7s ease-out both;
}

@keyframes card-entrance {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mascot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  margin: 0 auto 18px;
  background: #e9dfc9;
  border: 3px solid #665544;
  border-radius: 10px;
}

.mascot img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: mascot-float 3s ease-in-out infinite;
}

@keyframes mascot-float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.eyebrow {
  margin-bottom: 9px;
  color: #9b8061;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  margin: 0;
  color: #594936;
  font-size: 32px;
}

.subtitle {
  margin: 12px 0 25px;
  color: #82735f;
  font-size: 14px;
  line-height: 1.6;
}

.reset-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.reset-form label {
  margin: 13px 0 7px;
  color: #665544;
  font-size: 13px;
  font-weight: bold;
}

.reset-form input {
  width: 100%;
  min-height: 46px;
  padding: 12px;
  color: #594936;
  background: #fffdf7;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.reset-form input:focus {
  border-color: #8d9b72;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 17px;
}

.toggle-password:hover {
  opacity: 0.7;
}

.reset-button {
  min-height: 50px;
  margin-top: 25px;
  color: #fffaf0;
  background: #8d9b72;
  border: 3px solid #665544;
  border-radius: 7px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
}

.reset-button:hover {
  background: #7c8c63;
}

.reset-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error-message,
.success-message,
.info-message {
  margin: 0 0 15px;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
}

.error-message {
  color: #9b4545;
  background: #f8e5df;
  border: 2px solid #d9a49a;
}

.success-message {
  color: #536b42;
  background: #e8efdc;
  border: 2px solid #a9bb91;
}

.info-message {
  color: #665544;
  background: #eee3ce;
  border: 2px solid #c9b99f;
}

.back-button {
  margin-top: 22px;
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.footer-text {
  margin: 25px 0 0;
  color: #a4947d;
  font-size: 11px;
}
</style>
