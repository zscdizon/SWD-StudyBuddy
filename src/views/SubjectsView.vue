<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <main class="subjects-page">
    <section class="subjects-container">
      <header class="subjects-header">
        <button class="back-button" @click="goToDashboard">
          ← BACK TO DASHBOARD
        </button>

        <div class="page-brand">
          <span class="brand-mascot">🐱</span>
          <span class="brand-name">StudyBuddy</span>
        </div>
      </header>

      <section class="page-intro">
        <p class="eyebrow">YOUR LEARNING LIBRARY</p>

        <h1>My Subjects</h1>

        <p>
          Every subject has its own space for notes,
          lectures, and learning materials.
        </p>
      </section>

      <section class="subjects-empty-state">
        <span class="empty-icon">📚</span>

        <h2>Your study library is waiting!</h2>

        <p>
          Your Computer Engineering subjects will appear here
          once your official curriculum is added.
        </p>
      </section>
    </section>
  </main>
</template>

<style scoped>
.subjects-page {
  min-height: 100vh;
  padding: 35px 20px;
  background: #e9dfc9;
  font-family: 'Trebuchet MS', sans-serif;
}

.subjects-container {
  max-width: 1100px;
  min-height: 80vh;
  margin: 0 auto;
  padding: 35px;
  background: #faf6eb;
  border: 4px solid #665544;
  border-radius: 12px;
  box-shadow: 10px 10px 0 #b7a58b;
}

.subjects-header {
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

.subjects-empty-state {
  padding: 55px 25px;
  text-align: center;
  background: #f1ead9;
  border: 2px dashed #c9b99f;
  border-radius: 10px;
}

.empty-icon {
  font-size: 48px;
}

.subjects-empty-state h2 {
  color: #594936;
  font-size: 21px;
}

.subjects-empty-state p {
  max-width: 450px;
  margin: 0 auto;
  color: #82735f;
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .subjects-page {
    padding: 20px 14px;
  }

  .subjects-container {
    padding: 22px 18px;
  }

  .subjects-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-intro {
    margin: 32px 0 24px;
  }

  .page-intro h1 {
    font-size: 27px;
  }

  .subjects-empty-state {
    padding: 40px 20px;
  }

  .subjects-empty-state h2 {
    font-size: 19px;
  }
}

</style>
