import { supabase } from './supabase'

/** Register a new StudyBuddy student. */
export async function registerStudent({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  return data
}


/** Log in an existing StudyBuddy student. */
export async function loginStudent({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}


/** Log out the current StudyBuddy student. */
export async function logoutStudent() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}


/** Send a password recovery email. */
export async function resetStudentPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw error
  }

  return data
}

/** Update a student's password after recovery. */
export async function updateStudentPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }

  return data
}

/** Retrieve the currently authenticated student. */
export async function getCurrentStudent() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user
}


/** Retrieve a student's profile from the database. */
export async function getStudentProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}


/**
 *  Update a student's profile. */
export async function updateStudentProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: profileData.fullName,
      year_level: profileData.yearLevel,
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
