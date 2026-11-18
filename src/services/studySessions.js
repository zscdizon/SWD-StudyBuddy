
import { supabase } from './supabase'

/**
 * Start a new study session.
 * A subject is optional.
 */
export async function startStudySession(subjectId = null) {
  const { data, error } = await supabase.rpc(
    'start_study_session',
    {
      p_subject_id: subjectId,
    }
  )

  if (error) {
    throw error
  }

  return data
}

/**
 * Complete an active study session.
 * The database validates the duration and handles rewards.
 */
export async function completeStudySession(sessionId) {
  const { data, error } = await supabase.rpc(
    'complete_study_session',
    {
      p_session_id: sessionId,
    }
  )

  if (error) {
    throw error
  }

  return data
}

/**
 * Get the student's daily study goal and streak statistics.
 */
export async function getStudyDashboardStats() {
  const { data, error } = await supabase.rpc(
    'get_study_dashboard_stats'
  )

  if (error) {
    throw error
  }

  return data
}
export async function getActiveStudySession() {
  const { data, error } = await supabase.rpc(
    'get_active_study_session'
  )

  if (error) throw error
  return data
}

/**
 * Cancel an active study session.
 * Cancelled sessions do not earn XP.
 */
export async function cancelStudySession(sessionId) {
  const { data, error } = await supabase.rpc(
    'cancel_study_session',
    {
      p_session_id: sessionId,
    }
  )

  if (error) {
    throw error
  }

  return data
}

/**
 * Get the student's completed study session history
 * and overall study statistics.
 */
export async function getStudySessionHistory() {
  const { data, error } = await supabase.rpc(
    'get_study_session_history'
  )

  if (error) {
    throw error
  }

  return data
}
