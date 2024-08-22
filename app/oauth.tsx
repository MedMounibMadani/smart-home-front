import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { storeUser } from '@/hooks/useCheckUser';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

export default function OAuth() {
  const router = useRouter();
  const { code, region, state } = useLocalSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const sendAuthCode = async () => {
      try {
        // Send the code to your backend
        const response = await axios.post(process.env.EXPO_PUBLIC_BACKEND_URL+'/api/oauth/token', { code, region, state });
        const { user } = response.data;
        
        // Store the access token
        await storeUser( { email: user.email, fullname: user.fullname, accessToken: user.token } );
        const userData = {
          id: 1, // Replace with actual user ID
          email: user.email,
          fullname: user.fullname, // Replace with actual full name
          accessToken: user.token, // Replace with actual access token
        };
        dispatch(setUser(userData));

        // Redirect to the home screen
        router.replace('/'); // Use replace to avoid navigation history stack issues
      } catch (error) {
        console.error('Error sending code to backend', error);
      }
    }
    sendAuthCode();
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText> Authorizing.. </ThemedText>
      <ActivityIndicator size={"large"} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
