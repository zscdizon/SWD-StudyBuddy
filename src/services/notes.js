
import { supabase } from './supabase'

/**
 * Get the currently authenticated student's ID.
 */
async function getStudentId() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('You must be logged in to access your notes.')
  }

  return data.user.id
}

/**
 * Retrieve notes belonging to a specific subject.
 */
export async function getSubjectNotes(subjectId) {
  const studentId = await getStudentId()

  const { data, error } = await supabase
    .from('subject_notes')
    .select('*')
    .eq('subject_id', subjectId)
    .eq('student_id', studentId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

/**
 * Create a new personal subject note.
 */
export async function createSubjectNote(subjectId, title, content = '') {
  const studentId = await getStudentId()

  const { data, error } = await supabase
    .from('subject_notes')
    .insert({
      student_id: studentId,
      subject_id: subjectId,
      title,
      content,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Update an existing personal subject note.
 */
export async function updateSubjectNote(noteId, title, content) {
  const studentId = await getStudentId()

  const { data, error } = await supabase
    .from('subject_notes')
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .eq('student_id', studentId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Delete one of the student's personal subject notes.
 */
export async function deleteSubjectNote(noteId) {
  const studentId = await getStudentId()

  const { error } = await supabase
    .from('subject_notes')
    .delete()
    .eq('id', noteId)
    .eq('student_id', studentId)

  if (error) {
    throw error
  }
}
