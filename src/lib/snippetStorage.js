import { supabase, isSupabaseConfigured } from './supabase'

const LOCAL_STORAGE_KEY = 'codesync_snippets'

function getLocalSnippets() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  } catch { return [] }
}

export async function saveSnippet(snippet) {
  if (isSupabaseConfigured()) {
    // UPSERT: If ID exists, update. If not, insert.
    const { data, error } = await supabase
      .from('snippets')
      .upsert({
        id: snippet.id || undefined, // Let DB generate UUID if missing
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Local storage fallback
    const snippets = getLocalSnippets()
    const snippetToSave = {
      ...snippet,
      id: snippet.id || crypto.randomUUID(),
      updated_at: new Date().toISOString(),
    }
    const index = snippets.findIndex(s => s.id === snippetToSave.id)
    if (index >= 0) snippets[index] = snippetToSave
    else snippets.push(snippetToSave)
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snippets))
    return snippetToSave
  }
}

export async function loadSnippet(id) {
  if (!id) return null
  
  if (isSupabaseConfigured()) {
    // maybeSingle() prevents the 406/404 error if ID is not found
    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('id', id)
      .maybeSingle() 
      
    if (error) {
      console.error("Load Error:", error.message)
      return null
    }
    return data
  } else {
    return getLocalSnippets().find(s => s.id === id) || null
  }
}

// ... keep loadAllSnippets and deleteSnippet as they were
export async function loadAllSnippets() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data
  } else {
    return getLocalSnippets()
  }
}

export async function deleteSnippet(id) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('snippets')
      .delete()
      .eq('id', id)
    if (error) throw error
  } else {
    const snippets = getLocalSnippets()
    saveLocalSnippets(snippets.filter(s => s.id !== id))
  }
}
