import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PostProvider } from '../context/PostContext';


export default function Layout() {
  return (
    <PostProvider> {/* ✅ Wrap Tabs inside PostProvider */}
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'index') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'feed') {
              iconName = focused ? 'compass' : 'compass-outline';
            } else if (route.name === 'journey') {
              iconName = focused ? 'map' : 'map-outline';
            } else {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1b5e20',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0.5,
            borderTopColor: '#e0e0e0',
            height: 60,
            paddingBottom: 8,
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
        <Tabs.Screen name="journey" options={{ title: 'Journey' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </PostProvider>
  );
}
