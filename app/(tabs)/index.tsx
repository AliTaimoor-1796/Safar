import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface items {
  title?: string,
  image: string,
  days?: string
}

interface SectionProps {
  title: string;
  items: items[];
}

const HomeScreen = () => {

  const popularDestinations = [
    { title: 'K2, Gilgit-Baltistan', image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ_LJjKVCDey4tIBfSwpGYuNNCdeGSn4ugKaPpJ8FmnqgpWqDbSeh_8dMVRupqyPIWT4bRIDgd8hQ6YXtB17nGHXVkCJyYo0NW_kQk2_Q' },
    { title: 'Saif-ul-Malook Lake, KPK', image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTQksdv8Lt_GVr7dzJXE_wZblzKg5X2AT3joT7RJqWv7UKX2MEP45180s9_TrdgskZ39enLrBya6m3a2g_CU9gJprrbO2UiNQdMctpinA' },
    { title: 'Mohenjo-daro, Sindh', image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRnByrKtgG3U-y4r4IzLDur5h3VUDMNsaWV5auz-wjGdQZcPJ9wdw-8q9gsFSTu_XWYJvVvCcKl1wWmvw5i2ESws0BJr0spKY3G8LhlLNk' },
  ];

  const upcomingTrips = [
    { title: 'Northern Areas Adventure', days: '10 days', image: 'https://zenapartments.com.pk/wp-content/uploads/2023/03/Northern-Areas-of-Pakistan.jpg' },
    { title: 'Cultural Tour of Pakistan', days: '7 days', image: 'https://www.pakistantravelblog.com/wp-content/uploads/2020/06/title-1.jpg' },
    { title: 'Coastal Exploration of Sindh', days: '5 days', image: 'https://tripjive.com/wp-content/uploads/2024/11/sustainable-tourism-1-1024x585.jpg' },
  ];

  const trendingExperiences = [
    { title: 'Cherry Blossom Festival in Hunza', image: 'https://incrediblepakistan.com/wp-content/uploads/2019/07/beautiful-landscape-hunza-valley-autumn-season-northern-area-pakistan-67742927.jpg' },
    { title: 'Shalimar Gardens Light Show, Lahore', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/39/ae/f2/the-shalimar-gardens.jpg?w=1200&h=-1&s=1' },
    { title: 'Makran Coast Jeep Safari, Balochistan', image: 'https://cdn.sanity.io/images/we0tdimr/production/b54fc86c6d3e34b77dd20e3d93ad13ab6d5ee6ac-1920x1240.jpg?rect=0,80,1920,1080&w=1920&h=1080&q=70&auto=format' },
  ];

  const Section: React.FC<SectionProps> = ({ title, items }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.days && <Text style={styles.cardSubtitle}>{item.days}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              source={require('@/assets/logo/SAFAR_scaled_up.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>   Discover Pakistan's Hidden Gems  </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where in Pakistan?"
            placeholderTextColor="#888"
          />
        </View>

        {/* Sections */}
        <Section title="Popular Destinations" items={popularDestinations} />
        <Section title="Upcoming Trips" items={upcomingTrips} />
        <Section title="Trending Experiences" items={trendingExperiences} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    backgroundColor: '#057958',
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#057958',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    marginRight: 12,
    width: 250,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardTextContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
  },
  logo: {
    marginTop: -10,
    width: 70,
    height: 70,
  },
});

export default HomeScreen;
