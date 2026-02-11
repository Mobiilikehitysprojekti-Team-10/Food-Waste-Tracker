import { supabase } from '../../../lib/supabase';
import { QuickNote, NewQuickNote } from '../domain/types';

export const fetchQuickNotes = async (): Promise<QuickNote[]> => {
  const { data, error } = await supabase
    .from('quick_notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as QuickNote[];
};

export const addQuickNote = async (note: NewQuickNote): Promise<QuickNote> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('quick_notes')
    .insert({ user_id: user.id, content: note.content })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as QuickNote;
};

export const updateQuickNote = async (id: string, content: string): Promise<QuickNote> => {
  const { data, error } = await supabase
    .from('quick_notes')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as QuickNote;
};

export const deleteQuickNote = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('quick_notes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
