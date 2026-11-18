
import { supabase } from './supabase'

export async function getJournalEntries() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('You must be logged in.')

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createJournalEntry(content) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('You must be logged in.')

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      student_id: user.id,
      content,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateJournalEntry(id, content) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteJournalEntry(id) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)

  if (error) throw error
}
