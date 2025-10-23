// app/_layout.tsx
import React from 'react';
import { Stack, useSegments } from 'expo-router';
import AppLayout from '../components/AppLayout';

export default function Layout() {
  const segments = useSegments(); // mevcut route path’ini verir
  const current = segments[0];    // örneğin "login", "products" gibi

  // Eğer login veya register sayfasındaysa AppLayout göstermeyelim
  const isAuthPage = current === 'login' || current === 'register';

  if (isAuthPage) {
    return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // 🔹 Diğer tüm sayfalar (örnek: products, my-products, settings...) AppLayout içinde gözüksün
  return (
    <AppLayout title="BekoSIRS">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="products" />
        <Stack.Screen name="my-products" />
        <Stack.Screen name="settings" />
      </Stack>
    </AppLayout>
  );
}
