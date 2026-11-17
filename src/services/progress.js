import { supabase } from './supabase'

/**
 * Retrieve the currently authenticated student's progress.
 */
export async function getStudentProgress() {
  const { data: userData, error: userError } =
    await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!userData.user) {
    throw new Error('You must be logged in to view your progress.')
  }

  const studentId = userData.user.id
  
  const { error: achievementError } = await supabase.rpc(
  'unlock_subject_milestone_achievements'
)

if (achievementError) {
  throw achievementError
}

  const [
    progressResult,
    completedResult,
    subjectsResult,
    activitiesResult,
    achievementsResult,
  ] = await Promise.all([
    supabase
      .from('student_progress')
      .select('total_xp')
      .eq('student_id', studentId)
      .maybeSingle(),

    supabase
      .from('student_subject_progress')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('is_completed', true),

    supabase
      .from('subjects')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('study_activities')
      .select('id, activity_type, description, xp_earned, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('student_achievements')
      .select('id, achievement_code, unlocked_at')
      .eq('student_id', studentId)
      .order('unlocked_at', { ascending: false }),
  ])

  const results = [
    progressResult,
    completedResult,
    subjectsResult,
    activitiesResult,
    achievementsResult,
  ]

  const failedResult = results.find((result) => result.error)

  if (failedResult) {
    throw failedResult.error
  }

  return {
    totalXP: progressResult.data?.total_xp ?? 0,
    completedSubjects: completedResult.count ?? 0,
    totalSubjects: subjectsResult.count ?? 0,
    activities: activitiesResult.data ?? [],
    achievements: achievementsResult.data ?? [],
  }
}


/**
 * Check whether the student has completed a subject.
 */
export async function getSubjectCompletion(subjectId) {
  const { data: userData, error: userError } =
    await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!userData.user) {
    throw new Error('You must be logged in.')
  }

  const { data, error } = await supabase
    .from('student_subject_progress')
    .select('is_completed')
    .eq('student_id', userData.user.id)
    .eq('subject_id', subjectId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data?.is_completed ?? false
}


/**
 * Mark a subject as completed and award XP securely.
 * Supabase handles the completion, XP reward, and activity record.
 */
export async function markSubjectCompleted(subjectId) {
  const { data: userData, error: userError } =
    await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!userData.user) {
    throw new Error('You must be logged in.')
  }

  const { data, error } = await supabase.rpc(
    'complete_subject_with_xp',
    {
      p_subject_id: subjectId,
    }
  )

  if (error) {
    throw error
  }

  return data
}

