
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const router = useRouter()

const statusMessage = ref('Verifying your email...')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!data.session) {
      throw new Error(
        'We could not verify your session. Please try logging in.'
      )
    }

    statusMessage.value = 'Email verified! Welcome to StudyBuddy!'

    setTimeout(() => {
      router.replace('/onboarding')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message
    statusMessage.value = 'Verification unsuccessful.'
  }
})
</script>

<template>
  <main class="callback-page">
    <section class="callback-card">
      <div class="mascot">🐱</div>

      <p class="eyebrow">STUDYBUDDY ACCOUNT VERIFICATION</p>

      <h1>{{ statusMessage }}</h1>

      <p v-if="!errorMessage" class="subtitle">
        Please wait while we prepare your study adventure.
      </p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.callback-card {
  width: 100%;
  max-width: 480px;
  padding: 45px 35px;
  text-align: center;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.mascot {
  margin-bottom: 18px;
  font-size: 65px;
}

.eyebrow {
  color: #9b8061;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  color: #594936;
  font-size: 28px;
}

.subtitle {
  color: #82735f;
  font-size: 14px;
  line-height: 1.7;
}

.error-message {
  padding: 12px;
  color: #9b4545;
  background: #f8e5df;
  border: 2px solid #d9a49a;
  border-radius: 6px;
  font-size: 13px;
}
</style>
