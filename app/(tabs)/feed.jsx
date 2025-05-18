import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialPosts = [
  {
    id: 1,
    user: 'Amina Khan',
    location: 'Hunza, Gilgit-Baltistan',
    description: 'Enjoying the Breathtaking view of Attabad Lake',
    likes: 239,
    comments: 13,
    image: 'https://lh5.googleusercontent.com/p/AF1QipOXfa4Ym4iWznbcGcifcW--yb85Za2-T3gdBumd=w608-h351-n-k-no',
  },
  {
    id: 2,
    user: 'Faisal Ahmed',
    location: 'Badshahi Mosque, Lahore',
    description: 'Mesmerized by the architectural beauty of Badshahi Mosque',
    likes: 239,
    comments: 13,
    image: 'https://media.istockphoto.com/id/1386446426/photo/badshahi-mosque.jpg?s=612x612&w=0&k=20&c=vShhc9rb17q_5k-tx_HJnlDvlE4YjCNNlOCEWplI2_Y=',
  },
  {
    id: 3,
    user: 'Abrar Ahmed',
    location: 'Faisal Mosque, Islamabad',
    description: 'Faisal Mosque, an iconic and breathtaking structure and one of the largest mosques in the world.',
    likes: 51,
    comments: 0,
    image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT0y2ssjUoqquv9gOWU0dlch-WR9dPqewpVzFzkYC7QDrERUm4MIwY25cNOmsPOVkd7acQNAfE5as8vNpTqA7qrGmjAuUvceY-Y_JmCRA',
  }
];

export default function FeedScreen() {
  const [posts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // Toggle like function
  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Share button popup
  const handleShare = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.feedTitle}>Explore Pakistan’s Wonders</Text>

      {/* Posts Feed */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <Ionicons name="person-circle-outline" size={24} color="#1b5e20" />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{post.user}</Text>
                <Text style={styles.userLocation}>{post.location}</Text>
              </View>
            </View>

            {/* Post Image */}
            <Image source={{ uri: post.image }} style={styles.postImage} />

            {/* Description */}
            <Text style={styles.description}>{post.description}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              {/* Like Button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleLike(post.id)}
              >
                <Ionicons
                  name={likedPosts[post.id] ? 'heart' : 'heart-outline'}
                  size={20}
                  color={likedPosts[post.id] ? 'red' : '#1b5e20'}
                />
                <Text style={styles.actionText}>{post.likes + (likedPosts[post.id] ? 1 : 0)}</Text>
              </TouchableOpacity>

              {/* Comment Button */}
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#1b5e20" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="#1b5e20" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Share Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share this Post</Text>

            <TouchableOpacity style={styles.modalButton} onPress={() => Alert.alert('Link Copied')}>
              <Text>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => Alert.alert('Shared on Facebook')}>
              <Text>Share on Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => Alert.alert('Shared on WhatsApp')}>
              <Text>Share on WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => Alert.alert('Shared on Instagram')}>
              <Text>Share on Instagram</Text>
            </TouchableOpacity>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'white' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1b5e20',
    marginVertical: 16,
  },
  postCard: {
    backgroundColor: '#f0f8f0',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  userLocation: {
    fontSize: 14,
    color: '#555',
  },
  postImage: {
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#1b5e20',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#1b5e20',
    padding: 10,
    borderRadius: 5,
  },
});

