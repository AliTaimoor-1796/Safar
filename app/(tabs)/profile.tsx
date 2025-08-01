import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../../context/PostContext';
import uuid from 'react-native-uuid';

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const { addPost } = usePosts();

  const handleAddPost = () => {
    if (!description.trim()) {
      Alert.alert('Please add a description');
      return;
    }

    addPost({
      id: uuid.v4().toString(),
      user: 'Ali Taimoor',
      location: 'Pakistan',
      description,
      likes: 0,
      comments: 0,
      image: image || undefined,
      video: video || undefined,
    });

    setDescription('');
    setImage('');
    setVideo('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.profileImageContainer}>
          <Image
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('@/assets/images/profile_picture.jpeg')}
            style={{width: 80, height:80, borderRadius: 40}}
            resizeMode="contain"
          />
        </View>
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

      <Text style={styles.userName}>Ali Taimoor</Text>
      <Text style={styles.description}>
        Undergraduate student 🌍 | Loves to travel ✈️ | Prefers hiking & trekking ⛰️
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => setShareModalVisible(true)}>
          <Text style={styles.buttonTextOutline}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { marginTop: 20, backgroundColor: '#4caf50', maxHeight: '5%' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add Post</Text>
      </TouchableOpacity>

      <View style={styles.highlightsContainer}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <TouchableOpacity style={styles.highlightCircle}>
          <Ionicons name="add-circle-outline" size={50} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.noPostsContainer}>
        <Ionicons name="camera-outline" size={60} color="#bbb" />
        <Text style={styles.noPostsText}>No Posts Yet</Text>
      </View>

      {/* Modal for Add Post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Create a Post</Text>
            <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
            <TextInput placeholder="Image URL (optional)" style={styles.input} value={image} onChangeText={setImage} />
            <TextInput placeholder="Video URL (optional)" style={styles.input} value={video} onChangeText={setVideo} />
            <Pressable style={styles.modalButton} onPress={handleAddPost}>
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for Edit Profile (Mock) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <TextInput placeholder="Change Username" style={styles.input} />
            <TextInput placeholder="Change Password" secureTextEntry style={styles.input} />
            <TextInput placeholder="Profile Picture URL" style={styles.input} />
            <TextInput placeholder="Bio" style={styles.input} />
            <Pressable style={styles.modalButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.buttonText}>Save (UI Only)</Text>
            </Pressable>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for Share Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Share Profile</Text>
            <TouchableOpacity style={styles.input} onPress={() => Alert.alert('Link Copied')}>
              <Text>📋 Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.input} onPress={() => Alert.alert('Shared to WhatsApp')}>
              <Text>📲 WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.input} onPress={() => Alert.alert('Shared to Facebook')}>
              <Text>📘 Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.input} onPress={() => Alert.alert('Shared to Instagram')}>
              <Text>📸 Instagram</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setShareModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    color: '#057958',
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
    backgroundColor: '#057958',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  buttonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#057958',
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
    color: '#057958',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 6,
  },
  modalButton: {
    backgroundColor: '#057958',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
});
