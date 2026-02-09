import { useState, useEffect, useCallback } from 'react';
import { QuickNote, NewQuickNote } from '../domain/types';
import { fetchQuickNotes, addQuickNote, updateQuickNote, deleteQuickNote } from '../data/quickNotesRepository';
import { supabase } from '../../../lib/supabase';

export const useQuickNotes = () => {
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadNotes();
      } else {
        setNotes([]);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotes();
    }
  }, [isAuthenticated]);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await fetchQuickNotes();
      setNotes(fetchedNotes);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch quick notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (newNote: NewQuickNote) => {
    setLoading(true);
    setError(null);
    try {
      const addedNote = await addQuickNote(newNote);
      setNotes((prevNotes) => [addedNote, ...prevNotes]);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to add quick note:', err);
    } finally {
      setLoading(false);
    }
  };

  const editNote = async (id: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedNote = await updateQuickNote(id, content);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNote : note))
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to update quick note:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeNote = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteQuickNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to delete quick note:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    notes,
    loading,
    error,
    isAuthenticated,
    createNote,
    editNote,
    removeNote,
    loadNotes,
  };
};