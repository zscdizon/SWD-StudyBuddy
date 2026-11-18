
<script setup>
import { ref, computed } from 'vue'

const activeSection = ref('about')

const activeCategory = ref('technologies')
const openQuestion = ref(null)

const questionCategories = [
  { id: 'technologies', label: 'TECHNOLOGIES', icon: '💻' },
  { id: 'vue', label: 'VUE & JAVASCRIPT', icon: '⚙️' },
  { id: 'database', label: 'DATABASE & SQL', icon: '🗄️' },
  { id: 'security', label: 'AUTHENTICATION & SECURITY', icon: '🔐' },
  { id: 'features', label: 'STUDYBUDDY FEATURES', icon: '🎮' },
  { id: 'programming', label: 'PROGRAMMING CONCEPTS', icon: '🧠' },
]

const questions = [
  {
    category: 'technologies',
    question: 'What programming languages and technologies were used?',
    answer: 'StudyBuddy uses JavaScript for application logic, HTML for page structure, CSS for styling, SQL for database operations, and Vue.js as its frontend framework. Vite is used as the development and build tool, while Supabase provides backend services.',
    simple: 'JavaScript makes the application work, HTML structures the content, CSS handles the appearance, SQL manages database operations, Vue organizes the interface, and Supabase handles the backend. Each technology has a different responsibility.',
  },
  {
    category: 'technologies',
    question: 'Why did you choose Vue.js?',
    answer: 'Vue.js is a progressive JavaScript framework that supports component-based development and reactive data handling. It allows us to divide StudyBuddy into reusable components and update the interface when application data changes.',
    simple: 'We chose Vue because it helps us organize the application into manageable pieces instead of putting everything into one enormous file. Future us appreciates that decision.',
  },
  {
    category: 'technologies',
    question: 'What is Vite, and why is it used?',
    answer: 'Vite is a frontend development and build tool. It provides a development server with fast updates and bundles the application into optimized production files.',
    simple: 'Vite helps us run the application while developing it and prepares the files needed when we deploy StudyBuddy.',
  },
  {
    category: 'technologies',
    question: 'What is Supabase?',
    answer: 'Supabase is a backend platform built around PostgreSQL. StudyBuddy uses its database, authentication, storage, and database functions to support its application features.',
    simple: 'Think of Supabase as the place where StudyBuddy keeps its important information and handles things like student accounts and stored data.',
  },
  {
    category: 'vue',
    question: 'What is a Vue component?',
    answer: "A Vue component is a reusable and independent part of an application's interface. StudyBuddy uses Vue single-file components with script, template, and style sections.",
    simple: 'A component is like one building block of a webpage. We can give it its own logic, appearance, and content.',
  },
  {
    category: 'vue',
    question: 'What is the purpose of the <script setup> section?',
    answer: 'The script setup syntax is a compile-time feature of Vue that simplifies the Composition API inside single-file components. It allows us to declare reactive variables, functions, imports, and component logic with less boilerplate.',
    simple: 'This is where we tell a page what to do. Its variables, functions, and logic live here.',
  },
  {
    category: 'vue',
    question: 'What is ref() in Vue?',
    answer: 'ref() creates a reactive reference. When its value changes, Vue tracks that change and updates the parts of the template that depend on it.',
    simple: "If a student's name, timer, or task status changes, ref helps Vue notice and update the screen automatically.",
  },
  {
    category: 'vue',
    question: 'What is computed()?',
    answer: 'computed() creates a derived reactive value based on other reactive data. Vue recalculates it when its dependencies change.',
    simple: 'Instead of manually updating a result every time something changes, computed figures it out for us.',
  },
  {
    category: 'vue',
    question: 'What is onMounted()?',
    answer: 'onMounted() is a Vue lifecycle hook that runs after a component has been mounted to the DOM. It is commonly used to load initial data or perform setup operations.',
    simple: "It lets us run something when a page first appears, such as loading a student's tasks or profile information.",
  },
  {
    category: 'vue',
    question: 'What is Vue Router?',
    answer: 'Vue Router is the official routing library for Vue. It maps URL paths to components and supports navigation, route parameters, and navigation guards.',
    simple: "It handles movement between pages, such as Dashboard, Study Planner, Personal Journal, and Profile.",
  },
  {
    category: 'vue',
    question: 'What are async and await?',
    answer: 'async and await are JavaScript features for working with Promises. They allow asynchronous operations to be written in a more readable, sequential style.',
    simple: "Some operations, like retrieving information from Supabase, take time. await lets the application wait for the result before continuing.",
  },
  {
    category: 'database',
    question: 'What is a relational database?',
    answer: 'A relational database organizes information into tables consisting of rows and columns. Relationships between tables can be established using keys.',
    simple: "Instead of keeping all information in one giant list, we organize it into related tables, such as students, subjects, tasks, and study sessions.",
  },
  {
    category: 'database',
    question: 'What is a primary key?',
    answer: 'A primary key is a column or combination of columns that uniquely identifies each row in a database table. StudyBuddy uses UUID identifiers for many records.',
    simple: "It is like a unique ID number for each record. Two records should not have the same primary key.",
  },
  {
    category: 'database',
    question: 'What is a foreign key?',
    answer: 'A foreign key is a column that references a key in another table. It helps maintain relationships and referential integrity between records.',
    simple: "It connects related information. For example, a study session can reference the subject that the student selected.",
  },
  {
    category: 'database',
    question: 'What is CRUD?',
    answer: 'CRUD stands for Create, Read, Update, and Delete. These are the four fundamental operations used to manage stored information.',
    simple: "Create adds something, Read retrieves it, Update changes it, and Delete removes it. Our planner and journal use these operations.",
  },
  {
    category: 'database',
    question: 'What is an SQL query?',
    answer: 'An SQL query is a statement used to interact with a relational database. It can retrieve, insert, update, or delete records depending on the command.',
    simple: "It is how we ask the database to do something, such as find a student's study tasks or save a new journal entry.",
  },
  {
    category: 'database',
    question: 'What is a database function or RPC?',
    answer: 'A PostgreSQL function is reusable logic executed by the database. Supabase RPC allows the application to invoke supported database functions and receive their results.',
    simple: "Instead of putting every complicated database operation in the frontend, we can ask Supabase to execute a prepared function for us.",
  },
  {
    category: 'database',
    question: 'What is Row Level Security (RLS)?',
    answer: 'Row Level Security is a PostgreSQL feature that restricts which rows a database user can access or modify. StudyBuddy uses RLS policies to limit student access to their own records.',
    simple: "It helps make sure one student cannot simply open another student's private journal or tasks. The database checks who is allowed to access each record.",
  },
  {
    category: 'security',
    question: 'What is authentication?',
    answer: "Authentication is the process of verifying a user's identity. StudyBuddy uses Supabase Auth for student registration, login, email verification, and password recovery.",
    simple: "It answers the question: are you really the student trying to log in?",
  },
  {
    category: 'security',
    question: 'What is authorization?',
    answer: 'Authorization determines what an authenticated user is permitted to access or do. StudyBuddy uses protected routes and database security policies to enforce access restrictions.',
    simple: "Authentication checks who you are. Authorization checks what you're allowed to do.",
  },
  {
    category: 'security',
    question: 'How does email verification work?',
    answer: 'During registration, Supabase Auth sends a verification email. The student follows the confirmation link to verify their email address before accessing the protected application.',
    simple: "The application sends a confirmation link to the student's email to make sure the address belongs to them.",
  },
  {
    category: 'security',
    question: 'How does password recovery work?',
    answer: 'StudyBuddy uses Supabase password recovery. A student requests a recovery email, follows the link, and updates their password through the authentication service.',
    simple: "If a student forgets their password, they can request a recovery link instead of needing to create a new account.",
  },
  {
    category: 'security',
    question: 'Why should the Supabase service-role key not be exposed?',
    answer: 'The service-role key has elevated privileges and can bypass Row Level Security. It must remain in a trusted server environment and must never be placed in public frontend code.',
    simple: "That key has far too much power. Exposing it could allow someone to bypass the protections that keep student information private.",
  },
  {
    category: 'features',
    question: 'How does the 25-minute study timer work?',
    answer: 'When a student starts a session, StudyBuddy creates an active study session in Supabase. The application tracks the elapsed time and requests completion through a database function. The function checks that the minimum 25-minute duration has passed before accepting completion.',
    simple: 'The timer records a study session, but the database also checks the time. Changing something on the screen alone cannot make an unfinished session count.',
  },
  {
    category: 'features',
    question: 'How does the daily study goal work?',
    answer: 'StudyBuddy counts completed study sessions for the current date using the Asia/Manila timezone. The daily target is three completed sessions.',
    simple: 'The application counts how many qualifying sessions a student finishes that day. The target is three.',
  },
  {
    category: 'features',
    question: 'How does the 30 XP daily reward work?',
    answer: 'When the student reaches three completed sessions, the completion function awards 30 XP and records the reward in the daily_study_goal_rewards table. A unique constraint prevents the same student from receiving the reward more than once for the same date.',
    simple: "Once a student reaches three sessions, the system awards 30 XP. It also records that the reward was already claimed, so refreshing the page won't give another 30 XP.",
  },
  {
    category: 'features',
    question: 'How does the study streak work?',
    answer: 'The dashboard statistics function evaluates completed study activity by Philippine calendar date. Consecutive dates with at least one completed session contribute to the current streak.',
    simple: 'Study at least once each day to keep the streak going. Miss a calendar day and the current streak resets.',
  },
  {
    category: 'features',
    question: 'How does the Study Planner work?',
    answer: "The Study Planner retrieves the student's tasks from Supabase and supports creating, editing, completing, filtering, and deleting tasks. Each task can optionally be associated with a subject and due date.",
    simple: "It lets students organize what they need to study, set deadlines, mark tasks as completed, and filter their task list.",
  },
  {
    category: 'features',
    question: 'How does the Personal Journal work?',
    answer: 'The Personal Journal stores entries in the journal_entries table. Each entry belongs to a student and supports create, read, update, and delete operations under the applicable security policies.',
    simple: "Students can write their thoughts, save entries, edit them later, or delete them. Their entries are associated with their own account.",
  },
  {
    category: 'features',
    question: 'How does profile picture uploading work?',
    answer: "StudyBuddy validates the selected image type and file size, uploads the image to Supabase Storage, obtains its public URL, and saves that URL in the student's profile.",
    simple: "The image is checked, uploaded to storage, and its location is saved in the student's profile so the application can display it.",
  },
  {
    category: 'programming',
    question: 'What is a Promise in JavaScript?',
    answer: 'A Promise represents the eventual completion or failure of an asynchronous operation. It can be pending, fulfilled, or rejected.',
    simple: "A Promise is JavaScript saying, 'I'm working on it. I'll give you the result when I'm finished.'",
  },
  {
    category: 'programming',
    question: 'What is the difference between frontend and backend?',
    answer: 'The frontend is the part of an application users interact with. The backend handles server-side operations, data access, and business logic. StudyBuddy uses Vue for its frontend and Supabase for backend services.',
    simple: "The frontend is what students see and interact with. The backend handles the information and operations behind the scenes.",
  },
  {
    category: 'programming',
    question: 'What is an API?',
    answer: 'An Application Programming Interface defines how software components communicate. StudyBuddy uses Supabase client methods and RPC calls to communicate with its backend services.',
    simple: "An API is a communication bridge that lets different parts of the application request information or services from one another.",
  },
  {
    category: 'programming',
    question: 'What is input validation?',
    answer: 'Input validation checks whether submitted data meets expected rules before it is processed or stored. It helps prevent invalid or incomplete information from entering the application.',
    simple: "It checks whether the information a student enters makes sense before the application accepts it.",
  },
  {
    category: 'programming',
    question: 'What is error handling?',
    answer: 'Error handling allows an application to detect, respond to, and communicate failures. StudyBuddy uses error checks and try/catch patterns around asynchronous operations.',
    simple: "When something goes wrong, error handling helps the application respond properly instead of leaving the student wondering what happened.",
  },
]

const filteredQuestions = computed(() => {
  return questions.filter(
    question => question.category === activeCategory.value
  )
})

function toggleQuestion(index) {
  openQuestion.value =
    openQuestion.value === index ? null : index
}

const sections = [
  { id: 'about', label: 'ABOUT THE PROJECT', icon: 'ⓘ' },
  { id: 'people', label: 'THE PEOPLE', icon: '👥' },
  { id: 'journey', label: 'HOW IT WAS MADE', icon: '🛠️' },
  { id: 'questions', label: 'QUESTIONS & ANSWERS', icon: '💬' },
]
</script>

<template>
  <main class="about-page">
    <header class="about-header">
      <RouterLink to="/dashboard" class="back-button">
        ← BACK TO DASHBOARD
      </RouterLink>

      <span class="header-label">A LITTLE SOMETHING ABOUT US</span>
    </header>

    <section class="about-hero">
      <div class="info-circle">
        <span>i</span>
      </div>

      <p class="eyebrow">BEHIND THE SCENES</p>

      <h1>So, what's the story?</h1>

      <p class="hero-description">
        Every little detail has a story behind it.
        Here's ours.
      </p>
    </section>

    <nav class="about-navigation">
      <button
        v-for="section in sections"
        :key="section.id"
        :class="{ active: activeSection === section.id }"
        @click="activeSection = section.id"
      >
        <span>{{ section.icon }}</span>
        {{ section.label }}
      </button>
    </nav>

    <section class="about-content">
      <div v-if="activeSection === 'about'" class="story-section">
  <p class="section-eyebrow">01 — THE IDEA</p>

  <h2>Studying doesn't have to feel like a chore.</h2>

  <p class="story-intro">
    We've all had those moments when we want to be productive,
    but somehow end up staring at our notes for twenty minutes.
    Sound familiar?
  </p>

  <div class="story-cards">
    <article class="story-card">
      <span class="story-icon">💭</span>
      <h3>Where it started</h3>
      <p>
        We wanted to create something that could make everyday
        studying feel less overwhelming and more enjoyable.
      </p>
    </article>

    <article class="story-card">
      <span class="story-icon">🎮</span>
      <h3>The big idea</h3>
      <p>
        What if studying felt a little like playing an adventure
        game? Small quests, completed sessions, progress, and rewards.
      </p>
    </article>

    <article class="story-card">
      <span class="story-icon">🐱</span>
      <h3>Meet StudyBuddy</h3>
      <p>
        A cozy study companion that brings together organization,
        productivity, and a little motivation whenever you need it.
      </p>
    </article>
  </div>

  <div class="story-note">
    <strong>Our goal?</strong>
    <p>
      To help students build better study habits, one small
      accomplishment at a time.
    </p>
  </div>
</div>

      <div v-else-if="activeSection === 'people'" class="people-section">
  <p class="section-eyebrow">02 — THE TEAM</p>

  <h2>Five minds, one little adventure.</h2>

  <p class="story-intro">
    A student project made possible by the people
    who planned, designed, developed, and tested it.
  </p>

  <div class="member-grid">
    <article class="member-card">
      <div class="member-avatar">B</div>
      <h3>William Garett M. Bernal</h3>
      <p class="member-role">PROJECT MEMBER</p>
      <p>Part of the team behind StudyBuddy's development.</p>
    </article>

    <article class="member-card">
      <div class="member-avatar">D</div>
      <h3>Zyron Steven C. Dizon</h3>
      <p class="member-role">PROJECT MEMBER</p>
      <p>Part of the team behind StudyBuddy's development.</p>
    </article>

    <article class="member-card">
      <div class="member-avatar">M</div>
      <h3>Joshua J. Mallari</h3>
      <p class="member-role">PROJECT MEMBER</p>
      <p>Part of the team behind StudyBuddy's development.</p>
    </article>

    <article class="member-card">
      <div class="member-avatar">F</div>
      <h3>Desiree May M. Franco</h3>
      <p class="member-role">PROJECT MEMBER</p>
      <p>Part of the team behind StudyBuddy's development.</p>
    </article>

    <article class="member-card">
      <div class="member-avatar">S</div>
      <h3>Angela Michaela D. Salvador</h3>
      <p class="member-role">PROJECT MEMBER</p>
      <p>Part of the team behind StudyBuddy's development.</p>
    </article>
  </div>

  <p class="team-note">
    Different contributions, shared responsibility.
    That's how StudyBuddy came together.
  </p>
</div>

      <div v-else-if="activeSection === 'journey'" class="journey-section">
  <p class="section-eyebrow">03 — THE DEVELOPMENT JOURNEY</p>

  <h2>Every big project starts somewhere.</h2>

  <p class="story-intro">
    StudyBuddy wasn't built in a day. It took planning,
    designing, coding, testing, and quite a few debugging sessions.
  </p>

  <div class="timeline">
    <article class="timeline-item">
      <span class="timeline-number">01</span>
      <div>
        <span class="timeline-tag">THE BEGINNING</span>
        <h3>Finding the idea</h3>
        <p>
          We started with a simple question: how can we make
          studying more engaging and manageable for students?
          That question became the foundation of StudyBuddy.
        </p>
      </div>
    </article>

    <article class="timeline-item">
      <span class="timeline-number">02</span>
      <div>
        <span class="timeline-tag">DESIGN & PLANNING</span>
        <h3>Giving the idea a personality</h3>
        <p>
          We developed the cozy, pixel-inspired visual identity,
          designed the study room concept, and planned the
          application's screens and interactions.
        </p>
      </div>
    </article>

    <article class="timeline-item">
      <span class="timeline-number">03</span>
      <div>
        <span class="timeline-tag">FRONTEND DEVELOPMENT</span>
        <h3>Turning designs into interfaces</h3>
        <p>
          We used Vue.js, JavaScript, HTML, and CSS to build
          reusable components, interactive pages, navigation,
          and the overall StudyBuddy experience.
        </p>
      </div>
    </article>

    <article class="timeline-item">
      <span class="timeline-number">04</span>
      <div>
        <span class="timeline-tag">BACKEND DEVELOPMENT</span>
        <h3>Giving StudyBuddy a memory</h3>
        <p>
          We integrated Supabase to manage student accounts,
          database records, authentication, and uploaded
          profile pictures.
        </p>
      </div>
    </article>

    <article class="timeline-item">
      <span class="timeline-number">05</span>
      <div>
        <span class="timeline-tag">FEATURE DEVELOPMENT</span>
        <h3>Making the features work</h3>
        <p>
          We implemented study sessions, XP rewards, streaks,
          subject management, the study planner, personal
          journal, and student profile tools.
        </p>
      </div>
    </article>

    <article class="timeline-item">
      <span class="timeline-number">06</span>
      <div>
        <span class="timeline-tag">TESTING & IMPROVEMENT</span>
        <h3>Finding and fixing the little things</h3>
        <p>
          We tested the features, corrected errors, improved
          the interface, checked mobile layouts, and refined
          the application to make everything work together.
        </p>
      </div>
    </article>
  </div>

  <div class="story-note">
    <strong>And that's how we got here.</strong>
    <p>
      Not just a collection of screens, but an application
      built piece by piece, with a purpose behind it.
    </p>
  </div>
</div>

      <div v-else-if="activeSection === 'questions'" class="questions-section">
  <p class="section-eyebrow">04 — THE TECHNICAL SIDE</p>

  <h2>Curious? We've got answers.</h2>

  <p class="story-intro">
    From the technologies we used to the little details
    that make StudyBuddy work, here's what happens behind the scenes.
  </p>

  <div class="question-layout">
    <nav class="question-categories">
      <button
        v-for="category in questionCategories"
        :key="category.id"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id; openQuestion = null"
      >
        <span>{{ category.icon }}</span>
        {{ category.label }}
      </button>
    </nav>

    <div class="question-list">
      <article
        v-for="(item, index) in filteredQuestions"
        :key="item.question"
        class="question-card"
        :class="{ expanded: openQuestion === index }"
      >
        <button
          class="question-toggle"
          @click="toggleQuestion(index)"
        >
          <span>{{ item.question }}</span>
          <span class="question-indicator">
            {{ openQuestion === index ? '−' : '+' }}
          </span>
        </button>

        <div v-if="openQuestion === index" class="question-answer">
          <div class="answer-block">
            <span class="answer-label">TECHNICAL ANSWER</span>
            <p>{{ item.answer }}</p>
          </div>

          <div class="simple-answer">
            <span class="answer-label">THE SIMPLE VERSION</span>
            <p>{{ item.simple }}</p>
          </div>
        </div>
      </article>

      <p v-if="filteredQuestions.length === 0">
        No questions in this category yet.
      </p>
    </div>
  </div>

  <div class="story-note question-note">
    <strong>A little presentation tip:</strong>
    <p>
      Understand the technical answer, then explain it naturally.
      You don't need to memorize every word like a script!
    </p>
  </div>
</div>
    </section>

    <footer class="about-footer">
      <p>MADE WITH CARE (AND A LOT OF DEBUGGING).</p>
      <span>STUDYBUDDY © 2026</span>
    </footer>
  </main>
</template>


<style scoped>
.about-page {
  min-height: 100vh;
  padding: 35px 7%;
  background: #f7f1e5;
  color: #554638;
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.back-button {
  padding: 10px 14px;
  color: #665544;
  background: #f1ead9;
  border: 2px solid #c9b99f;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  text-decoration: none;
}

.header-label,
.eyebrow,
.about-footer {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

.about-hero {
  max-width: 720px;
  margin: 65px auto 55px;
  text-align: center;
}

.info-circle {
  width: 155px;
  height: 155px;
  margin: 0 auto 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e8d7b9;
  border: 3px solid #806b50;
  border-radius: 50%;
  box-shadow: 7px 7px 0 #c9b99f;
}

.info-circle span {
  font-family: Georgia, serif;
  font-size: 110px;
  font-weight: bold;
  line-height: 1;
  transform: translateY(-5px);
}

.eyebrow,
.section-eyebrow {
  color: #a1845f;
}

.section-eyebrow {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

.about-hero h1 {
  margin: 12px 0;
  font-family: Georgia, serif;
  font-size: clamp(32px, 5vw, 52px);
}

.hero-description {
  color: #897963;
  font-size: 15px;
}

.about-navigation {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 45px;
}

.about-navigation button {
  padding: 12px 16px;
  border: 2px solid #d8c9b0;
  border-radius: 7px;
  background: #fffaf0;
  color: #665544;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.about-navigation button span {
  margin-right: 5px;
}

.about-navigation button:hover {
  transform: translateY(-3px);
}

.about-navigation button.active {
  background: #806b50;
  border-color: #806b50;
  color: #fffaf0;
}

.about-content {
  max-width: 850px;
  min-height: 180px;
  margin: 0 auto;
  padding: 35px;
  background: #fffaf0;
  border: 2px solid #dfd0b8;
  border-radius: 10px;
  text-align: center;
}

.about-content h2 {
  font-family: Georgia, serif;
  font-size: 26px;
}

.about-content p {
  color: #897963;
  line-height: 1.8;
}

.story-intro {
  max-width: 650px;
  margin: 15px auto 35px;
  line-height: 1.9;
}

.story-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 30px;
  text-align: left;
}

.story-card {
  padding: 22px;
  background: #f7f1e5;
  border: 1px solid #dfd0b8;
  border-radius: 8px;
  transition: transform 0.25s ease;
}

.story-card:hover {
  transform: translateY(-5px);
}

.story-icon {
  font-size: 28px;
}

.story-card h3 {
  margin: 15px 0 8px;
  font-family: Georgia, serif;
}

.story-card p {
  font-size: 13px;
  line-height: 1.8;
}

.story-note {
  margin-top: 25px;
  padding: 20px;
  background: #e8d7b9;
  border-left: 4px solid #806b50;
  text-align: left;
}

.story-note p {
  margin-bottom: 0;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  margin-top: 30px;
  text-align: left;
}

.member-card {
  padding: 22px;
  background: #f7f1e5;
  border: 1px solid #dfd0b8;
  border-radius: 8px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 4px 5px 0 #d7c5a8;
}

.member-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  background: #e8d7b9;
  border: 2px solid #c9b99f;
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
}

.member-card h3 {
  margin: 15px 0 7px;
  font-family: Georgia, serif;
  font-size: 16px;
}

.member-role {
  color: #a1845f;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.member-card > p:last-child {
  color: #897963;
  font-size: 12px;
  line-height: 1.7;
}

.team-note {
  margin-top: 25px;
  color: #897963;
  font-size: 13px;
  font-style: italic;
}

.timeline {
  position: relative;
  max-width: 700px;
  margin: 35px auto;
  text-align: left;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 15px;
  bottom: 15px;
  left: 22px;
  width: 2px;
  background: #d8c9b0;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
}

.timeline-number {
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  background: #e8d7b9;
  border: 2px solid #a1845f;
  border-radius: 50%;
  color: #665544;
  font-size: 12px;
  font-weight: bold;
}

.timeline-tag {
  color: #a1845f;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.timeline-item h3 {
  margin: 7px 0;
  font-family: Georgia, serif;
  font-size: 19px;
}

.timeline-item p {
  margin-top: 5px;
  color: #897963;
  font-size: 13px;
  line-height: 1.8;
}

.about-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
  max-width: 850px;
  margin: 65px auto 0;
  padding-top: 20px;
  border-top: 1px solid #d8c9b0;
  color: #a18c70;
}

@media (max-width: 650px) {
  .story-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .about-page {
    padding: 25px 5%;
  }

  .about-hero {
    margin: 45px auto;
  }

  .about-navigation {
    flex-direction: column;
  }

  .about-navigation button {
    width: 100%;
  }

  .about-content {
    padding: 25px 18px;
  }

  .member-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item {
    gap: 13px;
  }

  .timeline-item h3 {
    font-size: 17px;
  }
}


/* QUESTIONS & ANSWERS */

.questions-section {
  width: 100%;
}

.question-layout {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 20px;
  margin-top: 30px;
  align-items: start;
  text-align: left;
  width: 100%;
}

.question-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-categories button {
  appearance: none;
  -webkit-appearance: none;
  line-height: 1.4;
  white-space: normal;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 48px;
  padding: 12px 15px;
  color: #665544;
  background: #f7f1e5;
  border: 2px solid #d8cbb5;
  border-radius: 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  box-shadow: 2px 3px 0 #ded2bd;
  transition: all 0.2s ease;
}

.question-categories button:hover {
  background: #eee5d4;
  transform: translateY(-2px);
  box-shadow: 2px 5px 0 #d2c2a8;
}

.question-categories button.active {
  color: #fffaf0;
  background: #806b50;
  border-color: #806b50;
  box-shadow: 2px 3px 0 #66543e;
}

.question-categories button span {
  flex-shrink: 0;
  font-size: 17px;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-card {
  overflow: hidden;
  background: #fffdf7;
  border: 2px solid #ded2bd;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.question-card.expanded {
  border-color: #a58b66;
  box-shadow: 3px 4px 0 #e6dccb;
}

.question-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 17px;
  color: #574735;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
}

.question-indicator {
  flex-shrink: 0;
  color: #987b55;
  font-size: 23px;
  line-height: 1;
}

.question-answer {
  padding: 0 17px 17px;
  animation: answer-appear 0.25s ease;
}

.answer-block,
.simple-answer {
  padding: 14px;
  border-radius: 6px;
}

.answer-block {
  background: #f5f0e5;
}

.simple-answer {
  margin-top: 10px;
  background: #edf1df;
}

.answer-label {
  display: block;
  margin-bottom: 8px;
  color: #8a7557;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}

.answer-block p,
.simple-answer p {
  margin: 0;
  color: #625543;
  font-size: 12px;
  line-height: 1.7;
}

.question-note {
  margin-top: 28px;
}

@keyframes answer-appear {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 700px) {
  .question-layout {
    grid-template-columns: 1fr;
  }

  .question-categories {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .question-categories button {
    flex: 0 0 auto;
    width: auto;
    white-space: nowrap;
  }

  .question-categories button:hover {
    transform: translateY(-2px);
  }

  .question-categories button:focus-visible,
.question-toggle:focus-visible {
  outline: 3px solid #a1845f;
  outline-offset: 3px;
}

}
</style>
