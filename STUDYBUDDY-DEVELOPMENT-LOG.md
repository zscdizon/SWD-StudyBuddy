# SWD STUDYBUDDY
## Development Log

### 1. Project Overview
**Project Name:** SWD StudyBuddy  
**Project Type:** Web-Based Application  
**Target Users:** 1st to 4th Year Computer Engineering Students  
**Purpose:** A gamified study companion designed to help Computer Engineering students organize their academic activities, manage notes, and improve their study habits.

### 2. Development Environment

| Tool / Technology | Purpose | Status |
|---|---|---|
| Visual Studio Code | Code editor | Installed |
| Node.js | JavaScript runtime | Installed |
| npm | Package management | Working |
| Vue 3 | Frontend framework | Configured |
| Vite | Development server and build tool | Configured |
| JavaScript | Primary programming language | Selected |
| Vue Router | Application navigation | Configured |
| Pinia | State management | Configured |
| ESLint | Code quality | Configured |
| Prettier | Code formatting | Configured |
| Git | Version control | Initialized |
| GitHub | Online repository and backup | Connected |
| Google Chrome | Browser testing | Available |
| Supabase | Backend, authentication, and database | Account created; project not yet configured |

### 3. Project Configuration
- JavaScript selected instead of TypeScript.
- JSX support disabled.
- Vue Router enabled.
- Pinia enabled.
- Vitest disabled for initial setup.
- End-to-End Testing disabled for initial setup.
- ESLint enabled.
- Prettier enabled.
- Experimental features disabled.
- Blank Vue project selected.

### 4. Git and GitHub
**Repository:** https://github.com/zscdizon/SWD-StudyBuddy.git

**Main Branch:** main

**Initial Commit:** Initial Vue project setup

**Version Control Status:** Successfully initialized and pushed to GitHub.

### 5. Project Development Principles
- Preserve the original StudyBuddy pixel-art identity.
- Build the application from scratch.
- Develop and test features incrementally.
- Keep the original Figma prototype and previous experiments untouched.
- Use the school's official Computer Engineering curriculum as the source for subjects.
- Allow students to manually update their year level.
- Verify student email addresses during registration.
- Keep student notes and personal journal entries private to their accounts.

### 6. Planned Application Features
- Student registration and login.
- Email verification.
- Student year-level selection and management.
- Personalized student dashboard.
- Year-level-specific Computer Engineering subjects.
- Individual subject notebooks.
- Personal journal / diary.
- Note creation, editing, deletion, and searching.
- Study planner and calendar.
- Quests, quizzes, and practice activities.
- XP, achievements, and progress tracking.
- Persistent cloud database storage.

### 7. Current Development Status

**Phase 1: Development Environment and Project Setup**

- [x] Install development tools.
- [x] Create the new project directory.
- [x] Scaffold the Vue application.
- [x] Install project dependencies.
- [x] Verify the development server.
- [x] Initialize Git.
- [x] Create the initial commit.
- [x] Create GitHub repository.
- [x] Push initial project to GitHub.
- [x] Create development log.

**Next Phase:** Frontend authentication and application implementation.

## Supabase Database Setup

### Project Configuration
- Created Supabase organization and project.
- Selected Asia Pacific (Singapore) as the database region.
- Enabled the Data API.
- Enabled automatic Row Level Security (RLS) for new tables.

### Profiles Table
Created `public.profiles` with:
- `id` — UUID, primary key, references `auth.users.id`.
- `created_at` — Timestamp with default `now()`.
- `full_name` — Text.
- `year_level` — Smallint.
- `avatar_url` — Text.
- `updated_at` — Timestamp with default `now()`.

### Security Policies
Created and verified the following RLS policies:
- Students can view their own profile (SELECT).
- Students can update their own profile (UPDATE).

Removed the client-side INSERT policy because profile creation is handled automatically by the database trigger.

All remaining policies restrict access using `auth.uid() = id`.

### Database Constraints
- Added `valid_year_level` CHECK constraint.
- Permitted year levels: 1 through 4.
- NULL is temporarily allowed for incomplete registration profiles.

### Pending Database Tasks
- Database profile setup completed.
- Authentication settings configured.
- Frontend registration and login implementation pending.

### Automatic Timestamp Updates
- Created `public.update_updated_at()` PostgreSQL function.
- Created `set_profiles_updated_at` trigger.
- Trigger automatically updates `updated_at` before every profile update.
- Verified that the trigger exists in Supabase.

### Supabase Authentication Setup
- Enabled email and password authentication.
- Enabled new user signups.
- Enabled email confirmation.
- Disabled anonymous sign-ins and manual account linking.
- Configured Site URL: http://localhost:5173
- Added local Redirect URL: http://localhost:5173/**

### Automatic Profile Creation
- Created `public.handle_new_user()` function.
- Created `on_auth_user_created` trigger on `auth.users`.
- Automatically creates a matching `public.profiles` record after registration.
- Retrieves the student's full name from authentication metadata.
- Verified the trigger using information_schema.triggers.

### Pending Authentication Tasks
- Implement and test registration and login.
- Configure student eligibility verification.
- Test email confirmation and session persistence.

## Supabase Frontend Integration
### Authentication Service
- Created `src/services/auth.js`.
- Implemented student registration using Supabase Auth.
- Implemented student login and logout.
- Added password recovery email functionality.
- Added current authenticated student retrieval.
- Added student profile retrieval from the `profiles` table.
- Added student profile update functionality.
- Verified the project using `npm run build`.
- Production build completed successfully with no errors.

### Authentication and Onboarding Testing
- Successfully tested student registration.
- Verified student email through Supabase Auth.
- Successfully tested student login.
- Confirmed that students with incomplete profiles are redirected to onboarding.
- Implemented student profile completion.
- Successfully saved full name and year level to the Supabase `profiles` table.
- Verified saved profile information in Supabase Table Editor.
- Confirmed automatic `updated_at` timestamp updates.
- Granted authenticated users the required SELECT and UPDATE table privileges while retaining Row Level Security policies.
- Verified the application using `npm run build`.



### Environment Configuration
- Created `.env.local` to store Supabase connection credentials.
- Configured `VITE_SUPABASE_URL`.
- Configured `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Confirmed `.env.local` is excluded from Git through the `*.local` ignore rule.

### Supabase Client
- Installed `@supabase/supabase-js`.
- Created `src/services/supabase.js`.
- Configured and exported a reusable Supabase client using environment variables.

### Build Verification
- Executed `npm run build`.
- Production build completed successfully.
- No build errors reported.

### Pending Authentication Tasks
- Implement student registration.
- Implement login and logout.
- Implement email confirmation handling.
- Implement student onboarding and profile management.
- Test session persistence.


## Dashboard and Route Protection

### Student Dashboard
- Created `src/views/DashboardView.vue`.
- Connected the Dashboard to Supabase authentication and student profiles.
- Displayed the student's saved full name and year level.
- Added loading and error messages.

### Navigation
- Restored the welcome page as the homepage (`/`).
- Created the dedicated Dashboard route (`/dashboard`).
- Updated login and onboarding redirects to open the Dashboard after profile completion.

### Logout
- Implemented student logout using Supabase Auth.
- Added a styled Logout button.
- Successfully tested session termination and redirection to the welcome page.

### Authentication Route Protection
- Implemented a Vue Router navigation guard.
- Protected `/dashboard` and `/onboarding` using authentication metadata.
- Redirected unauthenticated visitors to the welcome page.
- Successfully tested both protected routes.

### Verification
- Successfully tested the login-to-dashboard flow.
- Successfully tested logout.
- Successfully tested Dashboard and onboarding access restrictions.
- Executed `npm.cmd run build`.
- Production build completed successfully with no errors.

## Dashboard UI and Responsive Design

### StudyBuddy Header
- Added a branded StudyBuddy header.
- Added a mascot icon and custom header styling.

### Welcome Section
- Created a personalized student welcome panel.
- Displayed the student's full name and year level.
- Added a cozy visual design consistent with the StudyBuddy theme.

### Study Space
- Added four study tool cards:
  - My Subjects
  - Personal Journal
  - Study Planner
  - My Progress
- Styled the cards using the StudyBuddy color palette.

### Responsive Design
- Added mobile-specific CSS using a media query.
- Adjusted spacing and typography for smaller screens.
- Changed the study cards to a single-column layout on mobile.
- Successfully tested the responsive layout using Chrome Device Toolbar.

### Build Verification
- Executed `npm.cmd run build`.
- Production build completed successfully with no errors.

## My Subjects Page

### Page Development
- Created `src/views/SubjectsView.vue`.
- Added the StudyBuddy header and mascot.
- Added a Back to Dashboard button.
- Created the My Subjects page introduction and empty state.

### Navigation and Security
- Registered the `/subjects` route in Vue Router.
- Protected the Subjects page using the authentication guard.
- Connected the Dashboard's My Subjects card to the Subjects page.
- Successfully tested navigation from Dashboard to Subjects and back.

### Responsive Design
- Added mobile-specific styling for smaller screens.
- Adjusted header alignment, spacing, and typography.
- Successfully tested the page using Chrome Device Toolbar.

### Build Verification
- Executed `npm.cmd run build`.
- Production build completed successfully with no errors.

## Official Computer Engineering Curriculum Integration

### Supabase Database
- Created the `subjects` table.
- Added subject codes, names, year levels, semesters, units, and display ordering.
- Enabled Row Level Security for authenticated students.
- Imported the 78 official curriculum entries from the University of the Assumption curriculum.
- Added a unique index to prevent duplicate curriculum entries.

### Subjects Service
- Created `src/services/subjects.js`.
- Connected subject retrieval to the existing Supabase client.
- Added year-level and semester filtering.
- Preserved curriculum display ordering.

### Dynamic Subjects Page
- Connected `SubjectsView.vue` to Supabase.
- Added loading and error states.
- Automatically grouped subjects by year level and semester.
- Added support for the third-year summer term.
- Displayed official subject codes, names, and units.

### Verification
- Successfully verified the imported curriculum.
- Confirmed all year and semester sections appear.
- Successfully built the application with no errors.
- Tested the Subjects page in Chrome.

## Personal Subject Notes — Complete CRUD Functionality

### Database
- Created the `subject_notes` table in Supabase.
- Linked notes to authenticated students and individual subjects.
- Enabled Row Level Security.
- Added policies for viewing, creating, updating, and deleting personal notes.

### Notes Service
- Created `src/services/notes.js`.
- Implemented retrieving subject notes.
- Implemented creating new notes.
- Implemented updating existing notes.
- Implemented deleting notes.

### Subject Notebook
- Connected personal notes to `SubjectDetailView.vue`.
- Added a note title input and content editor.
- Added Save Note and Update Note functionality.
- Added Edit Note and Cancel Editing buttons.
- Added Delete Note with confirmation.
- Added saved-note cards and empty states.
- Added loading, validation, and error handling.

### Testing
- Successfully created and retrieved notes.
- Verified notes persist after refreshing.
- Successfully edited and updated existing notes.
- Verified edits persist after refreshing.
- Successfully deleted notes.
- Verified deleted notes remain deleted after refreshing.

## My Progress — Supabase Integration

### Database
- Created the student_progress table for XP tracking.
- Created the student_subject_progress table for completed subjects.
- Created the study_activities table for activity history.
- Created the student_achievements table for unlocked achievements.
- Enabled Row Level Security and configured student-specific access policies.

### Progress Service
- Created src/services/progress.js.
- Connected progress retrieval to the existing Supabase client.
- Added XP, completed subject, and total subject counts.
- Added retrieval of recent study activities.
- Added retrieval of unlocked achievements.

### My Progress Page
- Created src/views/ProgressView.vue.
- Registered the protected /progress route.
- Connected the Dashboard's My Progress card.
- Added dynamic XP and completed subject counters.
- Added the Study Activity section.
- Added the My Achievements section.
- Added loading and error states.

### Responsive Design and Testing
- Added mobile-responsive styling.
- Successfully tested Dashboard navigation.
- Successfully tested the Progress page in Chrome.
- Verified Supabase progress data retrieval.
- Production build completed successfully.

### Remaining Development
- Implement controlled XP awarding.
- Implement subject completion tracking.
- Implement automatic study activity recording.
- Implement achievement unlocking rules.

## Subject Completion System

- Added subject completion functionality to the Subject Detail page.
- Students can mark individual subjects as completed.
- Completion status is stored in Supabase's student_subject_progress table.
- Implemented completion status retrieval when opening a subject.
- Prevented repeated completion submissions through button state handling.
- Completion status persists after refreshing the page.
- Integrated completed subject counts with the My Progress dashboard.
- Verified that completing a subject updates the progress dashboard.
- Successfully passed the production build.