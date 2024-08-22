import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Keyboard, TouchableWithoutFeedback, Linking } from 'react-native';
import { ThemedInput } from '@/components/ThemedInput'; 
import { ThemedText } from '@/components/ThemedText';
import TypeWriter from '@/components/TypeWriter';
import { useSQLiteContext } from 'expo-sqlite'; 
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [isUnique, setUnique] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const checkEmail = async () => {
      if (emailRegex.test(email)) {
        let url = process.env.EXPO_PUBLIC_BACKEND_URL + `/api/check/email?email=${encodeURIComponent(email)}`;
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to check email.');
          }

          const { exists } = await response.json();
          if (!isCancelled) {
            setUnique(!exists);
          }
        } catch (error) {
          console.log('Error checking email:', error);
          if (!isCancelled) {
            setUnique(false);
          }
        }
      } else {
        setUnique(true); 
      }
    }
    checkEmail();
    return () => {
      isCancelled = true;
    };
  }, [email]);

  const handleLogin = async () => {
    if (!email || !fullname) {
      Alert.alert('Validation Error', 'Please fill in both fields');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }
    try {
      // Perform authentication here (e.g., call an API)
      // Simulate successful login
      const loggedIn = true; // Replace with actual authentication logic
      if (loggedIn) {
        await db.runAsync(
          'INSERT OR REPLACE INTO user (id, email, fullname) VALUES (?, ?, ?)',
          [1, email, fullname]
        );
        setShowForm(false);
        // router.replace('(tabs)');
      } else {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', 'An error occurred while logging in');
    }
  };

  const onPressRedirect = async () => {
    try {
      const url = process.env.EXPO_PUBLIC_BACKEND_URL + `/api/oauth/link?email=${encodeURIComponent(email)}&fullname=${encodeURIComponent(fullname)}`;
      console.log(url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch authorization URL');
      }

      const { authUrl } = await response.json();

      // Redirect to auth URL 
      Linking.openURL(authUrl);

    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', 'An error occurred while logging in');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {showWelcome ? (
          <TypeWriter 
            text="Bonjour" 
            speed={100} 
            style={styles.welcome} 
          />
        ) : (
          showForm ? (
            <>
              <ThemedInput
                style={[styles.input, { backgroundColor } ]}
                placeholder="Nom et prénom"
                value={fullname}
                onChangeText={setFullname}
                inputType="text" 
              />
              <ThemedInput
                style={[styles.input, { backgroundColor } ]}
                placeholder="Adresse mail"
                value={email}
                onChangeText={setEmail}
                inputType="email" 
              />
              {
                isUnique ? null : <Text style={styles.errorMessage}> Adresse email déjà utilisé </Text>
              }
              <TouchableOpacity 
                style={[styles.loginButton, { backgroundColor }]} 
                onPress={handleLogin}
                disabled={!isUnique}
              >
                <ThemedText style={[ styles.loginButtonText,{ color: textColor }]} >Suivant</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
             <ThemedText style={styles.desc} > Pour continuer, veuillez cliquer sur le bouton ci-dessous afin de nous autoriser à accéder à votre compte eWeLink et à manipuler les appareils connectés associés. </ThemedText>
             <TouchableOpacity style={[styles.loginButton, { backgroundColor }]} onPress={onPressRedirect}>
              <ThemedText style={[ styles.loginButtonText,{ color: textColor }]} >Autoriser</ThemedText>
             </TouchableOpacity>
            </>
          ) 
          
        )}
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontFamily: 'PlayWrite',
    fontSize: 23,
    marginBottom: 20,
    paddingTop: 25,
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 21,
    borderColor: 'transparent',
    textAlign: 'center',
  },
  loginButton: {
    width: 'auto',
    borderRadius: 21,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 50,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    textAlign: 'center'
  },
  errorMessage: {
    color: 'red'
  }
});
