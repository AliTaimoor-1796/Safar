import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useFocusEffect, Link } from 'expo-router';

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
  },
  {
    id: '2',
    title: 'Skardu Adventure',
    duration: '4 days',
    locations: [
      { latitude: 35.3397, longitude: 75.6339, label: 'Skardu' },
      { latitude: 35.4102, longitude: 75.6357, label: 'Satpara Lake' },
      { latitude: 35.3666, longitude: 75.574, label: 'Shangrila Resort' },
    ],
  },
  {
    id: '3',
    title: 'Hunza Valley Trip',
    duration: '5 days',
    locations: [
      { latitude: 36.3204, longitude: 74.6214, label: 'Hunza Valley' },
      { latitude: 36.3294, longitude: 74.5435, label: 'Baltit Fort' },
      { latitude: 36.3344, longitude: 74.5489, label: 'Eagle’s Nest' },
    ],
  },
];

export default function JourneyList() {
  const params = useLocalSearchParams();
  const [trips, setTrips] = useState(defaultTrips);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (params?.newTrip) {
        try {
          const parsed = JSON.parse(params.newTrip as string);
          const newTrip = {
            ...parsed,
            id: Date.now().toString(),
            locations: [
              {
                latitude: 33.6844,
                longitude: 73.0479,
                label: parsed.title,
              },
            ],
          };
          setTrips((prev) => [...prev, newTrip]);
        } catch (error) {
          console.error('Invalid newTrip param:', error);
        }
      }
    }, [params?.newTrip])
  );

  const toggleExpand = (id: string) => {
    setExpandedTripId((prev) => (prev === id ? null : id));
  };

  return (
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

            {isExpanded && (
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
                  <Polyline
                    coordinates={item.locations.map((loc) => ({
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                    }))}
                    strokeColor="#1b5e20"
                    strokeWidth={3}
                  />
                </MapView>
              </View>
            )}
          </View>
        );
      }}
    />
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
  map: {
    flex: 1,
  },
});
