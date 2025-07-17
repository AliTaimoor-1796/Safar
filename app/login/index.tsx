// LoginScreen.tsx
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Text,
    SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useGlobalStore } from '../../store/globalStore';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
    const route = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const globalEmail = useGlobalStore(state => state.email);
    const globalPassword = useGlobalStore(state => state.password);
    const setLoggedin = useGlobalStore(state => state.setLoggedin);

    const handleLogin = () => {
        if (email === globalEmail && password === globalPassword) {
            setLoggedin(true)
            route.navigate('/(tabs)')
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.card}>
                <Text style={styles.title}>Welcome to Safar</Text>
                <Text style={styles.subtitle}>Your journey through Pakistan begins here</Text>

                <View style={styles.tabContainer}>
                    <Text style={[styles.tabText, styles.activeTab]}>Login</Text>
                    <Text style={styles.tabText}>Sign Up</Text>
                </View>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    mode="contained"
                    onPress={() => handleLogin()}
                    style={styles.loginButton}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Login
                </Button>

                <Text style={styles.orText}>Or continue with</Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome name="facebook" size={20} color="#3b5998" />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome name="twitter" size={20} color="#1DA1F2" />
                        <Text style={styles.socialText}>Twitter</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4',
        padding: 20,
    },
    backText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    logo: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#065f46',
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 120
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#065f46',
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        color: '#6b7280',
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    tabText: {
        fontSize: 16,
        color: '#6b7280',
    },
    activeTab: {
        fontWeight: 'bold',
        color: '#111827',
        borderBottomWidth: 2,
        borderBottomColor: '#065f46',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        fontSize: 14,
    },
    passwordContainer: {
        position: 'relative',
    },
    forgotPassword: {
        position: 'absolute',
        right: 10,
        top: 18,
    },
    forgotPasswordText: {
        color: '#047857',
        fontSize: 12,
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: '#047857',
        borderRadius: 8,
    },
    orText: {
        textAlign: 'center',
        color: '#6b7280',
        marginVertical: 15,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 10,
        borderRadius: 6,
        width: '48%',
        justifyContent: 'center',
    },
    socialText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    footerText: {
        marginTop: 15,
        fontSize: 12,
        textAlign: 'center',
        color: '#6b7280',
    },
});
