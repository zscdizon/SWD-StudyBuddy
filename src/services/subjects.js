import { supabase } from './supabase'

/**
 * Retrieve Computer Engineering subjects.
 * Optional filters allow retrieving a specific year and semester.
 */
export async function getSubjects({ yearLevel, semester } = {}) {
  let query = supabase
    .from('subjects')
    .select(`
      id,
      subject_code,
      subject_name,
      year_level,
      semester,
      units,
      display_order
    `)
    .order('year_level', { ascending: true })
    .order('display_order', { ascending: true })

  if (yearLevel !== undefined) {
    query = query.eq('year_level', yearLevel)
  }

  if (semester !== undefined) {
    query = query.eq('semester', semester)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data ?? []
}
