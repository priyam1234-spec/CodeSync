import { supabase, isSupabaseConfigured } from './supabase'

const LOCAL_STORAGE_KEY = 'codesync_snippets'

function getLocalSnippets() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  } catch { return [] }
}

export async function saveSnippet(snippet) {
  if (!isSupabaseConfigured()) {
    /* ... local storage logic ... */
    return;
  }

  const isNew = !snippet.id;
  const storedToken = snippet.id ? localStorage.getItem(`edit_token_${snippet.id}`) : null;

  // We build the query object first
  let query;
  
  if (isNew) {
    // FRESH INSERT: No ID, no Token needed
    query = supabase.from('snippets').insert({
      title: snippet.title || 'Untitled',
      code: snippet.code,
      language: snippet.language,
    });
  } else {
    // SECURE UPDATE: Must send the token
    query = supabase.from('snippets').update({
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      updated_at: new Date().toISOString(),
    })
    .eq('id', snippet.id)
    .setHeader('x-edit-token', storedToken || '');
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error("Database Error:", error.message);
    throw error;
  }

  // If it's new, save the brand new token so we can edit later
  if (isNew && data.edit_token) {
    localStorage.setItem(`edit_token_${data.id}`, data.edit_token);
  }

  return data;
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
