import { Stack, SplashScreen } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Bu, açılış ekranının hemen kaybolmasını önler
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ presentation: 'modal', title: 'Kayıt Ol' }} />
      </Stack>
    </AuthProvider>
  );
}