   
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSubjects } from '@/services/subjects'

const router = useRouter()

const subjects = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

function goToDashboard() {
  router.push('/dashboard')
}

const groupedSubjects = computed(() => {
  const groups = []

  for (let yearLevel = 1; yearLevel <= 4; yearLevel++) {
    const semesters = ['1st Semester', '2nd Semester', 'Summer']

    const terms = semesters
      .map((semester) => ({
        semester,
        subjects: subjects.value.filter(
          (subject) =>
            subject.year_level === yearLevel &&
            subject.semester === semester
        ),
      }))
      .filter((term) => term.subjects.length > 0)

    if (terms.length > 0) {
      groups.push({
        yearLevel,
        yearLabel: `${yearLevel}${['st', 'nd', 'rd', 'th'][yearLevel - 1]} Year`,
        terms,
      })
    }
  }

  return groups
})

onMounted(async () => {
  try {
    subjects.value = await getSubjects()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
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

        
<!-- Loading State -->
<p v-if="isLoading" class="status-message">
  Preparing your study library...
</p>

<!-- Error State -->
<p v-else-if="errorMessage" class="error-message">
  {{ errorMessage }}
</p>

<!-- Empty State -->
<section v-else-if="groupedSubjects.length === 0" class="subjects-empty-state">
  <span class="empty-icon">📚</span>
  <h2>Your study library is waiting!</h2>
  <p>No subjects are available yet.</p>
</section>

<!-- Curriculum -->
<template v-else>
  <section
    v-for="group in groupedSubjects"
    :key="group.yearLevel"
    class="year-group"
  >
    <h2 class="year-title">{{ group.yearLabel }}</h2>

    <section
      v-for="term in group.terms"
      :key="term.semester"
      class="semester-group"
    >
      <h3 class="semester-title">{{ term.semester }}</h3>

      <div class="subject-grid">
        <RouterLink
  v-for="subject in term.subjects"
  :key="subject.id"
  :to="{ name: 'subject-detail', params: { id: subject.id } }"
  class="subject-card"
>
          <span class="subject-code">{{ subject.subject_code }}</span>

          <h4>{{ subject.subject_name }}</h4>

          <p>{{ subject.units }} Units</p>
        </RouterLink>
      </div>
    </section>
  </section>
</template>

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


.status-message {
  padding: 25px;
  color: #82735f;
  text-align: center;
  background: #f1ead9;
  border-radius: 8px;
}

.error-message {
  padding: 18px;
  color: #9b463d;
  background: #f8e5df;
  border: 2px solid #d9aaa0;
  border-radius: 8px;
}

.year-group {
  margin-top: 35px;
}

.year-title {
  margin-bottom: 20px;
  padding-bottom: 12px;
  color: #594936;
  font-size: 24px;
  border-bottom: 3px solid #d7c5a8;
}

.semester-group {
  margin-bottom: 30px;
}

.semester-title {
  margin-bottom: 16px;
  color: #9b8061;
  font-size: 17px;
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
}

.subject-card {
  padding: 20px;
  background: #fffdf7;
  border: 3px solid #c9b99f;
  border-radius: 9px;
  box-shadow: 4px 4px 0 #e4d8c3;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.subject-card:hover {
  transform: translateY(-3px);
  box-shadow: 4px 7px 0 #d7c5a8;
}

.subject-code {
  display: inline-block;
  margin-bottom: 10px;
  padding: 5px 9px;
  color: #665544;
  background: #e9dfc9;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.subject-card h4 {
  margin: 0 0 12px;
  color: #594936;
  font-size: 14px;
  line-height: 1.6;
}

.subject-card p {
  margin: 0;
  color: #9b8061;
  font-size: 12px;
  font-weight: bold;
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
