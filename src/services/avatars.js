
import { supabase } from './supabase'

export async function uploadAvatar(file, userId) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image.')
  }

  if (file.size > maxSize) {
    throw new Error('Your profile picture must be 5 MB or smaller.')
  }

  const extension = file.type.split('/')[1]
  const filePath = `${userId}/${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const avatarUrl = data.publicUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)

  if (updateError) {
    await supabase.storage.from('avatars').remove([filePath])
    throw updateError
  }

  return avatarUrl
}
