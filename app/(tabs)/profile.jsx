import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Profile Image Placeholder */}
        <View style={styles.profileImageContainer}>
          <Ionicons name="person-circle-outline" size={90} color="#1b5e20" />
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>43</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <Text style={styles.userName}>Ali Taimoor</Text>
      <Text style={styles.description}>
        Undergraduate student 🌍 | Loves to travel ✈️ | Prefers hiking & trekking ⛰️
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonTextOutline}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Highlights Section */}
      <View style={styles.highlightsContainer}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <TouchableOpacity style={styles.highlightCircle}>
          <Ionicons name="add-circle-outline" size={50} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* No Posts Section */}
      <View style={styles.noPostsContainer}>
        <Ionicons name="camera-outline" size={60} color="#bbb" />
        <Text style={styles.noPostsText}>No Posts Yet</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImageContainer: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  statLabel: {
    fontSize: 14,
    color: '#444',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#1b5e20',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  buttonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1b5e20',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTextOutline: {
    color: '#1b5e20',
    fontWeight: 'bold',
  },
  highlightsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  noPostsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  noPostsText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
});

