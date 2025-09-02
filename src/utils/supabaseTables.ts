// Supabase table operations for FisApp
import { supabase } from '../config/supabase'

// Types for our database tables
export interface Species {
  id: string
  english_name: string
  afrikaans_name?: string
  scientific_name?: string
  slope?: number
  intercept?: number
  image_filename?: string
  distribution_map_filename?: string
  fishing_info?: any
  regulations?: any
  detailed_description?: string
  created_at: string
  updated_at: string
}

export interface PersonalGalleryEntry {
  id: string
  user_id: string
  species: string
  date: string
  place: string
  length?: number
  weight?: number
  bait?: string
  conditions?: string
  photo_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface PublicGalleryEntry {
  id: string
  user_id: string
  angler_name: string
  species: string
  date: string
  location: string
  bait?: string
  length?: number
  weight?: number
  weather?: string
  tide?: string
  moon_phase?: string
  notes: string
  image_url: string
  likes_count: number
  created_at: string
  updated_at: string
}

export interface SecondHandStoreItem {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  location: string
  contact_name: string
  contact_phone?: string
  contact_email?: string
  image_urls: string[]
  is_sold: boolean
  views_count: number
  created_at: string
  updated_at: string
}

export interface CommunityQA {
  id: string
  user_id: string
  user_name: string
  question: string
  category: string
  tags: string[]
  answer?: string
  answered_by?: string
  answered_at?: string
  is_resolved: boolean
  upvotes: number
  downvotes: number
  created_at: string
  updated_at: string
}

export interface FishIdentification {
  id: string
  user_id: string
  image_url: string
  identified_species?: string
  confidence_score?: number
  ai_response?: any
  user_feedback?: string
  created_at: string
}

// SPECIES OPERATIONS
export const getSpecies = async (): Promise<Species[]> => {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('species')
    .select('*')
    .order('english_name')
  
  if (error) {
    console.error('Error fetching species:', error)
    return []
  }
  
  return data || []
}

export const getSpeciesByName = async (name: string): Promise<Species | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('species')
    .select('*')
    .ilike('english_name', `%${name}%`)
    .single()
  
  if (error) {
    console.error('Error fetching species by name:', error)
    return null
  }
  
  return data
}

// PERSONAL GALLERY OPERATIONS
export const getPersonalGallery = async (userId: string): Promise<PersonalGalleryEntry[]> => {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('personal_gallery')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching personal gallery:', error)
    return []
  }
  
  return data || []
}

export const addPersonalGalleryEntry = async (entry: Omit<PersonalGalleryEntry, 'id' | 'created_at' | 'updated_at'>): Promise<PersonalGalleryEntry | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('personal_gallery')
    .insert([entry])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding personal gallery entry:', error)
    return null
  }
  
  return data
}

export const updatePersonalGalleryEntry = async (id: string, updates: Partial<PersonalGalleryEntry>): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('personal_gallery')
    .update(updates)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating personal gallery entry:', error)
    return false
  }
  
  return true
}

export const deletePersonalGalleryEntry = async (id: string): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('personal_gallery')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting personal gallery entry:', error)
    return false
  }
  
  return true
}

// PUBLIC GALLERY OPERATIONS
export const getPublicGallery = async (limit: number = 50, offset: number = 0): Promise<PublicGalleryEntry[]> => {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('public_gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('Error fetching public gallery:', error)
    return []
  }
  
  return data || []
}

export const addPublicGalleryEntry = async (entry: Omit<PublicGalleryEntry, 'id' | 'likes_count' | 'created_at' | 'updated_at'>): Promise<PublicGalleryEntry | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('public_gallery')
    .insert([entry])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding public gallery entry:', error)
    return null
  }
  
  return data
}

export const deletePublicGalleryEntry = async (id: string, userId: string): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('public_gallery')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error deleting public gallery entry:', error)
    return false
  }
  
  return true
}

// SECOND HAND STORE OPERATIONS
export const getSecondHandStoreItems = async (category?: string, limit: number = 50, offset: number = 0): Promise<SecondHandStoreItem[]> => {
  if (!supabase) return []
  
  let query = supabase
    .from('second_hand_store')
    .select('*')
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
  
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query.range(offset, offset + limit - 1)
  
  if (error) {
    console.error('Error fetching second hand store items:', error)
    return []
  }
  
  return data || []
}

export const addSecondHandStoreItem = async (item: Omit<SecondHandStoreItem, 'id' | 'views_count' | 'created_at' | 'updated_at'>): Promise<SecondHandStoreItem | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('second_hand_store')
    .insert([item])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding second hand store item:', error)
    return null
  }
  
  return data
}

export const updateSecondHandStoreItem = async (id: string, updates: Partial<SecondHandStoreItem>): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('second_hand_store')
    .update(updates)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating second hand store item:', error)
    return false
  }
  
  return true
}

export const deleteSecondHandStoreItem = async (id: string, userId: string): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('second_hand_store')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error deleting second hand store item:', error)
    return false
  }
  
  return true
}

// COMMUNITY Q&A OPERATIONS
export const getCommunityQuestions = async (category?: string, limit: number = 50, offset: number = 0): Promise<CommunityQA[]> => {
  if (!supabase) return []
  
  let query = supabase
    .from('community_qa')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query.range(offset, offset + limit - 1)
  
  if (error) {
    console.error('Error fetching community questions:', error)
    return []
  }
  
  return data || []
}

export const addCommunityQuestion = async (question: Omit<CommunityQA, 'id' | 'is_resolved' | 'upvotes' | 'downvotes' | 'created_at' | 'updated_at'>): Promise<CommunityQA | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('community_qa')
    .insert([question])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding community question:', error)
    return null
  }
  
  return data
}

// FISH IDENTIFICATION OPERATIONS
export const addFishIdentification = async (identification: Omit<FishIdentification, 'id' | 'created_at'>): Promise<FishIdentification | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('fish_identifications')
    .insert([identification])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding fish identification:', error)
    return null
  }
  
  return data
}

export const updateFishIdentificationFeedback = async (id: string, feedback: string): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('fish_identifications')
    .update({ user_feedback: feedback })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating fish identification feedback:', error)
    return false
  }
  
  return true
}

// STORAGE OPERATIONS
export const uploadImage = async (bucket: string, file: File, path: string): Promise<string | null> => {
  if (!supabase) return null
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) {
    console.error('Error uploading image:', error)
    return null
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)
  
  return urlData.publicUrl
}

export const deleteImage = async (bucket: string, path: string): Promise<boolean> => {
  if (!supabase) return false
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    console.error('Error deleting image:', error)
    return false
  }
  
  return true
}
