import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useQuickNotes } from '../features/quickNotes/application/useQuickNotes';
import { QuickNote } from '../features/quickNotes/domain/types';
import { useTheme, Colors } from '../context/ThemeContext';

const getStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text, 
    },
    message: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 50,
      color: colors.text,
    },
    errorText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 50,
      color: 'red',
    },
    inputContainer: {
      marginBottom: 20,
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    input: {
      minHeight: 80,
      borderColor: colors.border,
      color: colors.text,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      textAlignVertical: 'top',
    },
    noteList: {
      flex: 1,
    },
    noteListContent: {
      paddingBottom: 20,
    },
    noteItem: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    noteContent: {
      fontSize: 16,
      marginBottom: 10,
      color: colors.text,
    },
    noteActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      marginLeft: 10,
      padding: 8,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      color: colors.background,
      fontSize: 14,
    },
    deleteButton: {
      backgroundColor: '#dc3545',
    },
    editContainer: {
    },
    editInput: {
      minHeight: 80,
      borderColor: colors.primary,
      color: colors.text,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      textAlignVertical: 'top',
    },
  });

export const QuickNotesScreen = () => {
  const { notes, loading, error, isAuthenticated, createNote, editNote, removeNote } = useQuickNotes();
  const theme = useTheme();
  const [newNoteContent, setNewNoteContent] = useState('');

  if (!theme || !theme.colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>
          Theme or colors not available. Please check ThemeProvider.
        </Text>
      </View>
    );
  }

  const { colors } = theme;
  const styles = getStyles(colors);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to use quick notes.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const handleAddNote = async () => {
    if (newNoteContent.trim()) {
      await createNote({ content: newNoteContent.trim() });
      setNewNoteContent('');
    } else {
      Alert.alert('Empty Note', 'Note content cannot be empty.');
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => await removeNote(id),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditNote = (note: QuickNote) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (editingNoteId && editingNoteContent.trim()) {
      await editNote(editingNoteId, editingNoteContent.trim());
      setEditingNoteId(null);
      setEditingNoteContent('');
    } else {
      Alert.alert('Empty Note', 'Note content cannot be empty.');
    }
  };

  const renderNoteItem = ({ item }: { item: QuickNote }) => (
    <View style={styles.noteItem}>
      {editingNoteId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editingNoteContent}
            onChangeText={setEditingNoteContent}
            multiline
            placeholderTextColor={colors.secondary}
          />
          <Button title="Save" onPress={handleSaveEdit} />
          <Button title="Cancel" onPress={() => setEditingNoteId(null)} color="gray" />
        </View>
      ) : (
        <>
          <Text style={styles.noteContent}>{item.content}</Text>
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={() => handleEditNote(item)} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={[styles.actionButton, styles.deleteButton]}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Notes</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a new note..."
          placeholderTextColor={colors.secondary}
          value={newNoteContent}
          onChangeText={setNewNoteContent}
          multiline
        />
        <Button title="Add Note" onPress={handleAddNote} disabled={loading} />
      </View>

      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        style={styles.noteList}
        contentContainerStyle={styles.noteListContent}
      />
    </View>
  );
};