// app/logoScreen/index.tsx
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoScreenProps {
  onAnimationEnd: () => void;
}

const LogoScreen: React.FC<LogoScreenProps> = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onAnimationEnd(); // just disappear after 2 seconds
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@/assets/logo/SAFAR.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default LogoScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#057958',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom:100,
  },
});
