import React, { useState, useEffect, useRef } from 'react';
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
import { useGlobalStore } from '@/store/globalStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function NewTripScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const {
    tripTitle,
    tripDuration,
    setTripTitle,
    setTripDuration,
    selectedDestinations,
    addDestination,
  } = useGlobalStore();

  const searchPlaces = async (text: string) => {
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5&accept-language=en`,
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

  const debouncedSearch = (text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchPlaces(text);
    }, 500);
  };

  const addLocation = (place: any) => {
    const newLoc = {
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      label: place.display_name,
    };
    addDestination(newLoc);
    setQuery('');
    setResults([]);
  };

  const handleFormSubmit = () => {
    if (!tripTitle.trim() || !tripDuration.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    if (selectedDestinations.length === 0) {
      Alert.alert('Missing Locations', 'Please add at least one location.');
      return;
    }

    router.push('/(tabs)/journey');
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {step === 'select' ? (
        <>
          <Text style={styles.heading}>Start Your Journey</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => setStep('form')}>
            <Text style={styles.optionText}>Solo Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButtonOutline} onPress={() => setGroupModalVisible(true)}>
            <Text style={styles.optionTextOutline}>Join a Group Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back to Trips</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.flexContainer}>
          {/* Inputs and dropdown */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchOverlay}>
              <Text style={styles.heading}>Create a New Trip</Text>

              <TextInput
                placeholder="Trip Title"
                value={tripTitle}
                onChangeText={setTripTitle}
                style={styles.input}
              />

              <TextInput
                placeholder="Duration (e.g., 4 days)"
                value={tripDuration}
                onChangeText={setTripDuration}
                style={styles.input}
              />

              <View style={styles.inputWithIcon}>
                <TextInput
                  placeholder="Search for locations"
                  value={query}
                  onChangeText={debouncedSearch}
                  style={styles.searchInput}
                />
                <View style={styles.iconContainer}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#057958" />
                  ) : (
                    <MaterialIcons name="search" size={20} color="#888" />
                  )}
                </View>
              </View>

              {results.length > 0 && (
                <View style={styles.resultsDropdown}>
                  <FlatList
                    data={results}
                    keyExtractor={(item) => item.place_id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.resultItem} onPress={() => addLocation(item)}>
                        <Text>{item.display_name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </View>


          {/* Map behind inputs */}
          <MapView
            style={styles.mapFull}
            initialRegion={{
              latitude: 30.3753,
              longitude: 69.3451,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            {selectedDestinations.map((loc, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                title={loc.label}
              />
            ))}
          </MapView>

          {/* Action buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.createBtn} onPress={handleFormSubmit}>
              <Text style={styles.createText}>Create Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('select')} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    backgroundColor: '#057958',
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
    borderColor: '#057958',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTextOutline: {
    color: '#057958',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: { alignItems: 'center', marginTop: 10 },
  backText: { color: '#057958' },
  createBtn: {
    backgroundColor: '#057958',
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
    height: 300,
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
    backgroundColor: '#057958',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  flexContainer: {
    flex: 1,
    position: 'relative',
  },

  searchWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 0,
  },

  searchOverlay: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  resultsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },

  mapFull: {
    flex: 1,
    borderRadius: 10,
    marginTop: 180, // adjust this based on how much height the inputs occupy
  },

  footer: {
    backgroundColor: '#fff',
    padding: 10,
  },
  inputWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  iconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -20 }],
  },

  searchIcon: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10
  },
});
