import { supabase, isSupabaseConfigured } from './supabase'

const LOCAL_STORAGE_KEY = 'codesync_snippets'

function getLocalSnippets() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  } catch { return [] }
}

export async function saveSnippet(snippet) {
  if (isSupabaseConfigured()) {
    // 1. Pull the secret token from LocalStorage for this specific snippet
    const storedToken = localStorage.getItem(`edit_token_${snippet.id}`);

    // 2. Prepare the request
    let query = supabase.from('snippets').upsert({
      id: snippet.id || undefined, // If no ID, Supabase creates one
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      updated_at: new Date().toISOString(),
    });

    // 3. IF we have a token, attach it to the headers
    if (storedToken) {
      query = query.setHeader('x-edit-token', storedToken);
    }

    const { data, error } = await query.select().single();

    if (error) {
      // If error code is 42501 here, it means the token didn't match!
      throw error;
    }

    // 4. If this was a brand new snippet, save the new token we just got back
    if (data.edit_token && !storedToken) {
      localStorage.setItem(`edit_token_${data.id}`, data.edit_token);
    }

    return data;
  }
  // ... rest of your local storage fallback
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
