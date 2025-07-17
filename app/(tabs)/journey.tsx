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
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useFocusEffect, Link } from 'expo-router';
import Constants from 'expo-constants';
import { usePosts } from '../../context/PostContext';
import uuid from 'react-native-uuid';

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc5MDc1ZTMxNDIwYTRjODNhMmFmNjkzMTg0YmU4YmM4IiwiaCI6Im11cm11cjY0In0=";

const defaultTrips = [
  {
    id: '1',
    title: 'Karachi → Islamabad → Lahore → Karachi',
    duration: '6 days',
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
  },
];

export default function JourneyList() {
  const params = useLocalSearchParams();
  const [trips, setTrips] = useState(defaultTrips);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [lastTripHash, setLastTripHash] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [start, setStart] = useState('');
  const [middle, setMiddle] = useState('');
  const [end, setEnd] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const { addPost } = usePosts();

  const toggleExpand = (id: string) => {
    setExpandedTripId((prev) => (prev === id ? null : id));
  };

  const toggleTracking = (id: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, trackingEnabled: !trip.trackingEnabled } : trip
      )
    );
  };

  const openShareForm = (trip: any) => {
    setActiveTrip(trip);
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
      location: `${start} → ${middle ? middle + ' → ' : ''}${end}`,
      description: caption,
      image: image || undefined,
      video: video || undefined,
      likes: 0,
      comments: 0,
    });

    setModalVisible(false);
    setStart('');
    setMiddle('');
    setEnd('');
    setCaption('');
    setImage('');
    setVideo('');
  };

  const fetchRoutePolyline = async (locations: any[]) => {
    if (locations.length < 2) return [];

    const coords = [[67.03294704204545, 24.871952981556745], [74.33669024555968, 31.521697793006314]];
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
        if (params?.newTrip) {
          try {
            const parsed = JSON.parse(params.newTrip as string);
            const hash = JSON.stringify(parsed);
            if (hash === lastTripHash) return;

            const routeCoords = await fetchRoutePolyline(parsed.locations || []);

            const newTrip = {
              ...parsed,
              id: Date.now().toString(),
              locations: parsed.locations || [],
              routeCoords,
              trackingEnabled: true,
            };

            setTrips((prev) => [...prev, newTrip]);
            setLastTripHash(hash);
          } catch (error) {
            console.error('Invalid newTrip param:', error);
          }
        }
      };

      loadTrip();
    }, [params?.newTrip, lastTripHash])
  );

  return (
    <>
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
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.duration}>{item.duration}</Text>
              </TouchableOpacity>

              {isExpanded && item.locations.length > 0 && (
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
                        strokeColor="#1b5e20"
                        strokeWidth={4}
                      />
                    )}
                  </MapView>

                  <View style={styles.controls}>
                    <TouchableOpacity onPress={() => openShareForm(item)} style={styles.shareBtn}>
                      <Text style={styles.shareText}>📤 Share</Text>
                    </TouchableOpacity>

                    <View style={styles.tracking}>
                      <Text style={styles.trackLabel}>Journey Tracking</Text>
                      <Switch
                        value={item.trackingEnabled}
                        onValueChange={() => toggleTracking(item.id)}
                        thumbColor={item.trackingEnabled ? '#1b5e20' : '#ccc'}
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Trip to Feed</Text>

            <TextInput
              placeholder="Start Destination"
              style={styles.input}
              value={start}
              onChangeText={setStart}
            />
            <TextInput
              placeholder="Middle Destination (optional)"
              style={styles.input}
              value={middle}
              onChangeText={setMiddle}
            />
            <TextInput
              placeholder="End Destination"
              style={styles.input}
              value={end}
              onChangeText={setEnd}
            />
            <TextInput
              placeholder="Caption"
              style={styles.input}
              value={caption}
              onChangeText={setCaption}
            />
            <TextInput
              placeholder="Image URL (optional)"
              style={styles.input}
              value={image}
              onChangeText={setImage}
            />
            <TextInput
              placeholder="Video URL (optional)"
              style={styles.input}
              value={video}
              onChangeText={setVideo}
            />

            <Pressable style={styles.modalBtn} onPress={handlePost}>
              <Text style={{ color: 'white' }}>Post to Feed</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
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
    backgroundColor: '#1b5e20',
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
    marginBottom: 12,
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
    backgroundColor: '#1b5e20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  shareText: {
    color: 'white',
    fontWeight: '600',
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
    backgroundColor: '#1b5e20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
});
