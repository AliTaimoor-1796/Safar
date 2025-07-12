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
// ✅ Use the custom hook instead of PostContext
import { usePosts } from '../context/PostContext';

const initialPosts = [
  {
    id: "1",
    user: 'Amina Khan',
    location: 'Hunza, Gilgit-Baltistan',
    description: 'Enjoying the Breathtaking view of Attabad Lake',
    likes: 239,
    comments: 13,
    image: 'https://lh5.googleusercontent.com/p/AF1QipOXfa4Ym4iWznbcGcifcW--yb85Za2-T3gdBumd=w608-h351-n-k-no',
  },
  {
    id: "2",
    user: 'Faisal Ahmed',
    location: 'Badshahi Mosque, Lahore',
    description: 'Mesmerized by the architectural beauty of Badshahi Mosque',
    likes: 239,
    comments: 13,
    image: 'https://media.istockphoto.com/id/1386446426/photo/badshahi-mosque.jpg?s=612x612&w=0&k=20&c=vShhc9rb17q_5k-tx_HJnlDvlE4YjCNNlOCEWplI2_Y=',
  },
  {
    id: "3",
    user: 'Abrar Ahmed',
    location: 'Faisal Mosque, Islamabad',
    description: 'Faisal Mosque, an iconic and breathtaking structure and one of the largest mosques in the world.',
    likes: 51,
    comments: 0,
    image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT0y2ssjUoqquv9gOWU0dlch-WR9dPqewpVzFzkYC7QDrERUm4MIwY25cNOmsPOVkd7acQNAfE5as8vNpTqA7qrGmjAuUvceY-Y_JmCRA',
  }
];

export default function FeedScreen() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Use usePosts() to get posts from context
  const { posts } = usePosts();

  const allPosts = [...posts, ...initialPosts];

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleShare = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.feedTitle}>Explore Pakistan’s Wonders</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {allPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.userInfo}>
              <Ionicons name="person-circle-outline" size={24} color="#1b5e20" />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{post.user}</Text>
                <Text style={styles.userLocation}>{post.location}</Text>
              </View>
            </View>

            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}

            {post.description && (
              <Text style={styles.description}>{post.description}</Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleLike(post.id)}
              >
                <Ionicons
                  name={likedPosts[post.id] ? 'heart' : 'heart-outline'}
                  size={20}
                  color={likedPosts[post.id] ? 'red' : '#1b5e20'}
                />
                <Text style={styles.actionText}>
                  {(post.likes ?? 0) + (likedPosts[post.id] ? 1 : 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#1b5e20" />
                <Text style={styles.actionText}>{post.comments ?? 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="#1b5e20" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 12,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userDetails: {
    marginLeft: 8,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  userLocation: {
    color: '#777',
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    color: '#1b5e20',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#1b5e20',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
