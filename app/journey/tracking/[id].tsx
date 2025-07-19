import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGlobalStore } from '@/store/globalStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function TripTrackingScreen() {
  const { id } = useLocalSearchParams();
  const trips = useGlobalStore((state) => state.trips);
  const updateTrip = useGlobalStore((state) => state.updateTrip);
  const trip = trips.find((t) => t.id === id);
  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      if (isMounted) {
        setLocation(loc);
        mapRef.current?.animateToRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          if (isMounted) setLocation(newLocation);
        }
      );
    };

    const stopWatching = () => {
      watcherRef.current?.remove();
      watcherRef.current = null;
    };

    if (trip?.trackingEnabled) {
      startWatching();
    } else {
      stopWatching();
    }

    return () => {
      isMounted = false;
      stopWatching(); // Clean up on unmount
    };
  }, [trip?.trackingEnabled]);

  if (!trip) return <Text style={styles.error}>Trip not found.</Text>;

  const startLocation = trip.locations[0];

  return (
    <View style={styles.container}>
      {/* Minimalistic Control Panel */}
      <View style={styles.controlPanel}>
        <View style={styles.controlRow}>
          <MaterialIcons name="track-changes" size={20} color="#333" />
          <Text style={styles.controlText}>Journey Tracking</Text>
          <Switch
            value={trip.trackingEnabled}
            onValueChange={() => updateTrip(trip.id, { trackingEnabled: !trip.trackingEnabled })}
            ios_backgroundColor="#e0e0e0"
            trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
            thumbColor={trip.trackingEnabled ? '#057958' : '#f4f3f4'}
          />
        </View>

        <View style={styles.controlRow}>
          <MaterialIcons name="star-border" size={20} color="#333" />
          <Text style={styles.controlText}>Add to Favourites</Text>
          <Switch
            value={trip.isFavorite ?? false}
            onValueChange={() => updateTrip(trip.id, { isFavorite: !(trip.isFavorite ?? false) })}
            ios_backgroundColor="#e0e0e0"
            trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
            thumbColor={trip.isFavorite ? '#057958' : '#f4f3f4'}
          />
        </View>

        <View style={styles.alertCard}>
          <MaterialIcons name="warning-amber" size={20} color="#e53935" style={styles.alertIcon} />
          <Text style={styles.alertText}>
            Alerts: {trip.emergencyAlerts?.trim() ? trip.emergencyAlerts : 'None'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.endTripButton}
          onPress={() => {
            const now = new Date().toISOString();
            updateTrip(trip.id, {
              status: 'completed',
              completedAt: now,
              updatedAt: now,
            });
            router.push('/(tabs)/journey');
          }}
        >
          <MaterialIcons name="flag" size={18} color="#fff" />
          <Text style={styles.endTripText}>End Trip</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        followsUserLocation
      >
        {trip.locations.map((loc, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.label}
          />
        ))}
        <Polyline coordinates={trip.routeCoords} strokeColor="#1565c0" strokeWidth={4} />
      </MapView>

      {!location && <ActivityIndicator style={styles.loader} size="large" color="#1565c0" />}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  controlPanel: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  controlText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  endTripButton: {
    marginTop: 10,
    backgroundColor: '#057958',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endTripText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  error: {
    textAlign: 'center',
    color: 'red',
    padding: 16,
    fontSize: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#e53935',
  },
  
  alertIcon: {
    marginRight: 8,
  },
  
  alertText: {
    color: '#b71c1c',
    fontSize: 14,
    fontWeight: '500',
  },
  alertMessage: {
    flex: 1,
    color: '#b71c1c',
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 18,
  },
});
