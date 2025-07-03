import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function NewTripScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');

  const handleCreate = () => {
    if (!title || !duration) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    // Ideally, you'd save to backend or local state
    console.log('Created trip:', { title, duration });

    // Go back to Journey List
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a New Trip</Text>

      <TextInput
        placeholder="Trip Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Duration (e.g., 4 days)"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
      />

      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.createText}>Create Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to Trips</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  createBtn: {
    backgroundColor: '#1b5e20',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  createText: { color: 'white', fontWeight: 'bold' },
  backBtn: { alignItems: 'center', marginTop: 10 },
  backText: { color: '#1b5e20' },
});
