import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

export default function NewTripScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`,
        {
          headers: {
            'User-Agent': 'SafarApp/1.0 (ds211007@dsu.edu.pk)',
          },
        }
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('OSM search error', error);
    } finally {
      setLoading(false);
    }
  };

  const addLocation = (place: any) => {
    const newLoc = {
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      label: place.display_name,
    };
    setSelectedLocations((prev) => [...prev, newLoc]);
    setQuery('');
    setResults([]);
  };

  const handleFormSubmit = () => {
    if (!title.trim() || !duration.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    if (selectedLocations.length === 0) {
      Alert.alert('Missing Locations', 'Please add at least one location.');
      return;
    }

    const newTrip = {
      title: title.trim(),
      duration: duration.trim(),
      locations: selectedLocations,
    };

    router.push({
      pathname: '/(tabs)/journey/journey',
      params: { newTrip: JSON.stringify(newTrip) },
    } as any);
  };

  return (
    <View style={styles.container}>
      {step === 'select' ? (
        <>
          <Text style={styles.heading}>Start Your Journey</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => setStep('form')}>
            <Text style={styles.optionText}>🚶 Solo Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButtonOutline} onPress={() => setGroupModalVisible(true)}>
            <Text style={styles.optionTextOutline}>👥 Join a Group Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back to Trips</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.heading}>Create a New Trip</Text>

          <TextInput placeholder="Trip Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Duration (e.g., 4 days)" value={duration} onChangeText={setDuration} style={styles.input} />
          <TextInput placeholder="Search for locations" value={query} onChangeText={searchPlaces} style={styles.input} />

          {loading && <ActivityIndicator color="#1b5e20" />}

          <FlatList
            data={results}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => addLocation(item)}>
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 30.3753,
              longitude: 69.3451,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            {selectedLocations.map((loc, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
                title={loc.label}
              />
            ))}
          </MapView>

          <TouchableOpacity style={styles.createBtn} onPress={handleFormSubmit}>
            <Text style={styles.createText}>Create Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep('select')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Group Trip Modal */}
      <Modal
        visible={groupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🚫 No group trips available right now.</Text>
            <Pressable style={styles.modalClose} onPress={() => setGroupModalVisible(false)}>
              <Text style={{ color: 'white' }}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#1b5e20',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optionButtonOutline: {
    borderWidth: 1,
    borderColor: '#1b5e20',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTextOutline: {
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: { alignItems: 'center', marginTop: 10 },
  backText: { color: '#1b5e20' },
  createBtn: {
    backgroundColor: '#1b5e20',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createText: { color: 'white', fontWeight: 'bold' },
  resultItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  map: {
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalClose: {
    backgroundColor: '#1b5e20',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
});
