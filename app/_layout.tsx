import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { NetworkingProvider } from '@/contexts/NetworkingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <NetworkingProvider>
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="fair-plan" options={{ headerShown: false }} />
        <Stack.Screen name="live-stream" options={{ headerShown: false }} />
        <Stack.Screen name="navigation" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="stand-detail" options={{ headerShown: false }} />
        <Stack.Screen name="networking" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="ar-view" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      </NetworkingProvider>
    </AuthProvider>
  );
}
