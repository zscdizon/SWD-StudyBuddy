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
