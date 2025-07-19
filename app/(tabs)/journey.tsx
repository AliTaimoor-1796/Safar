import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Switch,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  ViewStyle,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useFocusEffect, Link, useRouter } from 'expo-router';
import { usePosts } from '../../context/PostContext';
import uuid from 'react-native-uuid';
import { Trip, useGlobalStore } from '../../store/globalStore';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { sendToGemini } from '@/utils/gemini';
import Markdown from 'react-native-markdown-display';
import * as ImagePicker from 'expo-image-picker';



const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc5MDc1ZTMxNDIwYTRjODNhMmFmNjkzMTg0YmU4YmM4IiwiaCI6Im11cm11cjY0In0=";

export default function JourneyList() {
  const router = useRouter()
  const trips = useGlobalStore((state) => state.trips);
  const addTrip = useGlobalStore((state) => state.addTrip);
  const updateTrip = useGlobalStore((state) => state.updateTrip);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [lastTripHash, setLastTripHash] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [start, setStart] = useState('');
  const [middle, setMiddle] = useState('');
  const [end, setEnd] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const { addPost } = usePosts();
  const selectedDestinations = useGlobalStore((state) => state.selectedDestinations);
  const setRouteGeoJSON = useGlobalStore((state) => state.setRouteGeoJSON);
  const tripTitle = useGlobalStore((state) => state.tripTitle);
  const tripDuration = useGlobalStore((state) => state.tripDuration);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editTripId, setEditTripId] = useState<string | null>(null);

  const chatHistory = useGlobalStore((state) => state.chatHistory);
  const addChatResponse = useGlobalStore((state) => state.addChatResponse);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingPredefinedTrip, setLoadingPredefinedTrip] = useState(false);
  const imageUri = useGlobalStore((state) => state.uploadedImageUri);
  const setImageUri = useGlobalStore((state) => state.setUploadedImageUri);

  const handleChatSubmit = async () => {
    if (!chatInput) return;
    setChatLoading(true);
    const response = await sendToGemini(chatInput);
    addChatResponse(response);
    setChatInput('');
    setChatLoading(false);
  };


  const toggleExpand = (id: string) => {
    setExpandedTripId((prev) => (prev === id ? null : id));
  };
  const toggleTracking = (id: string) => {
    const trip = trips.find((t) => t.id === id);
    if (!trip) return;
    updateTrip(id, { trackingEnabled: !trip.trackingEnabled });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Please allow access to media library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ modern way
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openShareForm = (trip: Trip) => {
    const locs = trip.locations;
    setStart(locs[0]?.label ?? '');
    setEnd(locs[locs.length - 1]?.label ?? '');
    setMiddle(
      locs.length > 2
        ? locs
          .slice(1, locs.length - 1)
          .map((l) => l.label)
          .join(', ')
        : ''
    );

    setImage('');
    setModalVisible(true);
  };

  const handlePost = () => {
    if (!start || !end || !caption) {
      Alert.alert('Missing fields', 'Start, End, and Caption are required.');
      return;
    }

    addPost({
      id: uuid.v4().toString(),
      user: 'Ali Taimoor',
      location: `${start}, ${middle ? middle + ', ' : ''}${end}`,
      description: caption,
      image: imageUri || undefined,
      likes: 0,
      comments: 0,
    });
    router.push('/(tabs)/feed')

    setModalVisible(false);
    setStart('');
    setMiddle('');
    setEnd('');
    setCaption('');
    setImage('');
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };
  const calculateTotalDistance = (locations: { latitude: number; longitude: number }[]) => {
    let total = 0;
    for (let i = 0; i < locations.length - 1; i++) {
      total += haversineDistance(
        locations[i].latitude,
        locations[i].longitude,
        locations[i + 1].latitude,
        locations[i + 1].longitude
      );
    }
    return total;
  };

  const estimateDurationFromDistance = (distanceKm: number, averageSpeedKmh = 60) => {
    const hours = distanceKm / averageSpeedKmh;
    const days = Math.ceil(hours / 8); // Assuming 8 hours of travel per day
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const fetchRoutePolyline = async (locations: any[]) => {
    if (locations.length < 2) return [];

    const coords = locations.map((loc) => [loc.longitude, loc.latitude]);

    const body = {
      coordinates: coords,
      instructions: false,
    };

    try {
      const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data?.features?.[0]?.geometry?.coordinates) {
        throw new Error(JSON.stringify(data));
      }

      // ✅ Save full GeoJSON to Zustand
      setRouteGeoJSON(data);

      // Return simplified polyline for rendering
      return data.features[0].geometry.coordinates.map(([lon, lat]: number[]) => ({
        latitude: lat,
        longitude: lon,
      }));
    } catch (error) {
      console.warn('🚧 ORS route fetch failed. Falling back to straight lines.', error);
      Alert.alert('Route Error', 'Real route could not be fetched. Using straight-line path instead.');
      return locations.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadTrip = async () => {
        if (!selectedDestinations || selectedDestinations.length < 2) return;

        const hash = JSON.stringify(selectedDestinations);
        if (hash === lastTripHash) return;

        try {
          const routeCoords = await fetchRoutePolyline(selectedDestinations);

          const totalKm = calculateTotalDistance(selectedDestinations);
          const estimatedDuration = estimateDurationFromDistance(totalKm); // e.g., "3 days"

          // Parse numbers from strings
          const estimatedDays = parseInt(estimatedDuration);
          const userDays = parseInt(tripDuration); // This will work for "3" or "3 days"

          if (!isNaN(userDays) && userDays < estimatedDays) {
            Alert.alert(
              'Insufficient Duration',
              `You entered ${userDays} day(s), but the estimated duration based on your route is ${estimatedDays} day(s). Consider increasing your trip duration.`
            );
          }

          addTrip({
            id: Date.now().toString(),
            title: tripTitle || `Trip ${Date.now()}`,
            duration: tripDuration || estimatedDuration,
            locations: selectedDestinations,
            routeCoords,
            trackingEnabled: true,
            status: 'planned', // Default status
            createdAt: new Date().toISOString(),
            emergencyAlerts: "",
          });
          console.log({
            id: Date.now().toString(),
            title: tripTitle || `Trip ${Date.now()}`,
            duration: tripDuration || estimatedDuration,
            locations: selectedDestinations,
            routeCoords,
            trackingEnabled: true,
            status: 'planned', // Default status
            createdAt: new Date().toISOString(),
            emergencyAlerts: "",
          })
          setLastTripHash(hash);
        } catch (error) {
          console.error('Failed to load trip:', error);
        }
        useGlobalStore.getState().setTripTitle('');
        useGlobalStore.getState().setTripDuration('');
        useGlobalStore.getState().clearDestinations();
      };

      loadTrip();
    }, [selectedDestinations, lastTripHash])
  );
  const formatDateWithSuffix = (isoString: string | undefined) => {
    const date = new Date(isoString ?? "");
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinalSuffix = (n: number) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };
  useFocusEffect(
    useCallback(() => {
      const addPredefinedTrip = async () => {
        const tripExists = useGlobalStore.getState().trips.some((t) => t.id === '1');
        if (tripExists) return;
        setLoadingPredefinedTrip(true);
        const predefinedTrip: Trip = {
          id: '1',
          title: 'Karachi → Islamabad → Lahore → Karachi',
          duration: '6',
          locations: [
            { latitude: 24.8607, longitude: 67.0011, label: 'Karachi Airport' },
            { latitude: 33.6844, longitude: 73.0479, label: 'Islamabad Airport' },
            { latitude: 33.7294, longitude: 73.0379, label: 'Faisal Mosque' },
            { latitude: 31.582, longitude: 74.329, label: 'Minar-e-Pakistan' },
            { latitude: 31.5889, longitude: 74.3107, label: 'Badshahi Mosque' },
            { latitude: 24.8607, longitude: 67.0011, label: 'Karachi (Return)' },
          ],
          routeCoords: [],
          trackingEnabled: true,
          status: 'completed',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date().toISOString(),
          emergencyAlerts: '',
        };

        try {
          const routeCoords = await fetchRoutePolyline(predefinedTrip.locations);
          useGlobalStore.getState().addTrip({ ...predefinedTrip, routeCoords });
        } catch (err) {
          console.warn('❌ Could not fetch default trip route:', err);
          useGlobalStore.getState().addTrip(predefinedTrip); // fallback without route
        } finally {
          setLoadingPredefinedTrip(false);
        }

      };

      addPredefinedTrip();
    }, [])
  );


  return (
    <>
      {loadingPredefinedTrip ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 0 }}>
          <ActivityIndicator size="large" color="#057958" />
          <Text style={{ marginTop: 12, fontSize: 16, color: '#555' }}>Loading trips...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Link href="/journey/new" asChild>
              <TouchableOpacity style={styles.createBtn}>
                <Text style={styles.createText}>+ Create New Trip</Text>
              </TouchableOpacity>
            </Link>
          }
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => {
            const isExpanded = item.id === expandedTripId;
            return (
              <View>
                <TouchableOpacity
                  style={[styles.tripCard, isExpanded && styles.tripCardExpanded]}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.tripHeader}>
                    <View style={{ flexShrink: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
                          <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.duration}>{item.duration} days</Text>
                      <Text style={styles.metaText}>{formatDateWithSuffix(item.createdAt)} - {formatDateWithSuffix(item.completedAt)}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setEditTripId(item.id);
                        setEditTitle(item.title);
                        setEditDuration(item.duration);
                        setEditModalVisible(true);
                      }}
                      style={styles.editIcon}
                    >
                      <MaterialIcons name="edit" size={22} color="#444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {isExpanded && item.locations.length > 0 && (
                  item.completedAt && (
                    <View style={styles.metaInfo}>
                      <MaterialIcons name="event-available" size={16} color="#4caf50" />
                      <Text style={styles.metaText}>Completed: {new Date(item.completedAt).toLocaleDateString()}</Text>
                    </View>
                  ),
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: item.locations[0].latitude,
                        longitude: item.locations[0].longitude,
                        latitudeDelta: 5,
                        longitudeDelta: 5,
                      }}
                    >
                      {item.locations.map((loc, index) => (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                          }}
                          title={loc.label}
                        />
                      ))}

                      {item.routeCoords && item.routeCoords.length > 1 && (
                        <Polyline
                          coordinates={item.routeCoords}
                          strokeColor="#057958"
                          strokeWidth={4}
                        />
                      )}
                    </MapView>

                    <View style={styles.controls}>
                      <TouchableOpacity onPress={() => openShareForm(item)} style={styles.controlBtn}>
                        <MaterialIcons name="share" size={18} color="white" style={styles.iconSpacing} />
                        <Text style={styles.controlText}>Share</Text>
                      </TouchableOpacity>

                      {['planned', 'ongoing', 'paused'].includes(item.status) && (
                        <TouchableOpacity
                          style={[styles.controlBtn]}
                          onPress={() => {
                            updateTrip(item.id, { status: "ongoing" })
                            router.push(`/journey/tracking/${item.id}`)
                          }}
                        >
                          <MaterialIcons name="play-arrow" size={20} color="white" style={styles.iconSpacing} />
                          <Text style={styles.controlText}>{item.status === "ongoing" ? "See trip" : "Start Trip"}</Text>
                        </TouchableOpacity>
                      )}

                      <View style={styles.tracking}>
                        <Text style={styles.trackLabel}>Track</Text>
                        <Switch
                          value={item.trackingEnabled}
                          onValueChange={() => toggleTracking(item.id)}
                          thumbColor={item.trackingEnabled ? '#057958' : '#ccc'}
                          trackColor={{ true: '#a5d6a7', false: '#e0e0e0' }}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>

            );
          }}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Trip to Feed</Text>

            <Text style={styles.label}>Caption</Text>
            <TextInput
              placeholder="Caption"
              style={styles.input}
              value={caption}
              onChangeText={setCaption}
            />

            <Text style={styles.label}>Start Destination</Text>
            <TextInput
              placeholder="Start Destination"
              style={styles.input}
              value={start}
              onChangeText={setStart}
            />

            <Text style={styles.label}>Middle Destination (optional)</Text>
            <TextInput
              placeholder="Middle Destination (optional)"
              style={styles.input}
              value={middle}
              onChangeText={setMiddle}
            />

            <Text style={styles.label}>End Destination</Text>
            <TextInput
              placeholder="End Destination"
              style={styles.input}
              value={end}
              onChangeText={setEnd}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.mediaButton}
              >
                <Octicons name="upload" size={20} color="white" style={styles.mediaIcon} />
                <Text style={styles.mediaButtonText}>{image ? "Change Images" : "Images"}</Text>
              </TouchableOpacity>
              {image ? (
                <Text style={styles.selectedText}>✅ Selected: {image.split('/').pop()}</Text>
              ) : null}
            </View>
            <Pressable style={styles.modalBtn} onPress={handlePost}>
              <Text style={{ color: 'white' }}>Post to Feed</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Trip</Text>

            <TextInput
              placeholder="Trip Title"
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              placeholder="Trip Duration (days)"
              style={styles.input}
              keyboardType="numeric"
              value={editDuration}
              onChangeText={setEditDuration}
            />

            <Pressable
              style={styles.modalBtn}
              onPress={() => {
                if (!editTripId) return;

                updateTrip(editTripId, {
                  title: editTitle,
                  duration: editDuration,
                });

                setEditModalVisible(false);
              }}
            >
              <Text style={{ color: 'white' }}>Save Changes</Text>
            </Pressable>

            <Pressable onPress={() => setEditModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => setChatOpen(true)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: '#057958',
          padding: 14,
          borderRadius: 30,
          elevation: 5,
          zIndex: 1000,
        }}
      >
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={chatOpen} transparent animationType="fade">
        <View style={styles.chatOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Travel Assistant</Text>
              <TouchableOpacity
                onPress={() => useGlobalStore.getState().clearChatHistory()}
                onLongPress={() => Alert.alert('Clear Chat', 'This will clear all chat messages.')}
                style={styles.trashButton}
              >
                <MaterialIcons name="delete-outline" size={20} color="#057958" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {chatHistory.length === 0 ? (
                <Text style={{ color: '#777', textAlign: 'center' }}>Start chatting with Gemini...</Text>
              ) : (
                chatHistory.map((response, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Markdown style={markdownStyles}>{response}</Markdown>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Ask anything about your trip..."
                  placeholderTextColor="#999"
                  value={chatInput}
                  onChangeText={setChatInput}
                />
              </View>
              <Pressable
                style={[styles.sendButton, chatLoading && { opacity: 0.6 }]}
                onPress={handleChatSubmit}
                disabled={chatLoading}
              >
                {chatLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialIcons name="send" size={20} color="white" />
                )}
              </Pressable>
            </View>


            <Pressable onPress={() => setChatOpen(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  createBtn: {
    backgroundColor: '#057958',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  createText: { color: 'white', fontWeight: 'bold' },
  tripCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 5,
    marginTop: 10,
  },
  tripCardExpanded: {
    backgroundColor: '#d0f0d0',
  },
  title: { fontSize: 16, fontWeight: '600' },
  duration: { fontSize: 14, color: '#555' },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: { flex: 1 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  shareBtn: {
    backgroundColor: '#057958',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  shareText: {
    color: 'white',
    fontWeight: '600',
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 10,
    padding: 4,
    zIndex: 10,
  },
  tracking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalBtn: {
    backgroundColor: '#057958',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 5,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#057958',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
  },
  controlText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  iconSpacing: {
    marginRight: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },

  status_planned: { backgroundColor: '#757575' },
  status_ongoing: { backgroundColor: '#1e88e5' },
  status_paused: { backgroundColor: '#fbc02d' },
  status_completed: { backgroundColor: '#057958' },
  status_cancelled: { backgroundColor: '#e53935' },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  metaText: {
    marginLeft: 0,
    fontSize: 13,
    color: '#057958',
    fontWeight: '500',
  },
  chatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  chatContainer: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'flex-start',
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#057958',
  },

  scrollView: {
    flexGrow: 0,
    maxHeight: "100%",
    marginBottom: 16,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  responseText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },

  inputWrapper: {
    flex: 1,
    paddingLeft: 8,
  },

  inputText: {
    fontSize: 15,
    paddingVertical: 8,
    paddingRight: 8,
    color: '#000',
  },

  sendButton: {
    backgroundColor: '#057958',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
  },

  closeText: {
    color: 'red',
    fontSize: 14,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  trashButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#e8f5e9', // soft green background on white
  },
  mediaButton: {
    flexDirection: 'row',
    width: "30%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057958',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  mediaIcon: {
    marginRight: 8,
  },

  mediaButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  selectedText: {
    fontSize: 12,
    color: '#444',
    marginBottom: 10,
    marginLeft: 4,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 10,
    color: '#333',
  },  
});


const markdownStyles: Partial<{
  body: TextStyle;
  strong: TextStyle;
  bullet_list: ViewStyle;
  bullet: TextStyle;
  paragraph: TextStyle;
}> = {
  body: {
    fontSize: 15,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold', // must match allowed values exactly
  },
  bullet_list: {
    paddingLeft: 12,
  },
  bullet: {
    fontSize: 14,
  },
  paragraph: {
    marginBottom: 8,
  },
};