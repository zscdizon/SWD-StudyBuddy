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

