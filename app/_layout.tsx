import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import LogoScreen from '@/app/logoScreen';
import { useGlobalStore } from '@/store/globalStore';

export default function RootLayout() {
    const [splashDone, setSplashDone] = useState(false);
    const router = useRouter();
    const loggedIn = useGlobalStore(state => state.loggedIn);


    useEffect(() => {
        if (splashDone) {
            // ✅ Router is ready now — this is safe
            router.navigate(!loggedIn ? '/login' : '/(tabs)');
        }
    }, [loggedIn, router, splashDone]);

    return (
        <View style={styles.container}>
            <Slot />
            {!splashDone && (
                <View style={StyleSheet.absoluteFill}>
                    <LogoScreen onAnimationEnd={() => setSplashDone(true)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
