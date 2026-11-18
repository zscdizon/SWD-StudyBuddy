
import { supabase } from './supabase'

export async function getStudyTasks() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('You must be logged in.')

  const { data, error } = await supabase
    .from('study_tasks')
    .select('*')
    .eq('student_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createStudyTask(task) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('You must be logged in.')

  const { data, error } = await supabase
    .from('study_tasks')
    .insert({
      student_id: user.id,
      title: task.title,
      description: task.description || '',
      subject_id: task.subject_id || null,
      due_date: task.due_date || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStudyTask(id, task) {
  const { data, error } = await supabase
    .from('study_tasks')
    .update({
      title: task.title,
      description: task.description || '',
      subject_id: task.subject_id || null,
      due_date: task.due_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function toggleStudyTask(id, isCompleted) {
  const { error } = await supabase
    .from('study_tasks')
    .update({
      is_completed: isCompleted,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error
}

export async function deleteStudyTask(id) {
  const { error } = await supabase
    .from('study_tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}
