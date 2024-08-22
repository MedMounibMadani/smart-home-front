import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState, useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import store from '../store';
import { checkUserLoggedIn, getUser } from '@/hooks/useCheckUser';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import * as Linking from 'expo-linking';


SplashScreen.preventAutoHideAsync();

interface QueryParams {
  code?: string;
  region?: string;
  state?: string;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PlayWrite: require('../assets/fonts/PlaywriteNL-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const loadUserStatus = async () => {
      try {
        const loggedIn = await checkUserLoggedIn();        
        if (!loggedIn) {
          router.replace('/login'); 
        } 
      } catch (error) {
        console.log(error);
        router.replace('/login');
      }
    };
    loadUserStatus();
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const parsedUrl = Linking.parse(url);
      const { code, region, state } = (parsedUrl.queryParams || {}) as QueryParams;

      if (code) {
        router.replace({
          pathname: '/oauth',
          params: { code, region, state }
        });
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleUrl(initialUrl);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SQLiteProvider databaseName="mydb">
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </SQLiteProvider>
      </ThemeProvider>
    </Provider>
  );
}
